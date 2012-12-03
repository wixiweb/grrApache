var grrapache = grrapache || {};
/**
 * 
 */
grrapache.controller = {
    config : {},
    currentServer : 0,
    serverCollection : null,
    
    /**
     *
     */
    init : function() {
        $.mobile.defaultPageTransition = 'slide';
        
        // Progressively hide the loader
        $('.loader').css('opacity', 0);
        $('.btn-server').hide();
       
        var that = this;
        $.ajax({
            url : 'app/grrapache.json',
            type : 'GET',
            async : false,
            dataType : 'json',
            success : function(json) {
                that.config = json;
            }
        });

        // Close the splashscreen after 4 secs
        var splashscreenTimeout = setTimeout(function() {
            $.mobile.changePage('#server-list');
            $('.loader').hide();
            $('.btn-server').show();
            clearTimeout(splashscreenTimeout);
        }, 2000);
    },
    /**
     *
     */
    getServerService : function() {
        return new grrapache.service.server(
            grrapache.model.parserInfo,
            grrapache.model.parserStatus
        );
    },
    /**
     * 
     */
    getServerList : function() {
        var itemCollection = [],
            service = this.getServerService();

        if (this.serverCollection === null) {
            this.serverCollection = [];
            
            for (var j = 0; j < this.config.server.length; j++) {
                var options = this.config.server[j],
                    infoPath = (options.infoPath !== undefined)
                        ? options.infoPath
                        : undefined
                    ,
                    statusPath = (options.statusPath !== undefined)
                        ? options.statusPath
                        : undefined
                ;
                
                var server = service.getServer(
                    options.id,
                    options.label,
                    options.url,
                    infoPath,
                    statusPath
                );
                    
                this.serverCollection.push(server);
            }
        }
        
        for (var i = 0; i < this.serverCollection.length; i++){
            itemCollection.push(this.serverCollection[i].toItem());
        }
        
        return itemCollection;
    },
    /**
     *
     */
    displayServerList : function() {
        var data = this.getServerList(),
            that = this
        ;

        var $template = $('.list-container');
        $template.empty();
        $("#tpl-server-list-item").tmpl(data).appendTo($template);
        $template.listview( "refresh" );
        $('[data-role="slider"]').slider();

        $('.status-bar').each(function(index, el){

            var maxClient = $(el).data('value-total');
            $(el).find('.status-bar-item').each(function(indexItem, item){
                var key = $(item).data('key');
                var value = $(item).data('value');
                $(item).css('width', (value*100/maxClient)+'%');
            });

        });
        
        $('.server-item').click(function(){
            that.currentServer = $(this).attr('id').replace('server-', '');
        })
    },
    /**
     *
     */
    getServer : function(id) {
        if (this.serverCollection === null) {
            this.getServerList();
        }
        for (var i = 0; i < this.serverCollection.length; i++) {
            if (this.serverCollection[i].getId() == id) {
                return this.serverCollection[i];
            }
        }
        return null;
    },
    /**
     *
     */
    displayServer : function(id) {
        var server = this.getServer(id);
        
        if (server === null) {
            /* @todo error ! */
            console.log(id);
            throw new Exception('Server not found !');
        }
        
        $('#server-title').html($('#server-title').html() + server.getLabel());
        var $container = $('.infos-container').first(),
            pieSize = Math.round($(document).width() / 4),
            dataHistory = {'busyworkers':[], 'cpuload':[]}
        ;
        // Display server pie chart
        var displayPieCharts = function() {
            var busyWorker = server.getStatusData().busyworkers,
                idleWorker = server.getActualMaxClient() - busyWorker,
                cpu = server.getStatusData().cpuload
            ;

            $("#busy-worker").sparkline([busyWorker, idleWorker], {
                type: 'pie',
                width: pieSize,
                offset:270,
                sliceColors: ['#E0642E', '#BCE02E'],
                height: pieSize,
                borderWidth: 3,
                borderColor: '#fff'
            });

            $("#cpu-load").sparkline([cpu, 100 - cpu], {
                type: 'pie',
                width: pieSize,
                offset:270,
                sliceColors: ['#E0642E', '#BCE02E'],
                height: pieSize,
                borderWidth: 3,
                borderColor: '#fff'
            });
        };
        // Display server status template
        var displayServerStatus = function() {
            var data = server.getStatusData();
                $container.html(
                    $("#tpl-server-status").tmpl({
                        cpuLoad:Math.round(parseFloat(data.cpuload) * 100) / 100,
                        busyWorkers:data.busyworkers,
                        idleWorkers:server.getActualMaxClient() - data.busyworkers,
                        uptime:data.uptime,
                        totalAccesses:data.total_accesses,
                        totalKBytes:data.total_kbytes
                    })
                );
        };
        // Display server info template
        var displayServerInfo = function(){
            var data = server.getInfoData();
            $container.html(
                $("#tpl-server-info").tmpl({
                    version:data.server_version,
                    architecture:data.server_architecture,
                    hostname:data.hostname_port,
                    mpmName:data.mpm_name,
                    maxDaemons:data.mpm_information.max_daemons,
                    timeouts:data.timeouts.connection,
                    keepalive:data.timeouts.keep_alive
                })
            );
        };
        // Display server info template
        var displayServerScoreboard = function(){
            var data = server.getScoreboard()
            $container.html(
                $("#tpl-server-scoreboard").tmpl({
                    
                })
            );
                
            $('#inline-busyworkers').sparkline(dataHistory['busyworkers'], {
                type: 'line',
                lineWidth: 2,
                width: '100%',
                height: '100',
                spotRadius: 3,
                chartRangeMax:server.getActualMaxClient()
            });
            
            $('#inline-cpuload').sparkline(dataHistory['cpuload'], {
                type: 'line',
                lineWidth: 2,
                width: '100%',
                height: '100',
                spotRadius: 3,
                chartRangeMax:100
            });

        };
        
        // Display handlers
        $('#info-handler').click(function(){
            if ($('#server-info').length < 1) {
                displayServerInfo();
            }
        });
        $('#status-handler').click(function(){
            if ($('#server-status').length < 1) {
                displayServerStatus();
            }
        });
        $('#scoreboard-handler').click(function(){
            if ($('#server-scoreboard').length < 1) {
                displayServerScoreboard();
            }
        });
        displayServerScoreboard();
        displayPieCharts();
        
        var that = this;
        var refreshTimer = setInterval(function() {
            var serverService = that.getServerService();
            serverService.refreshStatusData(server);

            
            if(dataHistory['busyworkers'].length > 30){
                dataHistory['busyworkers'].shift();
            }
            dataHistory['busyworkers'].push(server.getStatusData().busyworkers);
            //dataHistory['busyworkers'].push(Math.floor((Math.random()*30)+1));

            if(dataHistory['cpuload'].length > 30){
                dataHistory['cpuload'].shift();
            }
            dataHistory['cpuload'].push(server.getStatusData().cpuload);
            //dataHistory['cpuload'].push(Math.floor((Math.random()*30)+1));

            displayPieCharts();
            if ($('#server-info').length > 0) {
                displayServerInfo();
            }
            else if ($('#server-status').length > 0){
                displayServerStatus();
            }
            else {
                displayServerScoreboard();
            }
        }, 3000);

        $('#server-infos[data-role="page"]').bind('pagebeforehide', function (event, ui) {
            clearInterval(refreshTimer);
            dataHistory = {'busyworkers':[], 'cpuload':[]}
        });
    }
    
}

/*$(function() {

    var service = new grrapache.service.server(
        grrapache.model.parserInfo,
        grrapache.model.parserStatus
    );
    
    var server = service.getServer('http://localhost:8080');

    console.log(server);

});*/


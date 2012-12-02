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
        
        var splashscreenTimeout = setTimeout(function() {
            $.mobile.changePage('#server-list');
            clearTimeout(splashscreenTimeout);
        }, 1000);
        
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
    },
    
    /**
     * 
     */
    getServerList : function() {
        var itemCollection = [],
            service = new grrapache.service.server(
            grrapache.model.parserInfo,
            grrapache.model.parserStatus
        );

        if (this.serverCollection === null) {
            this.serverCollection = [];
            
            for (var j = 0; j < this.config.server.length; j++) {
                var options = this.config.server[j];
                var server = service.getServer(
                    options.id,
                    options.label,
                    options.url
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
                return this.serverCollection[i].toItem();
            }
        }
        return null;
    },
    /**
     *
     */
    displayServer : function(id) {
        var data = this.getServer(id);
        
        if (data === null) {
            /* @todo error ! */
        }
        
        // Load Content template
        $("#tpl-server-info").tmpl(data).appendTo($('.infos-container'));

        // Enable Slider
        $('[data-role="slider"]').slider();

        $("#busy-worker").sparkline(data.status, {
            type: 'pie',
            width: '128',
            sliceColors: ['#BCE02E','#E0642E', '#E0642E', '#E0642E', '#E0D62E', '#E0642E', '#E0642E', '#E0642E', '#E0642E', '#E0642E', '#fcfcfc'],
            height: '128',
            borderWidth: 3,
            borderColor: '#ccc'
        });

        $("#cpu-load").sparkline([data.cpu, 100], {
            type: 'pie',
            width: '128',
            sliceColors: ['#E0642E', '#BCE02E'],
            height: '128',
            borderWidth: 3,
            borderColor: '#ccc'
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


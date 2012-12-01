var grrapache = {
    
    getServerInfo : function(server) {
        
        var that = this,
            url = server.getModInfoUrl()
        ;
        
        $.ajax({
            url : url,
            type : 'GET',
            dataType : 'xml',
            beforeSend : function() {
                
            },
            success : function(xml) {
                var attr = that.parserInfo.setContent(xml).run();
                
                
            }
        });
    },
    
    getServerStatus : function(server) {
        var that = this,
            url = server.getModStatusUrl()
        ;
        $.ajax({
            url : url,
            type : 'GET',
            async : false,
            dataType : 'text',
            beforeSend : function() {},
            success : function(text) {
                server.setStatusData(that.parserStatus.setContent(text).run());
                server.setScoreboard(
                    new that.scoreboard(server.getStatusData().scoreboard)
                );
            }
        });
    }
};

$(document).ready(function(){
    
    var server = new grrapache.server('http://localhost:8080');
    
    grrapache.getServerStatus(server);
    console.log(server.getScoreboard.countByKey('keepalive'));
    
    
});


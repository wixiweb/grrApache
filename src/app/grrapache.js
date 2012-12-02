var grrapache = grrapache || {};
/**
 * 
 */
grrapache.controller = {
    /**
     * 
     */
    getServerList : function() {
        var collection = [],
            service = new grrapache.service.server(
            grrapache.model.parserInfo,
            grrapache.model.parserStatus
        );

        var server = service.getServer(
            'localhost',
            'http://localhost:8080'
        );
            
        var serverToItem = function (model) {
            var flags = [
                'waiting',
                'starting',
                'reading',
                'sending',
                'keepalive',
                'dns',
                'closing',
                'logging',
                'finishing',
                'cleaning',
                'idle'
            ],
                status = {}
            ;
            
            for (var i = 0; i < flags.length; i++) {
                status[flags[i]] = model.getScoreboard().countByKey(flags[i]);
            } 
            
            return {
                'title':model.getLabel(),
                'website':model.getUrl(),
                'maxClient':model.getActualMaxClient(),
                'status':status,
                'indice':Math.round(
                    parseFloat(model.getStatusData().cpuload) * 100
                ) / 100 + '%'
            };
        }
        
        collection.push(serverToItem(server));
        
        return collection;
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


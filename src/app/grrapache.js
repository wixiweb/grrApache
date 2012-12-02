var grrapache = grrapache || {};

$(function() {

    var service = new grrapache.service.server(
        grrapache.model.parserInfo,
        grrapache.model.parserStatus
    );
    
    var server = service.getServer('http://localhost:8080');

    console.log(server);

});


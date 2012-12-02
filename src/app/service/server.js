var grrapache = grrapache || {};
grrapache.service = grrapache.service || {};
/**
 *
 */
grrapache.service.server = function(modInfoParser, modStatusParser) {
    this.modInfoParser = modInfoParser;
    this.modStatusParser = modStatusParser;
}
/**
 *
 */
grrapache.service.server.prototype = {
    /**
     * 
     */
    getServer : function(url, infoPath, statusPath) {
        var server = new grrapache.model.server(url, infoPath, statusPath);
        this.getInfoData(server);
        this.refreshStatusData(server);
        return server.setIsPopulate(true);
    },
    /**
     * 
     */
    getInfoData : function(server) {
        var that = this,
            url = server.getModInfoUrl()
        ;
        $.ajax({
            url : url,
            type : 'GET',
            async : false,
            dataType : 'xml',
            success : function(xml) {
                server.setInfoData(that.modInfoParser.setContent(xml).run());
            }
        });
    },
    /**
     * 
     */
    refreshStatusData : function(server) {
        var that = this,
            url = server.getModStatusUrl()
        ;
        $.ajax({
            url : url,
            type : 'GET',
            async : false,
            dataType : 'text',
            success : function(text) {
                server.setStatusData(that.modStatusParser.setContent(text).run());
                server.setScoreboard(new grrapache.model.scoreboard(
                    server.getStatusData().scoreboard
                ));
            }
        });
    }
}

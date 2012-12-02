var grrapache = grrapache || {};
grrapache.model = grrapache.model || {};
/**
 *
 */
grrapache.model.server = function(url, infoPath, statusPath) {
    this.url = url;
    this.infoPath = (typeof infoPath === 'string' && infoPath.length > 0)
        ? infoPath
        : 'server-info'
    ;
    this.statusPath = (typeof statusPath === 'string' && statusPath.length > 0)
        ? statusPath
        : 'server-status'
    ;
    
    this.isPopulate = false;
    this.infoData = {};
    this.statusData = {};
    this.scoreboard = null;
};
/**
 *
 */
grrapache.model.server.prototype = {
    /**
     * @return string
     */
    getUrl : function() {
        return this.url;
    },
    /**
     * @return string
     */
    getInfoPath : function() {
        return this.infoPath;
    },
    /**
     * @return string
     */
    getStatusPath : function() {
        return this.statusPath;
    },
    /**
     *
     */
    getModStatusUrl : function(refreshInt) {
        var chunks = [
            this.getUrl(),
            this.getStatusPath(),
            '?auto'
        ],
        url = chunks.join('/')
        ;
        
        return (typeof refreshInt === 'number')
            ? url + '&refresh=' + refreshInt
            : url
        ;
    },
    /**
     *
     */
    getModInfoUrl : function() {
        var chunks = [
            this.getUrl(),
            this.getInfoPath(),
            '?server'
        ];
        return chunks.join('/')
    },
    /**
     * 
     */
    setScoreboard : function(scoreboard) {
        this.scoreboard = scoreboard;
        return this;
    },
    /**
     * @return grrapache.scoreboard
     */
    getScoreboard : function() {
        return this.scoreboard;
    },
    /**
     *
     */
    setIsPopulate : function(bool) {
        this.isPopulate = bool;
        return this;
    },
    /**
     *
     */
    getIsPopulate : function() {
        return this.isPopulate;
    },
    /**
     *
     */
    setInfoData : function(data) {
        this.infoData = data;
        return this;
    },
    /**
     *
     */
    getInfoData : function() {
        return this.infoData;
    },
    /**
     *
     */
    setStatusData : function(data) {
        this.statusData = data;
        return this;
    },
    /**
     *
     */
    getStatusData : function() {
        return this.statusData;
    },
    /**
     *
     */
    getActualMaxClient : function() {
        if (this.isPopulate() === false) {
            return 0;
        }
        var info = this.getInfoData();
        if (info.mpm_name === 'Prefork') {
            return info.mpm_information.max_daemons;
        }
        else {
            return this.getScoreboard().getData().length;
        }
    }
    
};
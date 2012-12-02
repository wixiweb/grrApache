var grrapache = grrapache || {};
grrapache.model = grrapache.model || {};
/**
 *
 */
grrapache.model.server = function(id, label, url, infoPath, statusPath) {
    this.id = id;
    this.label = label;
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
     * @return int
     */
    getId : function() {
        return this.id;
    },
    /**
     * @return string
     */
    getLabel : function() {
        return this.label;
    },
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
        if (this.getIsPopulate() === false) {
            return 0;
        }
        var info = this.getInfoData();
        if (info.mpm_name === 'Prefork') {
            return info.mpm_information.max_daemons;
        }
        else {
            return this.getScoreboard().getData().length;
        }
    },
    /**
     * 
     */
    toItem : function() {
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
            status[flags[i]] = this.getScoreboard().countByKey(flags[i]);
        } 

        return {
            'id':this.getId(),
            'title':this.getLabel(),
            'website':this.getUrl(),
            'maxClient':this.getActualMaxClient(),
            'version':this.getInfoData().server_version,
            'architecture':this.getInfoData().server_architecture,
            'status':status,
            'indice':Math.round(parseFloat(this.getStatusData().cpuload) * 100) / 100
        };
    }
    
};
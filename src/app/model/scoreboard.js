var grrapache = grrapache || {};
grrapache.model = grrapache.model || {};
/**
 *
 */
grrapache.model.scoreboard = function(data) {
    /**
     * @var object
     */
    this.flags = {
        waiting   : '_',
        starting  : 'S',
        reading   : 'R',
        sending   : 'W',
        keepalive : 'K',
        dns       : 'D',
        closing   : 'C',
        logging   : 'L',
        finishing : 'F',
        cleaning  : 'I',
        idle      : '.'
    };
    /**
     * @var string
     */
    this.data = '';
    
    if (typeof data === 'string') {
        this.setData(data);
    }
}
/**
 *
 */
grrapache.model.scoreboard.prototype = {
    /**
     * @return grrapache.model.scoreboard
     */
    setData : function(data) {
        if (typeof data === 'string') {
            this.data = data;
        }
        return this;
    },
    /**
     * @return string
     */
    getData : function() {
        return this.data;
    },
    
    /**
     * @return int
     */
    countByKey : function(scoreboardKey) {
        for (var key in this.flags) {
            if (key === scoreboardKey) {
                return (
                    this.getData().split(this.flags[scoreboardKey]).length - 1
                )
            }
        }
        return undefined;
    }
};
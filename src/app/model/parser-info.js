var grrapache = grrapache || {};
grrapache.model = grrapache.model || {};
/**
 *
 */
grrapache.model.parserInfo = {
    /**
     * @var string
     */
    content : null,
    /**
     * @return grrapache.model.parserInfo
     */
    setContent : function(xmlContent) {
        if (typeof content === 'object') {
            this.content = xmlContent;
        }
        return this;
    },
    /**
     * @return string
     */
    getContent : function() {
        return this.content;
    },
    
    /**
     * @return object
     */
    run : function() {
        var that = this,
            attr = {},
            xml = this.getContent()
        ;
        
        if (xml === null) {
            return attr;
        }
        
        $(xml).find('dt').each(function(){
            var key = $(this).find('strong').text(),
                val = $(this).find('tt').text()
            ;

            key = that.sanitizeKey(key.replace(':', ''));
            
            switch (key) {
                case 'timeouts' : 
                    attr[key] = {};
                    var chunks = val.replace(/\s{2,}/, ';').split(';');
                    for (var i = 0; i < chunks.length; i++) {
                        var subChunks = chunks[i].split(':');
                        attr[key][that.sanitizeKey(subChunks[0])]
                            = subChunks[1].trim()
                        ;
                    }
                    break;

                case 'mpm_information' :
                    attr[key] = {};
                    var chunks = val.replace(/:\s/g, ':')
                        .replace('Max Daemons', that.sanitizeKey('Max Daemons'))
                        .split(' ')
                    ;
                    for (var i = 0; i < chunks.length; i++) {
                        var subChunks = chunks[i].split(':');
                        attr[key][that.sanitizeKey(subChunks[0])] = subChunks[1];
                    }
                    break;
                
                default : 
                    attr[key] = val;
                    break;
            }
        });
        
        this.content = null;
        
        return attr;
    },
    /**
     * 
     */
    sanitizeKey : function(key) {
        if (typeof key === 'string') {
            key = key.toLowerCase().replace(' ', '_').replace('/', '_');
        }
        return key;
    }
};
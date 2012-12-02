var grrapache = grrapache || {};
grrapache.model = grrapache.model || {};
/**
 *
 */
grrapache.model.parserStatus = {
    /**
     * @var string
     */
    content : '',
    /**
     * @return grrapache.model.parserInfo
     */
    setContent : function(content) {
        if (typeof content === 'string') {
            this.content = content;
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
            rows = this.getContent().split("\n"),
            attr = {}
        ;
                
        $.each(rows, function(index, row) {
            if (row.trim().length > 0) {
                var chunks = row.split(':'),
                    key = that.sanitizeKey(chunks[0]),
                    val = chunks[1].trim()
                ;

                attr[key] = val;
            }
        });
        
        this.content = '';
        
        return attr;
    },
    /**
     * 
     */
    sanitizeKey : function(key) {
        if (typeof key === 'string') {
            key = key.toLowerCase().replace(' ', '_');
        }
        return key;
    }
};
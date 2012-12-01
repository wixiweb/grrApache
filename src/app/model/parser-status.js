grrapache.parserStatus = {
    /**
     * @var string
     */
    content : '',
    /**
     * @return grrapache.parserInfo
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
        var rows = this.getContent().split("\n"),
            attr = {}
        ;
                
        $.each(rows, function(index, row) {
            if (row.trim().length > 0) {
                var chunks = row.split(':'),
                    key = chunks[0].toLowerCase().replace(' ', '_'),
                    val = chunks[1].trim()
                ;

                attr[key] = val;
            }
        });
        
        this.content = '';
        
        return attr;
    }
};
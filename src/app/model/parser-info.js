grrapache.parserInfo = {
    /**
     * @var string
     */
    content : null,
    /**
     * @return grrapache.parserInfo
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
        var attr = {},
            xml = this.getContent()
        ;
        
        if (xml === null) {
            return attr;
        }
        
        $(xml).find('dt').each(function(){
            var key = $(this).find('strong').text(),
                val = $(this).find('tt').text()
            ;

            key = key.replace(':', '').toLowerCase().replace(' ', '_');

            attr[key] = val;
        });
        
        this.content = null;
        
        return attr;
    }
};
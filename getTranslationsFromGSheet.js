

$.getJSON("https://hypothes.is/api/search?tag=ETT:hasTranslation", function (data) {
    var textsAndTranslations =[]
    $.each(data.rows, function (i, item) {
        console.log(item);
        var textTranslation = {
        }
        
        //store text in a variable for evaluation
        var SourceText = ""; //save here the tag that identifies the source, as the url is not always usable.
        
        var taglist = item.tags //save all the tags of this item in a list to check whether it contains something or not
        
        
        var t = item.text //store the text of the annotation in this variable
        
        // the following loop stores the identifier of the source in the SourceText varible
        $.each(item.tags, function (ta, TAG) {
            if (TAG.startsWith("tlg")) {
                SourceText = TAG
            } else if (TAG.startsWith("ettimage")) {
                SourceText = TAG
            } else {
            };
        });
        
        
        
        if ('selector' in item.target[ "0"]) {
            var selectedText = item.target[ "0"].selector[3].exact;
            if (selectedText.startsWith('http')) { textTranslation.source = '<a href="' + selectedText + '">translation</a>'
            } else {
                textTranslation.source = selectedText
            }
        } else {
            textTranslation.source = '<a href="' + item.target[ "0"].source + '">source</a>'
        };
        //this adds the text from the annotation
        
        
        var contentTranslation = item.text
        if (contentTranslation.startsWith('http')) {
            textTranslation.translation = '<a href="' + contentTranslation + '">translation</a>'
        } else {
            textTranslation.translation = contentTranslation
        };
        
        textTranslation.link = '<a href="' + item.links.incontext + '">' + item.document.title[0] + '</a> (<a href="http://catalog.perseus.org/catalog/urn:cts:greekLit:' + SourceText + '">' + SourceText + '</a>)'
        
        textsAndTranslations.push(textTranslation);
        console.log(textTranslation)
    });
    $(textsAndTranslations).each(function (i, transl) {
        var trans = transl.translation
        $('#translationID').append('<div class="row"><div class="col-md-2">' + transl.link + '</div><div class="col-md-5">' + transl.source + '</div><div class="col-md-5">' + trans + '</div></div><hr/>')
    });
});
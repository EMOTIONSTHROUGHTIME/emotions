

$.getJSON("https://hypothes.is/api/search?tag=ETT:hasTranslation", function (data) {
var textsAndTranslations =[]
    $.each(data.rows, function (i, item) {
        console.log(item);
        var textTranslation = {
        }
        
        if('selector' in item.target["0"]){textTranslation.source = item.target["0"].selector[3].exact} else {textTranslation.source = item.target["0"].source}; //this adds the text from the annotation
        
         textTranslation.translation = item.text

         textTranslation.link = '<a href="' + item.links.incontext + '">' +item.document.title[0]+'</a>'

         textsAndTranslations.push(textTranslation);
        console.log(textTranslation)
        
    });
 $(textsAndTranslations).each(function (i, transl) {
                var trans = transl.translation
                $('#translationID').append('<div class="row"><div class="col-md-2">' + transl.link + '</div><div class="col-md-5">' + transl.source + '</div><div class="col-md-5">' + trans + '</div></div><hr/>')
            });
});

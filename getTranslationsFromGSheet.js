

$.getJSON("https://hypothes.is/api/search?tag=ETT:hasTranslation", function (data) {
var textsAndTranslations =[]
    $.each(data.rows, function (i, item) {
        console.log(item);
        var textTranslation = {
        }
        
        if('selector' in item.target["0"]){textTranslation.source = item.target["0"].selector[3].exact} else {textTranslation.source = item.target.source}; //this adds the text from the annotation
        
         textTranslation.translation = item.text

         textTranslation.link = '<a href="' + item.links.incontext + '">' +item.document.title[0]+'</a>'

         textsAndTranslations.push(textTranslation);
        console.log(textTranslation)
        $(textsAndTranslations).each(function (i, transl) {
                var trans = transl.translation
                $('#translationID').append('<div class="col-md-2">' + transl.link + '</div><div class="col-md-5">' + transl.source + '</div><div class="col-md-5">' + trans + '</div>')
            });
    });
});
/*
 function associateTranslation(id) { 
 $.getJSON("https://spreadsheets.google.com/feeds/list/107VGGnAAWIQyxqH9sptBHYu9SsgKUTrmNHHQu04BiE8/od6/public/basic?alt=json", function (data) {
            $.each(data.feed.entry, function (e, entry) {
                var annotationid = id;
                var translationid = entry.title.$t;
                console.log('aid' + annotationid);
                console.log('tid' + translationid);
                // console.log(item.content.$t)
                if (translationid.toString() == annotationid.toString()) {
                    console.log('yes, is the same')
                    return entry.content.$t;
                  //  textTranslation.translation = entry.content.$t // adds the translation to the object
                   
                } else {
                    'no translation'
                };
                // add the object to the array of text and translation array
            });
            //        console.log(textTranslation) textsAndTranslations.push(textTranslation);
         //  textsAndTranslations.push(textTranslation);
        });  
        };*/
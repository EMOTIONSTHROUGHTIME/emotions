// for all tagged ETT  https://hypothes.is/api/search?tag=ETT
// example below for one annotation
$(document).on('ready', function () {
/*
 this should decide the options based on existing tags in annotations

var selectValues = {}
$.each(selectValues, function(key, value) {   
     $('#input')
         .append($("<option></option>")
                    .attr("value",key)
                    .text(value)); 
});*/
$('#input').on('change', function () {


$('#JSON').empty();
 var input = this.value
var url = "https://hypothes.is/api/search?tag=" + input
$.getJSON( url, function( data ) {
console.log(data);
  var items = [];
       for (var i = 0; i < data.rows.length; i++) {
       var ann = data.rows[i]
       var text = "";
       if('selector' in ann.target["0"]){text += ann.target["0"].selector[3].exact} else {text += ann.target.source};
       var content = "";
       var contentdata = ann.text
       if(contentdata.startsWith("http")){content += "<a href='"+contentdata +"'>link</a>"} else {content += contentddata};
       var url = "";
       var urldata = ann.uri
       if(urldata.startsWith("http")){url += "<a href='"+urldata +"'>link</a>"} else {url += urldata};
       
       
      items.push( "<div id='" + ann.id + "' class='card'><div class='col-md-3'><p>" + text +"</p></div><div class='col-md-3'><p>"  + ann.document.title +"</p></div><div class='col-md-3'><p>"  + content +"</p></div><div class='col-md-3'><p>" + ann.uri + "</p></div></div>" );
};
  
  $( "<div/>", {
    "class": "row",
    html: items.join( "" )
  }).appendTo( "#JSON" );
  

});
});
});
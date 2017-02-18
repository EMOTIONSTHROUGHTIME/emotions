// for all tagged ETT  https://hypothes.is/api/search?tag=ETT
// example below for one annotation
$(document).on('ready', function () {
/*
show all
get a list of main classes
get a list of  subclassess if a class is selected
get the annotations in that that class, if a super class is selected all the annotations included taking the values from the Ontology file.

*/
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
       if(contentdata.startsWith("http")){content += "<a href='"+contentdata +"'>link</a>"} else {content += contentdata};
       var url = "";
       var urldata = ann.uri
       if(urldata.startsWith("http")){url += "<a href='"+urldata +"'>link</a>"} else {url += urldata};
       
       
      items.push( "<div class='row'><div id='" + ann.id + "' class='card'><div class='col-md-3'><p>" + text +"</p></div><div class='col-md-3'><p>"  + ann.document.title +"</p></div><div class='col-md-3'><p>"  + content +"</p></div><div class='col-md-3'><p>" + ann.uri + "</p></div></div></div>" );
};
  
  $( "<div/>", {
    "class": "row",
    html: items.join( "" )
  }).appendTo( "#JSON" );
  

});
});
});
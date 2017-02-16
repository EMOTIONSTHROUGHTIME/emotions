/*initialize data arrays*/

var nodesdata = new Array();
var edgesdata = new Array();

/*call to hypothesis api*/
$.getJSON("https://hypothes.is/api/search?tag=ETT", function (data) {
    $.each(data.rows, function (i, item) {
    
/* TODO    first take individual values of exact or not with a if selector. the node is the selected text at the selected page, the annotation id cannot really be reused
or
- each annotation is a node (as now), but also, and only once 
- the exact selection is a node 
and there is 
- an edge "oa:hasAnnotation" between this node and each annotation

use same technique as tags to make them unique (although they can be very long!!!)
if ('selector' in item.target["0"]){
        var selectedtext = new Object();
        selectedtext.id = item.document.title[1] + item/target["0"].selector[3].exact
        selectedtext.label =item/target["0"].selector[3].exact
        selectedtext.group = "selection"
        nodesdata.push(selectedtext);
    };*/ 
    
    
    // check if it is a relation annotation
    var t = item.text
      if(t.startsWith("ETT\:") && ('selector' in item.target["0"])){
   
       var selectedtext = new Object();
        selectedtext.id = item.id
        selectedtext.label = item.id + item.document.title[0]
        selectedtext.group = "relation"
        nodesdata.push(selectedtext);
        
          var relation = new Object();
          relation.from = item.id
        relation.to = item.tags[1]
        relation.label = item.text
        edgesdata.push(relation);
       
       
}
 else if(t.startsWith("http") && ('selector' in item.target["0"])){
   
       var selectedtext = new Object();
        selectedtext.id = item.id
        selectedtext.label = item.document.title[0]
        selectedtext.group = "relation"
        nodesdata.push(selectedtext);
        
         var targettext = new Object();
        targettext.id = item.id + t
        targettext.label = t
        targettext.group = "relation"
        nodesdata.push(targettext);
        
          var relation = new Object();
          relation.from = item.id
        relation.to = item.id + t
        relation.label = item.tags[1]
        edgesdata.push(relation);
       
       
}
else {
        // take the ids and title of each annotation and make it a node
        var node = new Object();
        node.id = item.id
        node.label =item.document.title[0]
        node.group = "individual"
        nodesdata.push(node);
      
      }
        
        // take each annotation and make an edge to a tag
      
        $.each(item.tags, function (t, thistag) {
          var edge = new Object();
          edge.from = item.id
        edge.to = thistag
        edge.label = 'rdf:type'
        edgesdata.push(edge);
        });
        
         // take each annotation and make an edge to a uri
        /*$.each(item.uri, function (t, thisuri) {
          var uri = new Object();
          uri.from = item.id
        uri.to = thisuri
        edgesdata.push(uri);
        });*/
    });
    
    // take each tag and make it into a node with id and label
    
    
    
    var tags = {
    };
    $.each(data.rows, function (i, item) {
        $.each(item.tags, function (t, thistag) {
            tags[thistag] = true;
        });
        
    });
    
    for (var eachtag in tags) {
        var onetag = new Object();
        onetag.id = eachtag
        onetag.label = eachtag
        onetag.group = "class"
        nodesdata.push(onetag);
    }

  
        // take each source and make a node
        /*var sources = new Object();
        $.each(data.rows, function (i, item) {
        $.each(item.uri, function (t, thisuri) {
            sources[thisuri] = true;
        });
        
    });  
        for (var eachuri in sources) {
        var oneuri = new Object();
        oneuri.id = eachuri
        oneuri.label = eachuri
        oneuri.group = "uri"
        nodesdata.push(oneuri);
    }*/
        

// create an array with nodes
var nodes = new vis.DataSet(nodesdata);

// create an array with edges
var edges = new vis.DataSet(edgesdata);

//create a network
var container = document.getElementById('mynetwork');
var data = {
    nodes: nodes,
    edges: edges
};
console.log(edgesdata)
var options = {
nodes: {
            shape: 'dot',
            size: 30,
            font: {
                size: 12
            },
            borderWidth: 2
            }
};
var network = new vis.Network(container, data, options);

//the following prints the data behind the graph to a pre element
//document.getElementById('whereToPrint').innerHTML = JSON.stringify(nodesdata, null, 4);
});


var relationslist = ["ETT:hasDate", "ETT:isManifestationOf","ETT:isAttestationOf", "ETT:hasTranslation", "ETT:hasPlace", "ETT:isNameOf", "ETT:hasIntensity", "ETT:hasActorType"]


/*initialize data arrays*/

var nodesdata = new Array();
var edgesdata = new Array();

/*call to hypothesis api*/
$.getJSON("https://hypothes.is/api/search?tag=ETT&limit=200", function (data) {// ON MORE THAN 200 ANNOTATIONS this needs to be changed!!!
    
    var tags = {};  //    collect all tags in this variable to then create only one node for each
    var contents = {    };  //    collect all contents in this variable to then create only one node for each
    console.log(data.rows.length)
    $.each(data.rows, function (i, item) { // drill down to each item in the list
        
        //store text in a variable for evaluation
        var SourceText = ""; //save here the tag that identifies the source, as the url is not always usable.
        
        var taglist = item.tags //save all the tags of this item in a list to check whether it contains something or not
        console.log(taglist)
       
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
        
        // this loops through each relation and creates an edge
        $.each(item.tags, function (ta, TAG) {
        
           if (TAG == "ETT") {console.log(item.id + item.text + 'skipping ETT')} // no edge for the general tag
           else  if (relationslist.includes(TAG)) { // if the tag is in the list of relations, use the tag as label and the text of the annotation as target
                var namedrelation = new Object();
                namedrelation.from = SourceText
                namedrelation.to = t
                namedrelation.label = TAG
                edgesdata.push(namedrelation);
              console.log(namedrelation)
              console.log(item.id + item.text + 'adding relation')
            } else if(TAG.startsWith('tlg')){console.log(item.id + item.text + 'skipping source reference')} 
            else if(TAG.startsWith('ettimage')){console.log(item.id + item.text + 'skipping source reference')} 
            else { // otherways this tag is likely to be a class, then create an edge between the tag and the source
                var relation = new Object();
                relation.from = TAG
                relation.to = SourceText
                relation.label = "rdf:type"
                console.log(relation)
                edgesdata.push(relation);
                
             //   console.log(item.id + item.text + 'adding link to class')
            }
        });
        
        // check if it is a relation annotation
        
        if (t.startsWith("ETT\:")) {
            
            
            tags[item.text] = true;
            
        } 
        else if (t.startsWith("http") && ('selector' in item.target[ "0"])) {
            
        contents[t] = true;
            
            var relation = new Object();
            relation.from = SourceText
            relation.to = t
            edgesdata.push(relation);
        } 
        else 
        if (taglist.includes("ETT:hasDate", "ETT:hasTranslation", "ETT:hasPlace")) {
            contents[t] = true;
        } 
        else {
        }
        
        // take each annotation and make an edge to a tag
        
        $.each(item.tags, function (t, thistag) {
         if ((thistag.startsWith("t")) || (thistag.startsWith("e")) || relationslist.includes(thistag)) {} else {
            var edge = new Object();
            edge.from = SourceText
            edge.to = thistag
            edge.label = 'rdf:type'
            edgesdata.push(edge);
            }
        });
    });
    
    // take each tag and make it into a node with id and label
    
    
    
    
    $.each(data.rows, function (i, item) {
        $.each(item.tags, function (t, thistag) {
            if (thistag == 'ETT') {
            } else {
                tags[thistag] = true;
            }
        });
    });
    
    
    // takes each tag ones and creates a node
    for (var eachtag in tags) {
        if(relationslist.includes(eachtag)) {} 
        else {
        var onetag = new Object();
        onetag.id = eachtag
        onetag.label = eachtag
        if (eachtag.startsWith("tlg")) {
            onetag.group = "writtensource"
        } else if (eachtag.startsWith("ettimage")) {
            onetag.group = "visualsource"
        } else {
            onetag.group = "class"
        }
        nodesdata.push(onetag);
        }
    }
    
    // takes each content ones and creates a node
    for (var C in contents) {
        
        var contenttext = new Object();
        contenttext.id = C
        contenttext.label = C
        contenttext.group = "relation"
        console.log(contenttext)
        nodesdata.push(contenttext);
    }
    
    
    
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
        scaling: {
          min: 10,
          max: 30
          
        },
        font: {
          size: 12,
          face: 'Tahoma'
        }
      },
      edges: {
        width: 0.15,
        color: {inherit: 'from'},
        smooth: {
          type: 'continuous'
        }
      },
      physics: false,
      interaction: {
        tooltipDelay: 200,
        hideEdgesOnDrag: true,
          navigationButtons: true,
          keyboard: true
      }
    };
    var network = new vis.Network(container, data, options);
    
    //the following prints the data behind the graph to a pre element
    //document.getElementById('whereToPrint').innerHTML = JSON.stringify(nodesdata, null, 4);
});
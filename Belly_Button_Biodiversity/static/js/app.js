function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  
  // Use `d3.json` to fetch the metadata for a sample
  d3.select("#sample-metadata").html("");

  d3.json(`/metadata/${sample}`).then(function(sampledata){
    for(let [key,value] of Object.entries(sampledata)){
      d3.select("#sample-metadata")
      .append('p')
      .html(`<b>${key}:</b> ${value}`);
    }
});
}
function buildCharts(sample) {

  d3.json(`/samples/${sample}`).then(function(sampledata){
    
    var data=Object.entries(sampledata);
    var otu_ids=data[0][1];
    var samplevalues=data[2][1];
    var otu_labels=data[1][1];
    
    var trace_bubblechart={
      x:otu_ids,
      y:samplevalues,
      text:otu_labels,
      mode:"markers",
      marker:{
        size:samplevalues,
        color:otu_ids
      }
    }
    var dataone=[trace_bubblechart];
    var layoutone={
      xaxis:{title:"OTU ID"}
    }
    Plotly.newPlot('bubble',dataone,layoutone);
  
    // @TODO: Build a Pie Chart
      var trace_pie={
        values:samplevalues.slice(0,9),
        labels:otu_ids.slice(0,9),
        hovertext:otu_labels.slice(0,9),
        type:'pie'
    }
    var piedata=[trace_pie];
    
    Plotly.newPlot('pie',piedata);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });
    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
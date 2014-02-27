$(function(){

initialize();

function initialize(){
  // Make textarea automatically increase in size when data is entered.
  $('.infovis-area textarea').autogrow();
  // Initialize enter data button click event
  $('#enterdata').click(function(){
    enterData(function(xaxis, data){
      plotGraph(xaxis, data);
    });
  });
}

function plotGraph(xaxisTitles, data){
  console.log("data: "+JSON.stringify(data)+" length: "+data.length);
  console.log("XAXISTITLES: "+JSON.stringify(xaxisTitles));

  var chart = [];

    // Example of length 2 data:
    // [[[0,400],[1,500],[2,600]],[[0,700],[1,800],[2,900]]]
    var label = null;
    $.each(data, function(i, line){ // for each line in data...
      
      if(data.length>1){            // if the data is multi series.
        var label = line[0][1];     // set legend label as first item in each line.
        line.splice(0,1);           // ... then remove it from data.
      }
      
      chart.push({
        label: label,
        // color: 'red',
        data: line,
        bars:{
          show:true,
          fill:1,
          barWidth: 0.2,
          align: 'center',
          order: 1
        },
        // stack: 1
      });
    });

  var options = {
    // legend: {
    //   position: "ne"
    // },
    xaxis: {
      ticks: xaxisTitles
    }
  };
  $.plot($("#placeholder"), chart, options);
}

function enterData(callback){
  var textareaData = $('textarea').val();
  var lines = textareaData.split('\n');
  console.log("lines: "+lines.length);
  var data = [];
  var parsedData = [];
  var xaxisTitles = [];

  // Split all CSV lines entered by user into array of arrays, called "data"
  $.each(lines, function(i, line){
    data.push(line.split(','));
  }); // => data = [["title1"," title2","title3"],["100","200","300"]]


  // Parse the data into flot friendly format.
  $.each(data, function(i, line){
    var tempData = []
    $.each(line, function(n, item){
      if(i==0){
        xaxisTitles.push([n,item]);
      }else{
        if(data.length>2){                                                          // if data is multi series...
          if(n==0){tempData.push([n,item])}else{tempData.push([n,parseInt(item)])}; // don't parse first items to ints
        }else{                                                                      // as they will be used in legend.
          tempData.push([n,parseInt(item)]);
        };
      };
    });
    parsedData.push(tempData);
  });
  parsedData.splice(0,1); // <- remove first empty element


  console.log('HERE: '+parsedData);
  callback(xaxisTitles, parsedData);
}


});

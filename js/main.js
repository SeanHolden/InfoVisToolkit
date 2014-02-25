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
  console.log(data);
  console.log("XAXISTITLES: "+JSON.stringify(xaxisTitles));

  var chart = [];

    $.each(data, function(i, item){
      if(i <= xaxisTitles.length-1){
        console.log('AI: '+xaxisTitles[i]);
        var label = xaxisTitles[i][1];
      }
      
      chart.push({
        // label: label,
        // color: 'red',
        data: item,
        bars:{
          show:true,
          // fill:1,
          barWidth: 0.1,
          align: 'center',
          order: 1
        },
        // stack: 1
      });
    });

  var options = {
    // legend: {
    //   labelBoxBorderColor: 'black',
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
        tempData.push([n,parseInt(item)]);
      };
    });
    parsedData.push(tempData);
  });
  parsedData.splice(0,1); // <- remove first empty element


  console.log('HERE: '+parsedData);
  callback(xaxisTitles, parsedData);
}


});

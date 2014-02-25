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
  // console.log(JSON.stringify(xaxisTitles));

  // TODO: make this loop depending on how many lines are entered
  var chart = [
    {
      // label: 'foo',
      color: 'red',
      data: data,
      bars:{
        show:true,
        fill:1,
        barWidth: 0.6,
        align: 'center'
      },
      stack: 1
    },
  ];

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
  var data = [];
  var parsedData = [];
  var xaxisTitles = [];
  
  // Split all CSV lines entered by user into array of arrays, called "data"
  for(var i=0;i<lines.length;i++){
    var line = lines[i];
    data.push(line.split(','))
  };

  // Get xaxis labels from line 1 of the user input and put them into usable format
  // named xaxisTitles. Pass this into callback function.
  for(var i=0;i<data[0].length;i++){
    var title = data[0][i];
    xaxisTitles.push([i+1, title]);
  }

  // data: [["sean"," luke","joe"],["100","200","300"]]
  // needs to be: [[1,100],[2,200],[3,300]]

  // for line in data
  for(var i=1;i<data.length;i++){
    var line = data[i];
    // for item in line
    for(var n=0;n<line.length;n++){
      intValue = parseInt(line[n]);
      parsedData.push([n+1,intValue]);
    }
  }
  // console.log(JSON.stringify(parsedData));
  callback(xaxisTitles, parsedData);
}


});
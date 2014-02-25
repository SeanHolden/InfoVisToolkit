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
  console.log(data.length);

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
  $.each(lines, function(i, line){
    data.push(line.split(','));
  }); // => data = [["title1"," title2","title3"],["100","200","300"]]


  // Parse the data into flot friendly format.
  $.each(data, function(i, line){
    $.each(line, function(n, item){
      if(i==0){
        xaxisTitles.push([n+1,item]);
      }else{
        parsedData.push([n+1,parseInt(item)]);
      };
    });
  }); // => xaxisTitles = [[1, "title1"], [2, "title2"], [3, "title3"]]
      // => parsedData  = [[1, 100], [2, 200], [3, 300]]

  callback(xaxisTitles, parsedData);
}


});
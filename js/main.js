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
  var multiSeries = lines.length > 2 ? true : false;
  var data = [];
  // var parsedData = [];
  var xaxisTitles = [];

  // Split all CSV lines entered by user into array of arrays, called "data"
  $.each(lines, function(i, line){
    data.push(line.split(','));
  }); // => data = [["title1"," title2","title3"],["100","200","300"]]

  var topLine = data.splice(0,1)[0];
  $.each(topLine, function(i, item){
    xaxisTitles.push([i,item]);
  });

  if(multiSeries){
    createMultiSeriesChart(data, function(parsedData){
      callback(xaxisTitles, parsedData);
    });
  }else{
    createBasicChart(data[0], function(parsedData){
      callback(xaxisTitles, parsedData);
    });
  };

  
}

function createMultiSeriesChart(data, callback){
  var parsedData = new Array;
  $.each(data, function(i, line){
    var tempData = new Array;
    $.each(line, function(j, item){
      // Parse data to int, unless it is first item in line, which will be a title.
      var firstItem = j==0 ? true : false;
      if(firstItem){tempData.push([j,item])}else{tempData.push([j,parseInt(item)])};
    });
    parsedData.push(tempData);
  });
  callback(parsedData);
};

function createBasicChart(line, callback){
  var parsedData = new Array;
  $.each(line, function(i, item){
    parsedData.push([i,parseInt(item)]);
  });
  parsedData = [parsedData];
  callback(parsedData);
}


});

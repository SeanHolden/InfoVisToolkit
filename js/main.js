var settings = {
  flipData: false,
  multiSeries: false,
  stack: null,
  bars: {
    show: 1,
    order:1,
    aligned: 'left',
    barWidth: 0.1,
    fill:1
  },
  lines:{
    show:0,
    fill:0
  },
  points:{
    show:0,
    fill:1,
    radius:3,
    fillColor:false //<-- need this otherwise fill color is white by default
  }
};

var defaultSettings = settings;

$(function(){
  initialize();
});


function initialize(){
  // Make textarea automatically increase in size when data is entered.
  $('.infovis-area textarea').autogrow();
  initEnterDataButton();
  initStackToggleButton();
  initBarWidthAdjust();
  initFlipDataButton();
  resetChartToDefaults();
  initCharttypeCheckbox();
}

function createChart(){
  if(settings.flipData===false){
    enterData(function(xaxis, data){
      plotGraph(xaxis, data);
    });
  }else{
    flipLegendAndXaxisData(function(xaxis, data){
      plotGraph(xaxis, data);
    });
  };
}

function initEnterDataButton(){
  // Initialize enter data button click event
  $('#enterdata').click(function(){
    createChart();
  });
}

function initStackToggleButton(){
  $('#stacked').click(function(){
    settings.stack = settings.stack === null ? 1 : null;
    settings.bars.order = settings.bars.order === null ? 1 : null;
    settings.bars.aligned = settings.bars.aligned === 'left' ? 'center' : 'left';
    if(settings.stack===1){
      $('#stacked').html("Stacked: on");
    }else{
      $('#stacked').html("Stacked: off");
    };
    createChart();
  });
}

function initCharttypeCheckbox(){
  $('input[name=chartType]').click(function(){
    if( $(this).is(':checked') ){
      console.log(this.value+' checked');
      switch(this.value){
        case 'bar':
          settings.bars.show = 1;
          createChart();
          break;
        case 'line':
          settings.lines.show = 1;
          createChart();
          break;
        case 'scatter':
          settings.points.show = 1;
          createChart();
          break;
        case 'area':
          settings.lines.show = 1;
          settings.lines.fill = 1;
          createChart();
          break;
        default:
          console.log('Oops. An error occured. Checkbox value was not line, bar or scatter. 1');
      }
    }else{
      console.log(this.value+' unchecked');
      switch(this.value){
        case 'bar':
          settings.bars.show = 0;
          createChart();
          break;
        case 'line':
          var areaCheckbox = $('input[value=area]');
          if( areaCheckbox.is(':checked') === false ){
            settings.lines.show = 0;
            createChart();
          };
          break;
        case 'scatter':
          settings.points.show = 0;
          createChart();
          break;
        case 'area':
          var linesCheckbox = $('input[value=line]');
          if( linesCheckbox.is(':checked')===false ){settings.lines.show = 0};
          settings.lines.fill = 0;
          createChart();
          break;
        default:
          console.log('Oops. An error occured. Checkbox value was not line, bar or scatter. 2');
      }
    }
  });
}

function initBarWidthAdjust(){
  $('#bar-width-plus').click(function(){
    settings.bars.barWidth =  settings.bars.barWidth + 0.01;
    createChart();
  });
  $('#bar-width-minus').click(function(){
    if(settings.bars.barWidth>=0.01){
      settings.bars.barWidth =  settings.bars.barWidth - 0.01;
    };
    createChart();
  });
}

function resetChartToDefaults(){
  $('#reset').click(function(){
    $('button').show();
    settings = defaultSettings;
    enterData(function(xaxis, data){
      plotGraph(xaxis, data);
    });
  });
}

function initFlipDataButton(){
  $('#flip-data').click(function(){
    toggleFlipDataValue(function(){
      createChart();
    });
  });
}

// ensuring that the value is toggled before running the createChart() function.
function toggleFlipDataValue(callback){
  settings.flipData = settings.flipData === true ? false : true;
  callback();
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
        lines:settings.lines,
        points:settings.points,
        bars:settings.bars,
        stack: settings.stack
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
  prepareData(function(xaxisTitles, data, multiSeries){
    var topLine = data.splice(0,1)[0];
    $.each(topLine, function(i, item){xaxisTitles.push([i,item])});

    if(multiSeries){
      createMultiSeriesChart(data, function(parsedData){
        callback(xaxisTitles, parsedData);
      });
    }else{
      createBasicChart(data[0], function(parsedData){
        callback(xaxisTitles, parsedData);
      });
    };
  });
}

function prepareData(callback){
  var textareaData = $('textarea').val();
  var lines = textareaData.split('\n');
  // remove any accidental blank lines from array to remove chance of error
  for(var i=0;i<lines.length;i++){
    if(lines[i].length===0){
      lines.splice(i,1);
      i--;
    };
  };

  var multiSeries = lines.length > 2 ? true : false;
  settings.multiSeries = multiSeries; // <-- setting global variable.
  var untrimmedData = new Array;
  var data = new Array;
  var xaxisTitles = new Array;

  // Split all CSV lines entered by user into array of arrays, called "data"
  $.each(lines, function(i, line){untrimmedData.push(line.split(','))});
  // => data = [["title1"," title2","title3"],["100","200","300"]]

  // trim data to remove outer whitespace from each string
  $.each(untrimmedData, function(i, item){
    data.push(item.map(Function.prototype.call, String.prototype.trim));
  });

  callback(xaxisTitles, data, multiSeries);
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

// Read data into chart from left to right instead of top to bottom
function flipLegendAndXaxisData(callback){
  prepareData(function(xaxisTitles, data, multiSeries){
    // first get xaxis titles,
    $.each(data, function(i, item){
      xaxisTitles.push([i, item[0]])
    });
    
    // then get data:
    var parsedData = new Array;
    for(var i=0;i<data[0].length;i++){
      var tempData = new Array;
      for(var j=0;j<data.length;j++){
        var firstItem = j===0 ? true : false;
        if(firstItem){
          tempData.push([j, data[j][i]]);
        }else{
          tempData.push( [j, parseInt(data[j][i])] );
        };
      };
      parsedData.push(tempData);
    };
    
    // remove xaxis titles from data. Already got that stored in var
    parsedData.splice(0,1);
    callback(xaxisTitles, parsedData);
  });
}

var settings = {
  flipData: false,
  multiSeries: false,
  stack: null,
  bars: {
    show: 0,
    order:1,
    aligned: 'center',
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
  },
  xaxisDrag: false,
  xaxisRotated: false
};

var defaultSettings = settings;

$(function(){
  checkFileApiSupport();
  // Make textarea automatically increase in size when data is entered.
  $('.infovis-area textarea').autogrow();
  initReloadDataButton();
  initStackToggleButton();
  initBarWidthAdjust();
  initFlipDataButton();
  initCharttypeCheckbox();
  initResizeWindow();
  initDragXaxisButton();
  initRotateButton();
});

function checkFileApiSupport(){
  // Check for the various File API support.
  if (window.File && window.FileReader && window.FileList && window.Blob) {
    console.log('Success! Your browser supports the file API. You can import a CSV file.');
    $('#csvfile')[0].addEventListener('change', readSingleFile, false);
  } else {
    alert('The File APIs are not fully supported in this browser.');
  }
}

function readSingleFile(evt) {
  //Retrieve the first (and only!) File from the FileList object
  var f = evt.target.files[0]; 

  if (f && f.name.split('.')[1]==='csv') {
    var r = new FileReader();
    r.onload = function(e) { 
      var contents = e.target.result;
      var numberOfLines = contents.split('\n').length;
      $('textarea').html(contents).height(numberOfLines*20);
      console.log(f.name);  
    }
    r.readAsText(f);
  } else {
    $('#csvfile').val(''); // <-- resetting the value of the file back to empty string as wrong type of file.
    alert("File must be in CSV format.");
  }
}

function createChart(){
  // first reset any edits to default
  $('.flot-x-axis > .flot-tick-label').off() //<--removes event handlers (drag)
  settings.xaxisDrag=false;
  xaxisRotated: false;
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

function initDragXaxisButton(){
  $('#drag-xaxis-titles').click(function(){
    if(settings.xaxisDrag===false){
      draggableXaxisTitles();
    }else{
      removeDragFeatureFromXaxisTitles();
    }
  });
}

function initRotateButton(){
  $('#rotate-xaxis-titles').click(function(){
    if(settings.xaxisRotated){
      // just redraw chart to unrotate
      createChart();
      settings.xaxisRotated=false;
    }else{
      rotateXaxisTitles();
      settings.xaxisRotated=true;
    }
  });
}

function rotateXaxisTitles(){
  $('.flot-x-axis > .flot-tick-label').addClass('rotatedXaxis');
  $('.flot-x-axis > .flot-tick-label').css('max-width','none');
  var xaxisLabels = $('.flot-x-axis > .flot-tick-label');
  for(var i=0;i<xaxisLabels.length;i++){
    var label = xaxisLabels[i];
    var labelLength = label.innerHTML.length; // <-- number of characters in string 
    label.style.top = String(parseInt(label.style.top) + labelLength*2)+"px";
    label.style.left = String(parseInt(label.style.left) + labelLength*-3.5)+"px";
  }
}

function draggableXaxisTitles(){
  $('.flot-x-axis > .flot-tick-label')
  .css('z-index','999')
  .css('border','1px dotted orange');
  $('.flot-x-axis > .flot-tick-label').drags();
  settings.xaxisDrag=true;
}

function removeDragFeatureFromXaxisTitles(){
    $('.flot-x-axis > .flot-tick-label').off() //<--removes event handlers (drag)
    .css('cursor','')
    .css('border','');
    settings.xaxisDrag=false;
}

// Redraw the chart when window is resized.
function initResizeWindow(){
  $(window).resize(function() {
    createChart();
  });
}

function initReloadDataButton(){
  // Initialize enter data button click event
  $('#reload').click(function(){
    createChart();
  });
}

function initStackToggleButton(){
  $('#stacked').click(function(){
    settings.stack = settings.stack === null ? 1 : null;
    settings.bars.order = settings.bars.order === null ? 1 : null;
    // settings.bars.aligned = settings.bars.aligned === 'left' ? 'center' : 'left';
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
    if( this.checked === true ){
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
    settings.bars.barWidth =  settings.bars.barWidth + 0.05;
    createChart();
  });
  $('#bar-width-minus').click(function(){
    if(settings.bars.barWidth>=0.01){
      settings.bars.barWidth =  settings.bars.barWidth - 0.05;
    };
    createChart();
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
      if(firstItem){tempData.push([j,item])}else{tempData.push([j,parseFloat(item)])};
    });
    parsedData.push(tempData);
  });
  callback(parsedData);
};

function createBasicChart(line, callback){
  var parsedData = new Array;
  $.each(line, function(i, item){
    parsedData.push([i,parseFloat(item)]);
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
          tempData.push( [j, parseFloat(data[j][i])] );
        };
      };
      parsedData.push(tempData);
    };
    
    // remove xaxis titles from data. Already got that stored in var
    parsedData.splice(0,1);
    callback(xaxisTitles, parsedData);
  });
}

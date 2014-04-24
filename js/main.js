var settings = {
  flipData: false,
  multiSeries: false,
  stack: null,
  bars: {
    show: 0,
    order:1,
    aligned: 'center',
    barWidth: 0.1,
    fill:1,
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
  xaxis:{
    rotateTicks: false,
    axisLabel: $('#editXAxis input').val()
  },
  yaxis:{
    axisLabel: $('#editYAxis input').val()
  },
  legend:{
    position: "ne"
  },
  mainTitle:{
    value: $('#editMainTitle input').val()
  },
  draggableTitles: false,
  tooltips: true
};

var defaultSettings = settings;

$(function(){
  checkFileApiSupport();
  // Make textarea automatically increase in size when data is entered.
  $('.infovis-area textarea').autogrow();
  // initReloadDataButton();
  // initStackToggleButton();
  stackedOrUnstackedButtons();
  // initBarWidthAdjust();
  // initFlipDataButton();
  // initChartTypeRadioButtons();
  initResizeWindow();
  // initMoveLegendButton();
  // initRotateButton();
  // initDragTitles();
  tooltipsToggle();
  addParagraphButtons();
  addOverallTitleButton();
  chartTypeImagesClickEvent();
  documentclickEvent();
});

function documentclickEvent(){
  $(document).click(function(){
    var newTextValue = $('#overallTitleArea input').val();
    $('#mainOverallTitle').html(newTextValue).show();
    $('#overallTitleArea input').remove();
    var paragraphText = $('#paragraphTextArea').val();
    $('.textAboveChart').unbind(); // stop click events stacking
    $('#paragraphTextArea').unbind();
    $('#paragraphTextArea').replaceWith('<p class=\"textAboveChart\">'+paragraphText+'</p>');
    addclickEventToParagraphs();
  });
}

function tooltipsToggle(){
  $('#tooltipsToggle').click(function(){
    if (settings.tooltips === true){
      $('#mainButtons a').removeClass('tooltip');
      $('#tooltipsToggle').html("Turn Tooltips On");
      settings.tooltips = false;
    }else{
      $('#mainButtons a').addClass('tooltip');
      $('#tooltipsToggle').removeClass('tooltip');
      $('#tooltipsToggle').html("Turn Tooltips Off");
      settings.tooltips = true;
    }
    return false;
  });
}

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
      $('textarea').val(contents).height(numberOfLines*20);
      console.log(f.name);
    }
    r.readAsText(f);
  } else {
    $('#csvfile').val(''); // <-- resetting the value of the file back to empty string as wrong type of file.
    alert("File must be in CSV format.");
  }
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

function initXandYAxisLabelButton(XorY){
  var uppercaseXorY = XorY.toUpperCase();
  $('.'+XorY+'axisLabel').unbind();
  $('#edit'+uppercaseXorY+'Axis button').unbind();
  $('.'+XorY+'axisLabel').click(function(event){
    $('#editYAxis').hide();
    $('#editXAxis').hide();
    $('#editMainTitle').hide();
    $('#edit'+uppercaseXorY+'Axis').show()
    .css({position:"absolute", top:event.pageY, left: event.pageX, "z-index":"9999"});
  });
  $('#edit'+uppercaseXorY+'Axis button').click(function(){
    updateXAxisLabel();
    $('#edit'+uppercaseXorY+'Axis').hide();
  });
}

function updateXAxisLabel(){
  var newValueX = $('#editXAxis input').val();
  var newValueY = $('#editYAxis input').val();
  var defaultValue = "-Click To Edit Me-"
  if(newValueX.trim() === ""){
    $('#editXAxis input').val(defaultValue);
    newValueX = defaultValue; 
  }
  if(newValueY.trim() === ""){
    $('#editYAxis input').val(defaultValue);
    newValueY = defaultValue; 
  }
  var xaxisValue = xaxisValue = newValueX;
  var yaxisValue = yaxisValue = newValueY;
  settings.xaxis.axisLabel = xaxisValue;
  settings.yaxis.axisLabel = yaxisValue;
  createChart();
}

function editMainTitle(){
  $('#editMainTitle button').unbind(); // remove previous click events so they don't stack
  $('#mainTitle')
  .unbind()
  .show()
  .html(settings.mainTitle.value)
  .click(function(event){
    $('#editMainTitle').show()
    .css({position:"absolute", top:event.pageY, left: event.pageX, "z-index":"9999"});
    $('#editXAxis').hide();
    $('#editYAxis').hide();
  });
  $('#editMainTitle button').click(function(){
    var newValue = $('#editMainTitle input').val();
    if(newValue.trim() === ""){
      var defaultValue = "-Click To Edit Me-"
      $('#editMainTitle input').val(defaultValue);
      newValue = defaultValue;
    }
    settings.mainTitle.value = newValue;
    $('#editMainTitle').hide();
    createChart();
  });
}

// Redraw the chart when window is resized.
function initResizeWindow(){
  $(window).resize(function() {
    createChart();
  });
}

function initStackToggleButton(){
  $('#stacked').click(function(){
    settings.stack = settings.stack === null ? 1 : null;
    settings.bars.order = settings.bars.order === null ? 1 : null;
    if(settings.stack===1){
      $('#stacked').html("Stacked: on");
    }else{
      $('#stacked').html("Stacked: off");
    };
    createChart();
  });
}

function stackedOrUnstackedButtons(){
  $('.stacked').click(function(){
    $(this).addClass('chartTypeSelected');
    $('.unstacked').removeClass('chartTypeSelected');
    settings.stack = 1;
    settings.bars.order = null;
    createChart();
  });
  $('.unstacked').click(function(){
    $(this).addClass('chartTypeSelected');
    $('.stacked').removeClass('chartTypeSelected');
    settings.stack = null;
    settings.bars.order = 1;
    createChart();
  });
  $('.flip').click(function(){
    toggleFlipDataValue(function(){
      createChart();
    });
  });
  $('.legendmove').click(function(){
    switch(settings.legend.position){
      case 'ne':
        settings.legend.position = 'se';
        createChart();
        break;
      case 'se':
        settings.legend.position = 'sw';
        createChart();
        break;
      case 'sw':
        settings.legend.position = 'nw';
        createChart();
        break;
      case 'nw':
        settings.legend.position = 'ne';
        createChart();
        break;
    }
  });
  $('.rotatelabels').click(function(){
    if(settings.xaxis.rotateTicks === false){
      settings.xaxis.rotateTicks = 135;
      $('.rotatelabels').addClass('chartTypeSelected');
      createChart();
    }else{
      settings.xaxis.rotateTicks = false
      $('.rotatelabels').removeClass('chartTypeSelected');
      createChart();
    }
  });
  $('.dragdroptitles').click(function(){
    if(settings.draggableTitles == false){
      $('.yaxisLabel').unbind().drags();
      $('.xaxisLabel').unbind().drags();
      $('#mainTitle').unbind().drags();
      settings.draggableTitles = true;
      $('.dragdroptitles').addClass('chartTypeSelected');
    }else{
      $('.yaxisLabel').unbind().css('cursor','initial');
      $('.xaxisLabel').unbind().css('cursor','initial');
      $('#mainTitle').unbind().css('cursor','initial');
      initXandYAxisLabelButton('x');
      initXandYAxisLabelButton('y');
      editMainTitle();
      $('.dragdroptitles').removeClass('chartTypeSelected');
      settings.draggableTitles = false;
    }
  });
  $('.barwidthplus').click(function(){
    settings.bars.barWidth = settings.bars.barWidth + 0.05;
    createChart();
  });
  $('.barwidthminus').click(function(){
    if(settings.bars.barWidth>=0.01){
      settings.bars.barWidth =  settings.bars.barWidth - 0.05;
    };
    createChart();
  });
}


$('#dragTitles').click(function(){
  if(settings.draggableTitles == false){
    $('.yaxisLabel').unbind().drags();
    $('.xaxisLabel').unbind().drags();
    $('#mainTitle').unbind().drags();
    settings.draggableTitles = true;
    $('#dragTitles').html('Finish Dragging Titles').css('background','red');
  }else{
    $('.yaxisLabel').unbind().css('cursor','initial');
    $('.xaxisLabel').unbind().css('cursor','initial');
    $('#mainTitle').unbind().css('cursor','initial');
    initXandYAxisLabelButton('x');
    initXandYAxisLabelButton('y');
    editMainTitle();
    $('#dragTitles').html('Drag and Drop Titles').attr('style','');
    settings.draggableTitles = false;
  }
});

function addParagraphButtons(){
  var loremIpsumText = "<p class=\"textAboveChart\">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum tortor libero, egestas ac sodales et, vehicula eget erat. Nullam iaculis congue molestie. Suspendisse potenti. Proin ornare auctor ligula, in consectetur metus. Praesent fermentum ultricies tortor, non eleifend lacus vehicula tempor. Praesent suscipit quam a dolor gravida suscipit. Suspendisse vel mi sit amet metus consectetur iaculis. Duis tempus sagittis est, a facilisis augue imperdiet faucibus. In quis eros et metus ullamcorper elementum et sit amet est. Cras cursus condimentum dolor a ullamcorper.</p>"
  $('.textabove').click(function(event){
    $('#textDescriptionArea').append(loremIpsumText);
    addclickEventToParagraphs();
  });
  $('.textbelow').click(function(event){
    $('#textDescriptionArea2').append(loremIpsumText);
    addclickEventToParagraphs();
  });
}

function addclickEventToParagraphs(){
  $('.textAboveChart').click(function(event){
    console.log('clicked');
    var paragraphText = $(this).html();
    $(this).replaceWith('<textarea id=\"paragraphTextArea\">'+paragraphText+'</textarea>');
    $('#paragraphTextArea').click(function(){
      return false;
    });
    event.stopPropagation();
  });
}

function addOverallTitleButton(){
  $('.maintitle').click(function(){
    var area = $('#overallTitleArea');
    if(area.children().length === 0){
      var newTitle = $("<h1 style=\"display:inline;\" id=\"mainOverallTitle\">Main Title</h1>");
      area.append(newTitle);
      appendClickFunctionToMainTitle();
    }
  });
}

function appendClickFunctionToMainTitle(){
  $('#mainOverallTitle').click(function(event){
    var mainTitleValue = $(this).html();
    $('#mainOverallTitle').hide();
    $('#overallTitleArea').append('<input id=\"overallTitleTextArea\" type=\"text\" value=\"'+mainTitleValue+'\" />');
    $('#overallTitleTextArea').click(function(){
      return false;
    });
    event.stopPropagation();
  });
}

function chartTypeImagesClickEvent(){
  // chartTypeSelected
  $('.chartTypeImages').click(function(){
    $('.chartTypeImages').removeClass('chartTypeSelected');
    $(this).addClass('chartTypeSelected');
    var radioValue = $(this).data('charttype');
    // console.log(radioValue);
    // initChartTypeRadioButtons(radioValue);
    switch(radioValue){
      case 'column':
        settings.bars.show = 1;
        settings.lines.show = 0;
        settings.points.show = 0;
        settings.lines.fill = 0;
        $('#barSelectedButtons').show();
        createChart();
        break;
      case 'line':
        settings.bars.show = 0;
        settings.lines.show = 1;
        settings.points.show = 0;
        settings.lines.fill = 0;
        $('#barSelectedButtons').hide();
        createChart();
        break;
      case 'points':
        settings.bars.show = 0;
        settings.lines.show = 0;
        settings.points.show = 1;
        settings.lines.fill = 0;
        $('#barSelectedButtons').hide();
        createChart();
        break;
      case 'area':
        settings.bars.show = 0;
        settings.lines.show = 1;
        settings.points.show = 0;
        settings.lines.fill = 1;
        $('#barSelectedButtons').hide();
        createChart();
        break;
    }
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
        xaxisTitles[0][1] = '';     // <-- remove top left item in data so it does not appear as a label
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
    legend: {
      position: settings.legend.position
    },
    xaxis: {
      ticks: xaxisTitles,
      rotateTicks: settings.xaxis.rotateTicks,
      axisLabel: settings.xaxis.axisLabel,
    },
    yaxis: {
      axisLabel: settings.yaxis.axisLabel,
      // labelWidth:-20
    }
  };
  $.plot($("#placeholder"), chart, options);
  $('.axisLabels').css('color','#444').css('font-weight','bold'); // <- axis title styles
  $('.yaxisLabel').css('transform', 'translate(-60.5px, 200px) rotate(-90deg)');
  initXandYAxisLabelButton('x');
  initXandYAxisLabelButton('y');
  editMainTitle();
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

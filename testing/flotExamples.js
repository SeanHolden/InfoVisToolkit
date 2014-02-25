// MULTIPLE PLOTS ON SAME GRAPH
var d1 = [];
for (var i = 0; i < 14; i += 0.5) {
  d1.push([i, Math.sin(i)]);
}

var d2 = [[0, 3], [4, 8], [8, 5], [9, 13]];

var d3 = [];
for (var i = 0; i < 14; i += 0.5) {
  d3.push([i, Math.cos(i)]);
}

var d4 = [];
for (var i = 0; i < 14; i += 0.1) {
  d4.push([i, Math.sqrt(i * 10)]);
}

var d5 = [];
for (var i = 0; i < 14; i += 0.5) {
  d5.push([i, Math.sqrt(i)]);
}

var d6 = [];
for (var i = 0; i < 14; i += 0.5 + Math.random()) {
  d6.push([i, Math.sqrt(2*i + Math.sin(i) + 5)]);
}

var data = [
  {
    data: d1,
    lines: { show: true, fill: true }
  }, {
    data: d2,
    bars: { show: true }
  }, {
    data: d3,
    points: { show: true }
  }, {
    data: d4,
    lines: { show: true }
  }, {
    data: d5,
    lines: { show: true },
    points: { show: true }
  }, {
    data: d6,
    lines: { show: true, steps: true }
}];

var options = {
  xaxis: { ticks: [[0, 'A'], [1,'B'], [2, 'C'], [3,'D'], [4,'E'], [5,'F'], [6, 'G'], [7,'H']] }
};

$.plot("#placeholder", data, options);

//////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////STACKED BAR CHART////////////////////////////////////////////////////////////
  var data = [
    {
      label: 'foo',
      color: 'red',
      data: [[1,300], [2,300], [3,300], [4,300], [5,300]],
      bars:{
        show:true,
        fill:1,
        barWidth: 0.6,
        align: 'center'
      },
      stack: 1
    },
    {
      label: 'bar',
      color:'blue',
      data: [[1,800], [2,600], [3,400], [4,200], [5,0]],
      bars: {
        show: true,
        align: 'center',
        barWidth: 0.6,
        fill: 1
      },
      stack: 1
    },
    {
      label: 'baz',
      color:'yellow',
      data: [[1,100], [2,200], [3,300], [4,400], [5,700]],
      bars: {
        show: true,
        align: 'center',
        barWidth: 0.6,
        fill: 1
      },
      stack: 1
    },
  ];

  var options = {
    legend: {
      labelBoxBorderColor: 'black',
      position: "ne"
    },
    xaxis: {
      ticks:[
        [1,'one'], [2, 'two'], [3, 'three'], [4, 'four'], [5, 'five']
      ]
    }
  };
  $.plot($("#placeholder"), data, options);
//////////////////////////////////////////////////////////////////////////////////////////////////
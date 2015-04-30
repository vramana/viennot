/* jshint browser: true*/
'use strict';

var sections = 8;
// var valMax = 10;
// var valMin = 0;
// var stepSize = 1;
var gridSize = 40;
var margin = 10;

var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

function resetCanvas() {
  var i;

  var xAxis = ['', '',];

  for (i = 1; i <= sections; i++) {
    xAxis.push(i.toString());
  }

  context.fillStyle = '#0099ff';
  context.font = '20 pt Ubuntu';

  context.strokeStyle = '#000000'; // color of grid lines
  context.lineWidth = 1;

  context.beginPath();

  for (i = 1; i <= (sections + 1); i++) {
    // Draw vertical grid lines
    var x = i * gridSize;
    context.fillText(xAxis[i], x - 3 , gridSize * (sections + 1) + (gridSize / 2) );
    context.moveTo(x + 0.5, gridSize);
    context.lineTo(x + 0.5, gridSize * (sections + 1));

    // Draw horizontal grid lines
    var y = gridSize * i;
    context.fillText(sections - i + 1 , margin + 10 , y +  5);
    context.moveTo(gridSize, y + 0.5);
    context.lineTo(gridSize * (sections + 1), y + 0.5);
  }

  context.stroke();
}

resetCanvas();

var paths;

var translateAxis = function(point) {
    var zeroX = gridSize;
    var zeroY = gridSize*(sections + 1);
    return [ zeroX + point[0] * 40 , zeroY - point[1]*40 ];
};

var colors = [ '#38e040', '#FF7E00', '#27a033', '#fe546a',
              '#6393f3', '#5d358f', '#ad3c56', '#fe546a'];

var state = {
  colorIndex : 0,
  colorPathIndex : 0,
  point : 0,
  startPoint: 0,
  endPoint: 0,
  currPoint : 0,
  deltaX : 0,
  step : 8,
  deltaY : 8,
  resetState : function () {
    this.colorIndex = 0;
    this.colorPathIndex = 0;
    this.point = 0;
    this.deltaX = 0;
    this.deltaY = 8;
    this.resetPoints();
  },
  distance : function(p1, p2) {
    return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
  },
  updateCurr : function () {
    state.currPoint[0] = state.currPoint[0] + this.deltaX;
    state.currPoint[1] = state.currPoint[1] + this.deltaY;
  },
  resetPoints : function () {
    var line = paths[this.colorIndex][this.colorPathIndex];
    this.startPoint = line[state.point];
    this.currPoint = Object.create(this.startPoint);
    this.endPoint = line[state.point + 1];
  }
};

var render = function(color) {
  context.beginPath();
  context.strokeStyle = color;
  if (state.deltaX === 0) {
    context.moveTo(state.currPoint[0] + 0.5, state.currPoint[1]);
    context.lineTo(state.currPoint[0] + state.deltaX + 0.5, state.currPoint[1] + state.deltaY);
  } else {
    context.moveTo(state.currPoint[0], state.currPoint[1] + 0.5);
    context.lineTo(state.currPoint[0] + state.deltaX, state.currPoint[1] + state.deltaY + 0.5);
  }
  context.lineWidth = 3;
  context.stroke();
};

function getAnimationFrame() {
    return new Promise(function(resolve) {
        requestAnimationFrame(resolve); // this promise never gets rejected
    });
}

function frame() {
  var line;
  if (state.colorIndex < paths.length) {
    line = paths[state.colorIndex][state.colorPathIndex];
  }
  if (state.colorIndex === 0 && state.colorPathIndex === 0 && state.point === 0) {
    state.startPoint = line[state.point];
    state.currPoint = state.startPoint;
    state.endPoint = line[state.point + 1];
  }
  if (state.colorIndex < paths.length) {
    render(colors[state.colorIndex]);
    state.updateCurr();
    if (state.distance(state.currPoint,state.endPoint) <= 0) {
      state.point += 1;
      state.deltaX = state.deltaX === 8 ? 0 : state.step;
      state.deltaY = state.deltaY === 8 ? 0 : state.step;
      if (state.point >= line.length - 1) {
          state.point = 0;
          state.colorPathIndex += 1;
          if (state.colorPathIndex >= paths[state.colorIndex].length) {
            state.colorPathIndex = 0;
            state.colorIndex += 1;
          }
      }
      if (state.colorIndex < paths.length) {
        state.resetPoints();
      }
    }
    getAnimationFrame().then(frame);
  } else {
    return Promise.resolve();
  }
}

var computeButton = document.getElementById('compute');
var perm = document.getElementById('perm');


computeButton.onclick = function () {
  var permutation = perm.value.split('').map(function (x) {
    return parseInt(x);
  });
  var result = viennot(permutation, true);
  var syt1 = result[0];
  var syt2 = result[1];
  paths = result[2];
  context.clearRect(0,0,canvas.width,canvas.height);
  sections = permutation.length + 1;
  resetCanvas();
  paths = paths.map(function (colorPaths) {
    return colorPaths.map(function (line) {
      return line.map(function (point) {
        return translateAxis(point);
      });
    });
  });
  state.resetState();
  frame();
  React.render(
    React.createElement(Diagram, {syt1: syt1, syt2: syt2}),
    document.getElementById('syt')
  );
};

/* jshint browser: true*/
'use strict';

var sections = 10;
// var valMax = 10;
// var valMin = 0;
// var stepSize = 1;
var gridSize = 40;
var margin = 10;
var xAxis = [' ', '', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];


var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');

context.fillStyle = '#0099ff';
context.font = '20 pt Ubuntu';

context.strokeStyle = '#aaaaaa'; // color of grid lines
context.beginPath();
// Draw vertical grid lines
//
for (var i = 1; i <= (sections + 1); i++) {
    var x = i * gridSize;
    context.fillText(xAxis[i], x - 3 , gridSize * (sections + 1) + (gridSize / 2) );
    context.moveTo(x, gridSize);
    context.lineTo(x, gridSize * (sections + 1));
}
// Draw horizontal grid lines
for (var i = 1; i <= (sections + 1); i++) {
    var y = gridSize * i;
    context.fillText(sections - i + 1 , margin + 10 , y +  5);
    context.moveTo(gridSize,y);
    context.lineTo(gridSize * (sections + 1), y);
}

context.lineWidth = 1;
context.stroke();

var translateAxis = function(point) {
    var zeroX = gridSize;
    var zeroY = gridSize*(sections + 1);
    return [ zeroX + point[0] * 40 , zeroY - point[1]*40 ];
};

var paths = [
              [
                [[1, 5], [1, 1], [5, 1]],
                [[2, 5], [2, 4], [3, 4], [3, 2], [5, 2]],
                [[4, 5], [4, 3], [5, 3]]
              ],
              [
                [[3, 5], [3, 4], [5, 4]]
              ]
            ];

paths = paths.map(function (colorPaths) {
  return colorPaths.map(function (line) {
    return line.map(function (point) {
      return translateAxis(point);
    });
  });
});

var color = ['#960a1f', '#225599', '#55ee55', '#342343'];

var state = {
  colorIndex : 0,
  colorPathIndex : 0,
  point : 0,
  startPoint: 0,
  endPoint: 0,
  delta : 0,
  currPoint : 0,
  deltaX : 0,
  deltaY : 1,
  resetState : function () {
    this.colorIndex = 0;
    this.colorPathIndex = 0;
    this.point = 0;
  },
  distance : function(p1, p2) {
    return Math.abs(p2[0] - p1[0]) + Math.abs(p2[1] - p1[1]);
  },
  updateCurr : function () {
    state.currPoint[0] = state.currPoint[0] + this.deltaX;
    state.currPoint[1] = state.currPoint[1] + this.deltaY;
  }
};

var render = function(start, end, color) {
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(state.currPoint[0], start.currPoint[1]);
  context.lineTo(state.currPoint[0] + state.deltaX, state.currPoint[1] + state.deltaY);
  context.lineWidth = 1;
  context.stroke();
};

function getAnimationFrame() {
    return new Promise(function(resolve) {
        requestAnimationFrame(resolve); // this promise never gets rejected
    });
}

function frame() {
  if (state.colorIndex < paths.length) {
    var line = paths[state.colorIndex][state.colorPathIndex];
    render(color[state.colorIndex]);
    console.log(line[state.point]);
    state.delta += 1;
    if (state.distance(state.currPoint,state.endPoint) <= 1) {
      state.point += 1;
      state.deltaX = state.deltaX === 0 ? 1 : 0;
      state.deltaY = state.deltaY === 0 ? 1 : 0;
      state.startPoint = line[state.point];
      state.currPoint = state.startPoint;
      state.endPoint = line[state.point + 1];
      if (state.point >= line.length - 1) {
          state.point = 0;
          state.colorPathIndex += 1;
          if (state.colorPathIndex >= paths[state.colorIndex].length) {
            state.colorPathIndex = 0;
            state.colorIndex += 1;
          }
      }
    }
    getAnimationFrame().then(frame);
  } else {
    return Promise.resolve();
  }
}

frame();

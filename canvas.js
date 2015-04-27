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

context.strokeStyle = '#009933'; // color of grid lines
context.beginPath();
// Draw vertical grid lines

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

context.stroke();

var translateAxis = function(point /*array*/) {
    var zeroX = gridSize;
    var zeroY = gridSize*(sections + 1);
    return [ zeroX + point[0] * 40 , zeroY - point[1]*40 ];
};

var drawColorLine = function (start, end, color) {
  var deltaX, deltaY;
  context.beginPath();
  context.strokeStyle = color;
  context.moveTo(start[0], start[1]);

  deltaX = end[0] - start[0];
  deltaY = end[1] - start[1];

  context.lineTo(end[0], end[1]);
  context.stroke();
};

drawColorLine([40, 80], [40, 120], '#551188');

var drawColorPathHelper = function (path, color) {

};

var drawColorPath = function (path, color) {
  path = path.map(function (x) {
    return translateAxis(x);
  });
  return drawColorPath(path, color);
};

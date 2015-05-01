/* jshint browser: true*/
'use strict';

var descendOnce = function(pt, stairPoints, n, isVert, path, nsp) {
  var newPts, i;
  if (isVert === undefined) {
    isVert = true;
  }
  if (path === undefined) {
    path = [];
  }
  if (nsp === undefined) {
    nsp = [];
  }
  if (isVert) {
    if (path) {
      path.push(pt);
      for(i = 0; i < stairPoints.length; i++) {
        if (pt[0] === stairPoints[i][0]) {
          newPts = Object.create(stairPoints);
          newPts = i === 0 ? newPts.slice(1) : newPts.splice(0, i).concat(newPts.splice(i+1));
          path.push(stairPoints[i]);
          return descendOnce(stairPoints[i], newPts, n, false, path, nsp);
        }
      }
    }
  } else {

    for(i = 0; i < stairPoints.length; i++) {
      if (pt[1] > stairPoints[i][1]) {
        path.push([stairPoints[i][0], pt[1]]);
        path.push(stairPoints[i]);
        newPts = Object.create(stairPoints);
        newPts = newPts.slice(0, i).concat(newPts.splice(i+1));
        nsp.push([stairPoints[i][0], pt[1]]);
        return descendOnce(stairPoints[i], newPts, n, false, path, nsp);
      }
    }
    path.push([n+1, pt[1]]);
    return [path, stairPoints, nsp];
  }
};

var descendAll = function (stairPoints, n, i, nsp, paths) {
  var result;
  if (i === undefined) {
    i = 1;
  }
  if (nsp === undefined) {
    nsp = [];
  }
  if (paths === undefined) {
    paths = [];
  }
  if (i > n || stairPoints.length === 0) {
    return [nsp, paths];
  } else {
    result = descendOnce([i, n+1], stairPoints, n);
    if (result) {
      nsp = nsp.concat(result[2]);
      paths.push(result[0]);
      return descendAll(result[1], n, i + 1, nsp, paths);
    } else {
      return descendAll(stairPoints, n, i + 1, nsp, paths);
    }
  }

};

var viennotHelper = function (stairPoints, n, syt1, syt2) {
  var step, paths, syt1Part, syt2Part;
  if (syt1 === undefined) {
    syt1 = [];
  }
  if (syt2 === undefined) {
    syt2 = [];
  }

  if (stairPoints.length === 0) {
    return [syt1, syt2];
  } else {
    step = descendAll(stairPoints, n);
    paths = step[1];
    syt1Part = paths.map(function (x) { return x[0][0]; });
    syt2Part = paths.map(function (x) { return x[x.length-1][1]; });

    syt1.push(syt1Part);
    syt2.push(syt2Part);

    return viennotHelper(step[0], n, syt1, syt2);
  }
};

var viennotHelperPaths = function (stairPoints, n, syt1, syt2, paths) {
  var step, tempPaths, syt1Part, syt2Part;
  if (syt1 === undefined) {
    syt1 = [];
  }
  if (syt2 === undefined) {
    syt2 = [];
  }
  if (paths === undefined) {
    paths = [];
  }
  if (stairPoints.length === 0) {
    return [syt1, syt2, paths];
  } else {
    step = descendAll(stairPoints, n);
    tempPaths = step[1];
    paths.push(tempPaths);
    syt1Part = tempPaths.map(function (x) { return x[0][0]; });
    syt2Part = tempPaths.map(function (x) { return x[x.length-1][1]; });

    syt1.push(syt1Part);
    syt2.push(syt2Part);

    return viennotHelperPaths(step[0], n, syt1, syt2, paths);
  }
};

var viennot = function(perm, path) {
  var arrayPerm;
  arrayPerm = perm.map(function (x, i) {
    return [i+1, x];
  });
  if (path) {
    return viennotHelperPaths(arrayPerm, perm.length);
  } else {
    return viennotHelper(arrayPerm, perm.length);
  }
};

var inverseDescendOnce = function (n, cols, stairPoints, point, path, nsp) {
  var spRight, newPts, strPt, i;

  if (point === undefined) {
    point = [];
  }
  if (path === undefined) {
    path = [];
  }
  if (nsp === undefined) {
    nsp = [];
  }

  if (path.length === 0) {
    point = [cols[0], n+1];
    path.push(point);
  }

  spRight = stairPoints.filter(function (x) {
    return (x[0] > point[0]) && (x[1] > cols[1]);
  });

  if (spRight.length === 0) {
    path = path.concat([[point[0], cols[1]], [n+1, cols[1]]]);
    nsp.push([point[0], cols[1]]);
    return [path, stairPoints, nsp];
  } else {
    spRight = spRight.sort(function(x) {
      return x[1];
    });
    spRight.reverse();
    strPt = spRight[0];

    newPts = stairPoints.slice(0);
    i = stairPoints.indexOf(strPt);
    newPts = i === 0 ? newPts.slice(1) : newPts.splice(0, i).concat(newPts.splice(i+1));
    path = path.concat([[point[0], strPt[1]] , strPt]);
    nsp.push([point[0], strPt[1]]);
    return inverseDescendOnce(n, cols, newPts, strPt, path, nsp);
  }
};

var inverseDescendAll = function (n, row1, row2, stairPoints, i, paths, nsp) {
  if (i === undefined) {
    i = 0;
  }
  if (paths === undefined) {
    paths = [];
  }
  if (nsp === undefined) {
    nsp = [];
  }

  if (i >= row1.length) {
    return [nsp, paths];
  } else {
    var result;
    result = inverseDescendOnce(n, [row1[row1.length - i - 1], row2[row1.length - i - 1]], stairPoints);
    paths.push(result[0]);
    nsp = nsp.concat(result[2]);
    return inverseDescendAll(n, row1, row2, result[1], i+1, paths, nsp);
  }
};

var inverseViennotHelper = function(n, syt1, syt2, i, stairPoints, paths ) {
  if (i === undefined) {
    i = 0;
  }
  if (stairPoints === undefined) {
    stairPoints = [];
  }
  if (paths === undefined) {
    paths = [];
  }

  if (i >= syt1.length) {
    var permutation;
    permutation = stairPoints.slice(0);
    permutation = permutation.sort(function (x, y ) {
      return x[0] > y[0];
    });
    permutation = permutation.map(function (x) {return x[1];});
    return [permutation, paths];
  } else {
    var row1, row2, result;
    row1 = syt1[syt1.length - i - 1];
    row2 = syt2[syt1.length - i - 1];
    result = inverseDescendAll(n, row1, row2, stairPoints);
    paths.push(result[1]);
    return inverseViennotHelper(n, syt1, syt2, i + 1, result[0], paths);
  }
};

var inverseViennot = function(syt1, syt2) {
  var n;
  n = syt1.map(function (x) {return x.length;}).reduce(function (x, y) {
    return x + y;
  }, 0);

  return inverseViennotHelper(n, syt1, syt2);
};


var sections = 8;
var gridSize = 40;
var margin = 10;

var canvas = document.getElementById('canvas');
var contextNormal = canvas.getContext('2d');
var canvasInverse = document.getElementById('canvas-inverse');
var contextInverse = canvasInverse.getContext('2d');

function resetCanvas(context) {
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

resetCanvas(contextNormal);
resetCanvas(contextInverse);

var paths;

var translateAxis = function(point) {
    var zeroX = gridSize;
    var zeroY = gridSize*(sections + 1);
    return [ zeroX + point[0] * 40 , zeroY - point[1]*40 ];
};

var colors = [ '#27a033', '#fe546a', '#6393f3', '#5d358f',
               '#38e040', '#FF7E00',  '#ad3c56', '#fe546a' ];

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
    this.currPoint[0] = this.currPoint[0] + this.deltaX;
    this.currPoint[1] = this.currPoint[1] + this.deltaY;
  },
  resetPoints : function () {
    var line = paths[this.colorIndex][this.colorPathIndex];
    this.startPoint = line[this.point];
    this.currPoint = Object.create(this.startPoint);
    this.endPoint = line[this.point + 1];
  }
};

var render = function(context, color) {
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
    render(contextNormal, colors[state.colorIndex]);
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

function frameInverse() {
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
    render(contextInverse, colors[state.colorIndex]);
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
    getAnimationFrame().then(frameInverse);
  } else {
    return Promise.resolve();
  }
}

var computeButton = document.getElementById('compute');
var perm = document.getElementById('perm');


computeButton.onclick = function () {
  var permutation = perm.value.split(',').map(function (x) {
    return parseInt(x);
  });
  var result = viennot(permutation, true);
  var syt1 = result[0];
  var syt2 = result[1];
  paths = result[2];
  contextNormal.clearRect(0,0,canvas.width,canvas.height);
  sections = permutation.length + 1;
  resetCanvas(contextNormal);
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

var youngTableaux1 = document.getElementById('syt1');
var youngTableaux2 = document.getElementById('syt2');
var computeInverseButton = document.getElementById('compute-inverse-button');
var resultPermutation = document.getElementById('perm-inverse');
var resultInverse;

computeInverseButton.onclick = function () {
  var syt1 = youngTableaux1.value.split('\n').map(function (row) {
    return row.split(' ').map(function (n) {
      return parseInt(n);
    });
  });

  var syt2 = youngTableaux2.value.split('\n').map(function (row) {
    return row.split(' ').map(function (n) {
      return parseInt(n);
    });
  });

  resultInverse = inverseViennot(syt1, syt2);
  var permutation = resultInverse[0];
  paths = resultInverse[1];
  resultPermutation.value = '      ' + permutation.reduce(function(x,y) {return x.toString() + y; }, '');
  contextInverse.clearRect(0,0,canvas.width,canvas.height);
  sections = permutation.length + 1;
  resetCanvas(contextInverse);
  paths = paths.map(function (colorPaths) {
    return colorPaths.map(function (line) {
      return line.map(function (point) {
        return translateAxis(point);
      });
    });
  });
  state.resetState();
  frameInverse();
};

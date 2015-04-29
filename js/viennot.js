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

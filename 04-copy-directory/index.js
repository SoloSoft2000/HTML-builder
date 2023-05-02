const fs = require('fs');
const path = require('path');

function copyDir(pathFrom, pathTo) {
  console.log(pathFrom, pathTo);
}

copyDir(path.join(__dirname), path.join(__dirname, '-copy'));

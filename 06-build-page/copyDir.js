const fsPromises = require('node:fs/promises');
const fs = require('fs');
const path = require('path');

exports.copyDir = (pathFrom, pathTo) => {
  fsPromises.rm(pathTo, {force: true, recursive: true}).then(() => {
    fs.mkdir(pathTo, { recursive: true }, (err) => {
      if (err) throw err;
      fs.readdir(pathFrom, {withFileTypes: true}, (error, dirList) => {
        dirList.forEach((fileName) => {
          if(fileName.isDirectory()) {
            this.copyDir(path.join(pathFrom, fileName.name), path.join(pathTo, fileName.name));
          } else {
            fs.copyFile(path.join(pathFrom, fileName.name), path.join(pathTo, fileName.name), (err) => {
              if (err) throw err;
            });
          }
        });
      });
    });
  });
};

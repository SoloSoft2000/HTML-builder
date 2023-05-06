const fsPromises = require('node:fs/promises');
const path = require('path');

const copyDir = (pathFrom, pathTo) => {
  fsPromises.rm(pathTo, {force: true, recursive: true})
  .then(() => {
    fsPromises.mkdir(pathTo, { recursive: true })
    .then(() => {
      fsPromises.readdir(pathFrom, {withFileTypes: true})
      .then((dirList) => {
        for (const item of dirList) {
          if (item.isDirectory()) {
            copyDir(path.join(pathFrom, item.name), path.join(pathTo, item.name));
          } else {
            fsPromises.copyFile(path.join(pathFrom, item.name), path.join(pathTo, item.name));
          }
        }
      })
    })
  })
}

copyDir(path.join(__dirname,'files'), path.join(__dirname, 'files-copy'));

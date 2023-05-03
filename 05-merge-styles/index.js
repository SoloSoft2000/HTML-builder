const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const pathToBundle = path.join(__dirname, 'project-dist', 'bundle.css');

fsPromises.rm(pathToBundle, {force: true}).then(() => {

  const stream =  new fs.WriteStream(pathToBundle); // поток для записи

  fs.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}, (error, dirList) => {
    dirList.forEach((fileDir) => {
      const pathItem = path.join(__dirname, 'styles', fileDir.name);
      fs.stat(pathItem, (err, stats) => {
        if(!stats.isDirectory() && path.extname(fileDir.name) === '.css') {
          const streamCss = new fs.ReadStream(pathItem);
          streamCss.on('readable', () => {
            const data = streamCss.read();
            if (data) {
              stream.write(data);
              console.log('file: ', data);
            }
          });
        }
      });
    });
  });
});
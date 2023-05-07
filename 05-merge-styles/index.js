const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');


const mergeCss = (distPath, distName) => {
  const pathToBundle = path.join(__dirname, distPath, distName);

  fsPromises.rm(pathToBundle, {force: true}).then(() => {
    const stream =  new fs.createWriteStream(pathToBundle); // поток для записи

    fsPromises.readdir(path.join(__dirname, 'styles'), {withFileTypes: true}).then((dirList) => {
      for (const item of dirList) {
        const pathItem = path.join(__dirname, 'styles', item.name);
        fsPromises.stat(pathItem).then((stats) => {
          if(!stats.isDirectory() && path.extname(item.name) === '.css') {
            const streamCss = new fs.createReadStream(pathItem);
            streamCss.on('data', (data) => {
              stream.write(data);
            });
          }
        });
      }
    });
  });
};

mergeCss('project-dist', 'bundle.css');

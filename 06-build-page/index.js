const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const copyDir = (pathFrom, pathTo) => {
  fsPromises.rm(pathTo, {force: true, recursive: true}).then(() => {
    fsPromises.mkdir(pathTo, { recursive: true }).then(() => {
      fsPromises.readdir(pathFrom, {withFileTypes: true}).then((dirList) => {
        for (const item of dirList) {
          if (item.isDirectory()) {
            copyDir(path.join(pathFrom, item.name), path.join(pathTo, item.name));
          } else {
            fsPromises.copyFile(path.join(pathFrom, item.name), path.join(pathTo, item.name));
          }
        }
      });
    });
  });
};

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

const distPath = 'project-dist';

async function changeTemplate(array, htmlText) {
  for (const template of array) {
    const txt = await fsPromises.readFile(path.join(__dirname, 'components', `${template[1]}.html`));
    htmlText = htmlText.replace(template[0], txt.toString());
  }
  const stream =  new fs.WriteStream(path.join(__dirname, distPath, 'index.html'));
  stream.write(htmlText);
}


fsPromises.mkdir(path.join(__dirname, distPath), { recursive: true }).then(() => { // создаем папку
  mergeCss(distPath, 'style.css'); // объединяем css
  copyDir(path.join(__dirname, 'assets'), path.join(__dirname, distPath, 'assets')); // копируем папку assets
});


fsPromises.readFile(path.join(__dirname, 'template.html')).then((data)=>{
  let tmpHtml = data.toString();
  const tempMatchArr = Array.from(tmpHtml.matchAll(/{{(.*?)}}/g));
  changeTemplate(tempMatchArr, tmpHtml);
});

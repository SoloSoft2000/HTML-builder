const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');

const copyDir = (pathFrom, pathTo) => {
  fsPromises.rm(pathTo, {force: true, recursive: true}).then(() => {
    fs.mkdir(pathTo, { recursive: true }, (err) => {
      if (err) throw err;
      fs.readdir(pathFrom, {withFileTypes: true}, (error, dirList) => {
        dirList.forEach((fileName) => {
          if(fileName.isDirectory()) {
            copyDir(path.join(pathFrom, fileName.name), path.join(pathTo, fileName.name));
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

const mergeCss = (distPath, distName) => {
  const pathToBundle = path.join(__dirname, distPath, distName);
  fsPromises.rm(pathToBundle, {force: true}).then(() => {
    const stream =  new fs.WriteStream(pathToBundle);
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
              }
            });
          }
        });
      });
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

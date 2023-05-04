const fsPromises = require('node:fs/promises');
const fs = require('node:fs');
const path = require('node:path');
const mergeCss = require('./mergeCss.js');
const copyDir = require('./copyDir.js');

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
  mergeCss.mergeCss(distPath, 'style.css'); // объединяем css
  copyDir.copyDir(path.join(__dirname, 'assets'), path.join(__dirname, distPath, 'assets')); // копируем папку assets
});


fsPromises.readFile(path.join(__dirname, 'template.html')).then((data)=>{
  let tmpHtml = data.toString();
  const tempMatchArr = Array.from(tmpHtml.matchAll(/{{(.*?)}}/g));
  changeTemplate(tempMatchArr, tmpHtml);
});

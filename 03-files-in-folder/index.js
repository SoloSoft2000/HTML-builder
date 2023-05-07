const path = require('node:path');
const fs = require('node:fs/promises');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}).then((dirList) => {
  for (const item of dirList) {
    const pathItem = path.join(__dirname, 'secret-folder', item.name);
    fs.stat(pathItem).then((stats) => {
      if(!stats.isDirectory()) {
        const extName = path.extname(item.name);
        const fileName = path.basename(item.name, extName);
        console.log(`${fileName} - ${extName.slice(1)} - ${stats.size}b`);
      }    
    });
  }
});

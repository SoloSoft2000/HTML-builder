const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, dirList) => {
  dirList.forEach((item) => {
    const pathItem = path.join(__dirname, 'secret-folder', item.name);
    fs.stat(pathItem, (err, stats) => {
      if(!stats.isDirectory()) {
        const extName = path.extname(item.name);
        const fileName = path.basename(item.name, extName);
        console.log(`${fileName} - ${extName.slice(1)} - ${stats.size}b`);
      }
    });
  });
});

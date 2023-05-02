const path = require('path');
const fs = require('fs');

fs.readdir(path.join(__dirname, 'secret-folder'), {withFileTypes: true}, (error, dirList) => {
  if (!error) {
    dirList.forEach((item) => {
      if (item.isFile()) {
        const extName = path.extname(item.name);
        console.log(path.basename(item.name, extName), extName);
      }
    });
  }
});

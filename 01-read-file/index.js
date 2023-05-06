const path = require('node:path')
const fs = require('node:fs');

const stream = new fs.createReadStream(path.join(__dirname, 'text.txt'));

stream.on('data', (data) => process.stdout.write(data));

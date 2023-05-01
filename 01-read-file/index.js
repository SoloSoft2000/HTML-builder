const path = require('path');
const fs = require('fs');

const stream = new fs.ReadStream(path.join(__dirname, 'text.txt'));

stream.on('readable', () => {
  const data = stream.read();
  if (data)
    process.stdout.write(data);
});

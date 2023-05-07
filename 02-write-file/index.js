const path = require('node:path');
const fs = require('node:fs');

const stream =  new fs.createWriteStream(path.join(__dirname, 'text.txt'));

process.stdout.write('What you say: > ');

process.stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') {
    process.exit();
  }
  stream.write(data);
  process.stdout.write(' > ');
});

process.on('SIGINT', process.exit);

process.on('exit', () => {
  process.stdout.write('Thank you, Buy');
});

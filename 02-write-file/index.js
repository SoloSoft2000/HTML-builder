const path = require('path');
const fs = require('fs');

const stream =  new fs.WriteStream(path.join(__dirname, 'text.txt'));

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
  stream.write('\n');
  process.stdout.write('Thank you, Buy');
});

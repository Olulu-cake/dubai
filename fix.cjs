const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');
const lines = code.split('\n');

const fixLines = [38, 208, 269, 282, 286]; // 0-indexed for 39, 209, 270, 283, 287
fixLines.forEach(i => {
  lines[i] = lines[i].replace('text-[15px]', 'text-[13px]');
});

fs.writeFileSync('index.html', lines.join('\n'));
console.log('Fixed lines');

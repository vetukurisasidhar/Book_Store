const fs = require('fs');
const path = require('path');

const walk = (dir, callback) => {
  fs.readdirSync(dir).forEach(file => {
    let filepath = path.join(dir, file);
    let stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, callback);
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      callback(filepath);
    }
  });
};

const srcDir = path.join(__dirname, 'src');

walk(srcDir, (filepath) => {
  let content = fs.readFileSync(filepath, 'utf8');
  let original = content;

  // 1. Replace inside template literals first (e.g. `http://localhost:8000/uploads/...`)
  content = content.replace(/`http:\/\/localhost:8000/g, '`${window.BACKEND_URL}');

  // 2. Replace single quoted strings (e.g. 'http://localhost:8000/api/...')
  content = content.replace(/'http:\/\/localhost:8000/g, "window.BACKEND_URL + '");

  // 3. Replace double quoted strings (e.g. "http://localhost:8000/api/...")
  content = content.replace(/"http:\/\/localhost:8000/g, 'window.BACKEND_URL + "');

  if (content !== original) {
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`Updated backend URL bindings in: ${path.basename(filepath)}`);
  }
});

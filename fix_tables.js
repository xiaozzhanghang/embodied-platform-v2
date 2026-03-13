const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src/app');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

function processFile(filePath) {
  if (!filePath.endsWith('.js') && !filePath.endsWith('.jsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // 1. Add fixed: 'right' to action column
  // Match standard action columns
  content = content.replace(/({\s*(?:title)?\s*:\s*['"`]操作['"`][^}]*key\s*:\s*['"`]action['"`][^}]*)}/g, (match, p1) => {
    if (p1.includes("fixed:")) return match;
    return p1 + ', fixed: \'right\' }';
  });

  // 2. Add scroll={{ x: 'max-content' }} to <Table ... />
  content = content.replace(/<Table\s+([^>]*?)>/g, (match, p1) => {
    let newAttr = p1;
    if (!newAttr.includes('scroll=')) {
      newAttr += ' scroll={{ x: \'max-content\' }}';
    }
    return `<Table ${newAttr}>`;
  });

  // 3. Add rowSelection to <Table ... />
  content = content.replace(/<Table\s+([^>]*?)>/g, (match, p1) => {
    let newAttr = p1;
    if (!newAttr.includes('rowSelection=')) {
      newAttr += ' rowSelection={{ type: \'checkbox\' }}';
    }
    return `<Table ${newAttr}>`;
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

walkDir(directoryPath, processFile);
console.log('Processing complete.');

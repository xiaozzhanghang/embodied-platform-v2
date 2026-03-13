const fs = require('fs');

const files = [
  'src/app/collection/tasks/config/page.js',
  'src/app/collection/qa/page.js',
  'src/app/projects/page.js',
  'src/app/simulation/assets/page.js',
  'src/app/annotation/answer/page.js',
  'src/app/annotation/marketplace/page.js',
  'src/app/annotation/object-tags/page.js',
  'src/app/annotation/stats/page.js',
  'src/app/dashboard/page.js'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  // We want to match: styles={{ body: { ... }}> OR just missing closing tag with >.
  // The pattern is: styles=\{\{ body: \{([^{}]*)\}\s*>
  // Then replace with: styles={{ body: {$1} }}>
  // But wait, there are also cases without > at the end of the line.
  // Actually, previously bodyStyle={{ padding: 24 }} was replaced by styles={{ body: { padding: 24 }
  // So we just need to find `styles={{ body: { (something)` that is followed by `>` or `\n` or ` `, and wait...
  // Let's just do an exact match: styles={{ body: { ([^\}]+) }}
  // Wait, no. Current state is: `styles={{ body: { padding: '32px' }>` wait, actually the original string was `bodyStyle={{ padding: '32px' }}>`
  // so the `}}` became `} }`? NO, my sed replacement was: `sed -i '' 's/bodyStyle={{/styles={{ body: {/g'`
  // So `bodyStyle={{ padding: 24 }}` became `styles={{ body: { padding: 24 }}`
  // notice it only has two `}` at the end! It needs three `}}}`.
  
  // Let's just replace `styles=\{\{ body: \{(.*?)\}\}` with `styles={{ body: {$1} }}`
  // Let's print out what we are replacing first
  const regex = /styles=\{\{\s*body:\s*\{([^\}]+)\}\}/g;
  content = content.replace(regex, (match, p1) => {
     console.log(`Fixing [${file}]: ${match}`);
     return `styles={{ body: {${p1}} }}`;
  });
  
  fs.writeFileSync(file, content);
});
console.log('Fixed files');

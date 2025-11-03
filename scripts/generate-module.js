const fs = require('fs');
const path = require('path');

const moduleName = process.argv[2];

if (!moduleName) {
  console.error('Please provide a module name');
  console.log('Usage: node scripts/generate-module.js <module-name>');
  process.exit(1);
}

const modulePath = path.join(__dirname, '..', 'src', 'modules', moduleName);

const folders = [
  'controllers',
  'services',
  'repositories',
  'validators',
  'dto',
  'routes',
];

console.log(`Generating module: ${moduleName}`);

// Create module folder structure
folders.forEach((folder) => {
  const folderPath = path.join(modulePath, folder);
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
    console.log(`Created folder: ${folder}`);
  }
});

// Create index.js
const indexContent = `const ${moduleName}Routes = require('./routes/${moduleName}.routes');

module.exports = {
  ${moduleName}Routes,
};
`;

fs.writeFileSync(path.join(modulePath, 'index.js'), indexContent);
console.log('Created index.js');

console.log(`Module ${moduleName} generated successfully!`);

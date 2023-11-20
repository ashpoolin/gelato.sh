const fs = require('fs');
const path = require('path');

const srcPath = path.resolve(__dirname, '/opt/render/project/src/node_modules/crypto');
const destPath = path.resolve(__dirname, '/opt/render/project/src/src/pages/crypto');


fs.symlink(srcPath, destPath, 'dir', (err) => {
  if (err) {
    console.error('Failed to create symbolic link:', err);
  } else {
    console.log('Symbolic link created successfully.');
  }
});

// import { symlink } from 'fs/promises';
// import { resolve } from 'path';

// const srcPath = resolve(__dirname, 'node_modules/crypto');
// const destPath = resolve(__dirname, 'src/components/crypto');

// symlink(srcPath, destPath, 'dir')
//   .then(() => {
//     console.log('Symbolic link created successfully.');
//   })
//   .catch((err) => {
//     console.error('Failed to create symbolic link:', err);
//   });
const fs = require('fs');
const path = require('path');

const target = path.resolve(__dirname, 'node_modules/crypto-browserify');
const link = path.resolve(__dirname, 'src/pages/crypto');


fs.symlink(target, link, 'dir', (err) => {
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
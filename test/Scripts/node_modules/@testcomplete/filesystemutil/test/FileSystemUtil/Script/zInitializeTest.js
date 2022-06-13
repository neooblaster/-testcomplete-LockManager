// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);

function zInitializeTest () {
  fs().write('./MyFileSource.txt', 'This is a text file - Source File');
  fs().write('./MyFileTest.txt', 'This is a text file - Living File');
  fs().write('./MyFileToDelete.txt', 'This is a text file - Will be delete');
  fs().write('./MyFileToDeleteOnlyExists.txt', 'This is a text file - Will be delete if exists');
}
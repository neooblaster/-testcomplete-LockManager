// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);

function cDeleteFile () {
  Log.message('Reading Local file "./MyFileToDelete.txt" : ' + fs().read('./MyFileToDelete.txt'));
  fs().delete('./MyFileToDelete.txt');
  
}
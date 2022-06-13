// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);

function aReadFile () {
  Log.message('Reading Local file "./MyFileSource.txt" : ' + fs().read('./MyFileSource.txt'));
}
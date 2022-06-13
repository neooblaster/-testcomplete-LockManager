// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);

function bWriteFile () {
  Log.message('Reading Local file "./MyFileTest.txt" : ' + fs().read('./MyFileTest.txt'));
  
  Log.message('Writing Local file "./MyFileTest.txt" with "File modified by bWriteFile" : ');
  fs().write('./MyFileTest.txt', 'File modified by bWriteFile');
  
  Log.message('Reading Local file again"./MyFileTest.txt" : ' + fs().read('./MyFileTest.txt'));
  
}
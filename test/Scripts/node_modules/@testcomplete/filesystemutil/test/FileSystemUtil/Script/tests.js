// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);


function TestWriteNullContent () {
  fs().write('./Files/FileTest_NullContent.txt', null);
}
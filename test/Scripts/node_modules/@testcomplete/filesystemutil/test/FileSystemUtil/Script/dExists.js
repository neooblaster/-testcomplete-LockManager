// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);

function dExists () {
  let sFile = './MyFileToDeleteOnlyExists.txt'; 

  if (fs().exists(sFile)) {
    Log.message(`File ${sFile} exists. Deletion.`);
    fs().delete(sFile)
  } else {
    Log.message(`File ${sFile} does not exists.`);
  }
  
}
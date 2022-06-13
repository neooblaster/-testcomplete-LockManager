# TestComplete - FileSystemUtil

> A very basic file system interface to let scripts working with TestComplete & NodeJS at the same time.

* **Version** : ``v0.1.3``
* **Compatibility** : **TestComplete** - **NodeJS**
* **Script** : ``./node_modules/@testcomplete/filesystemutil/FileSystemUtil.js``
* **Dependencies** :
    * none
* **Test Project** : ``./test/FileSystemUtil.pjs``
  
  
## Summary

[](BeginSummary)
* [Summary](#summary)
* [FileSystemUtil Setup for TestComplete](#filesystemutil-setup-for-testcomplete)
* [Get Started](#get-started)
* [Read a file `read()`](#read-a-file-read)
* [Write a file `write()`](#write-a-file-write)
* [Deleting a file `delete`](#deleting-a-file-delete)
* [Check if a file exists `exists()`](#check-if-a-file-exists-exists)
[](EndSummary)



## FileSystemUtil Setup for TestComplete

As this library is published on **npmjs**,
you can easily get library with the following command
if you have **nodejs** installed on your computer.

````bash
npm install @testcomplete/filesystemutil
````

Please confer to this documentation to add script in TestComplete :

Script List for the setup :

* ``./node_modules/@testcomplete/filesystemutil/FileSystemUtil.js``

[@testcomplete/testcompletelibrarysetup](https://www.npmjs.com/package/@testcomplete/testcompletelibrarysetup)



## Get Started

First of all, you have to add the script ``FileSystemUtil.js`` to your
script library in **TestComplete**.

In any script (TestComplete of NodeJs), require library like this

````javascript
// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs = require(`${sPrePath}FileSystemUtil`);
````
    
    
    
## Read a file `read()`

The method ``read( $sFileLocation )`` open the file a return it whole content.
Encoding used to read the content is the ``utf-8``.

**Encoding can not be changed for the moment.**

````javascript
// Read file
let sFileContent = fs().read('/path/to/the/file');
````



## Write a file `write()`

The method ``write( $sFileLocation, $sContent)`` open the file and set content
with provided content. It replaces the content of the file (not appended).

````javascript
// Set new file content
fs().write('/path/to/the/file', 'My New Content String');
````



## Deleting a file `delete`

The method ``delete( $sFileLocation )`` delete specified file.

````javascript
// Delete file
fs().delete('/path/to/the/file');
````



## Check if a file exists `exists()`

The method ``exists( $sFileLocation )`` returns **true** if the specified file
has been found. Else returns **false**

````javascript
// Delete file if exists
if(fs().exists('/path/to/the/file')){
    fs().delete('/path/to/the/file');
}
````


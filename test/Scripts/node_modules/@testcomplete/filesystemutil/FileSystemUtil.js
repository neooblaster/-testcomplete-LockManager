/**
 * Version v0.1.3
 *
 * @author: Nicolas DUPRE (VISEO)
 *
 * File System Util for TestComplete & NodeJS Compatibility.
 *
 * @return {{read: (function(*=): string), exists: exists, write: write, delete: delete}|{read: (function(*=): *), exists: (function(*=): *), write: (function(*=, *=): *), delete: (function(*=): *)}}
 */
function FileSystemUtil() {
    try {
        // Test Complete
        if (aqFile) {
            return {
                read: function ($sFileLocation) {
                    return aqFile.ReadWholeTextFile($sFileLocation, aqFile.ctUTF8)
                },
                write: function ($sFileLocation, $sContent = '') {
                    // content for aqFile can not be null.
                    if($sContent === null) $sContent = '';

                    return aqFile.WriteToTextFile($sFileLocation, $sContent, aqFile.ctUTF8, true);
                },
                delete: function ($sFileLocation) {
                    return aqFile.Delete($sFileLocation);
                },
                exists: function ($sFileLocation) {
                    return aqFile.Exists($sFileLocation);
                }
            }
        }
    } catch ($err) {
        // Try NodeJS
        let fs = require('fs');

        return {
            read: function ($sFileLocation) {
                return fs.readFileSync($sFileLocation, 'utf-8').toString().trim();
            },
            write: function ($sFileLocation, $sContent) {
                fs.writeFileSync($sFileLocation, $sContent, function (err) {
                    return !err;
                });
            },
            delete: function ($sFileLocation) {
                try {
                    fs.unlinkSync($sFileLocation);
                } catch ($err) {

                }
            },
            exists: function ($sFileLocation) {
                try {
                    let bReturn = true;

                    fs.accessSync($sFileLocation, fs.constants.F_OK | fs.constants.W_OK, (err) => {
                        if (err) {
                            bReturn = false;
                        }
                    });

                    return bReturn;
                } catch(err) {
                    return false;
                }
            }
        }
    }
}

module.exports = FileSystemUtil;
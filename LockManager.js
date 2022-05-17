// Check for NodeJS. If NodeJS, require to use dependencies (in scope)
let sPrePath = typeof process !== 'undefined' ? '@testcomplete/' : '';

let fs     = require(`${sPrePath}FileSystemUtil`);
let logger = require(`${sPrePath}LoggerUtil`);
let sleep  = require(`${sPrePath}Sleep`);

/**
 * Version v0.3.2
 *
 * @author: Nicolas DUPRE (VISEO)
 *
 * Interface to create / release file which purpose is a Lock file to prevent
 * concurrent processing.
 *
 * @return {LockManager}
 * @constructor
 *
 */
function LockManager () {
    let self = this;

    /**
     * @type {String}  Lock name set for instance for deferred lock execution.
     * @private
     */
    self._sLockName = null;

    /**
     * @type {String}  Folder path which contains lock file.
     * @private
     */
    self._sLockFolderPath = null;

    /**
     * @type {number}  Delay in ms to wait for existing lock file release before
     *                 raising error.
     * @private
     */
    self._nTimeout = 300000;

    /**
     * @type {number}  Time interval between two check when lock file exists.
     * @private
     */
    self._nInterval = 60000;

    /**
     * @type {boolean} Flag to raised error if lock has not been acquired.
     * @private
     */
    self._bRaiseError = true;

    /**
     * File System  Util
     */
    self.fs     = fs;

    /**
     * Logger Util
     */
    self.logger = logger;

    /**
     * Set the lock file name for instance. Can be useful for deferred execution
     *
     * @param {String} $sLockName  Name of the file which stand for the lock.
     *
     * @return {LockManager}
     */
    self.setLockName = function ($sLockName) {
        self._sLockName = $sLockName;

        return self;
    };

    /**
     * Set the folder path which will contain the lock file.
     *
     * @param {String} $sLockFolderPath Only the path to the folder. Do not set filename.
     *
     * @return {LockManager}
     */
    self.setLockFolderPath = function ($sLockFolderPath = './') {
        if (!/\/$/.test($sLockFolderPath)) {
            $sLockFolderPath += '/';
        }
        self._sLockFolderPath = $sLockFolderPath;

        return self;
    };

    /**
     * Define the time to wait for the availability of the lock file before raising error.
     *
     * @param {Number} $nTimeout  Time to wait in ms.
     *
     * @return {LockManager}
     */
    self.setTimeout = function ($nTimeout = 300000) {
        self._nTimeout = $nTimeout;

        return self;
    };

    /**
     * Define the time between two retry for acquiring the lock file.
     * Note : if the interval is two higher, an another program can take the lock
     * during the delay.
     *
     * @param {Number} $nInterval  Interval to wait between two check in ms.
     *
     * @return {LockManager}
     */
    self.setInterval = function ($nInterval = 60000) {
        self._nInterval = $nInterval;

        return self;
    };

    /**
     * (Wait and) Set lock file.
     *
     * @param {String} $sLockName    Optional, name of the lock file.
     * @param {String} $sLockContent Optional, content to append in the lock file.
     *
     * @return {boolean} Indicate if we get the lock.
     */
    self.lock = function ($sLockName = self._sLockName, $sLockContent = null) {
        // Argument handling
        if ($sLockName === null) {
            $sLockName = self._sLockName;
        }

        let sLockPathFile = self.getLockFilePath($sLockName);
        let nStartAt = new Date();
        let nLastTS = new Date();
        let bLocked = false;

        // Check for the availability of lock (file not found)
        do {
            nLastTS = new Date();

            // In the case where we have provided lock content,
            // check if the lock file content match (if it is the case, it's our lock)
            if ($sLockContent !== null) {
                if (self.isLockExists($sLockName, $sLockContent)) {
                    // Simply indicated lock acquired.
                    // No file creating required.
                    bLocked = true;
                    break;
                }
            }

            // If the file does not exists, we can acquired the lock
            // by creating the file
            if (!self.fs().exists(sLockPathFile)) {
                self.fs().write(sLockPathFile, $sLockContent);
                bLocked = true;
                break;
            }

            // Do not perform any delay action if timeout is disabled.
            if(self._nTimeout && self._nTimeout > 0){
                // TestComplete
                try {
                    Indicator.PushText(`Waiting for lock '${$sLockName}'`);
                    Delay(self._nInterval);
                }
                // NodeJS
                catch ($err) {
                    let waitTill = new Date(new Date().getTime() + self._nInterval);
                    while(waitTill > new Date()){}
                }
            } else {
                // Add 1 ms to lead loop condition to false (force only 1 execution)
                nLastTS++;
            }

        } while (!bLocked && ((nLastTS - nStartAt) < self._nTimeout));

        if (!bLocked) {
            if (self._bRaiseError) {
                self.logger().error(`LockManager :: Lock File '${sLockPathFile}' already exist and has not been released in defined timeout delay.`);
            }
        } else {
            self.logger().message(`LockManager :: Lock File '${sLockPathFile}' successfully set.`);
        }

        return bLocked;
    };

    /**
     * Make full path to the lock file.
     *
     * @param {String} $sLockName  Lock file name.
     *
     * @return {string|boolean}  Path or false
     */
    self.getLockFilePath = function ($sLockName = self._sLockName) {
        if(self.isLockNameSet($sLockName)) return `${self._sLockFolderPath}${$sLockName}`;

        return false;
    };

    /**
     * Check if the file corresponding to the lock exists in the folder.
     *
     * @param {String} $sLockName    Lock file name.
     * @param {String }$sLockContent Check if the content match
     *
     * @return {boolean}    True if the file exists (and content match is provided)
     */
    self.isLockExists = function ($sLockName = self._sLockName, $sLockContent = null) {
        // Argument handling
        if ($sLockName === null) {
            $sLockName = self._sLockName;
        }

        if (self.fs().exists(self.getLockFilePath($sLockName))) {
            if ($sLockContent !== null) {
                return $sLockContent === self.getLockContent($sLockName);
            } else {
                return true;
            }
        } else {
            return false;
        }
    };

    /**
     * Check if the lock file is provided (or set)
     *
     * @param {String} $sLockName  Lock file name.
     *
     * @return {boolean}
     */
    self.isLockNameSet = function ($sLockName) {
        if (!$sLockName) {
            self.logger().error(`LockManager :: Any Lock name provided to method 'lock()' or previously set with 'setLockName()'.`);
            return false;
        }

        return true;
    };

    /**
     * Set flag indicating if we log error or simply return false for method 'lock()'.
     *
     * @param {Boolean} $bRaiseError.
     */
    self.raiseError = function ($bRaiseError = true) {
        self._bRaiseError = $bRaiseError;
    };

    /**
     * Get the content of the lock file (if exists).
     *
     * @param {String} $sLockName  Lock file name.
     *
     * @return {String|boolean} Content of false if file does not exists.
     */
    self.getLockContent = function ($sLockName = self._sLockName) {
        if(self.isLockExists($sLockName)) return self.fs().read(self.getLockFilePath($sLockName));

        return false;
    };

    /**
     * Delete the lock file if it exists.
     *
     * @param {String} $sLockName  Optional, Name of the lock file.
     *
     * @return {boolean} true if lock file deleted, else false.
     */
    self.release = function ($sLockName = self._sLockName) {
        if (self.isLockExists($sLockName)) {
            self.fs().delete(self.getLockFilePath($sLockName));
            return true;
        }

        return false;
    };

    return self;
}

module.exports = LockManager;

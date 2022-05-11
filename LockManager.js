// Check for NodeJS. If NodeJS, require need relative path
let sPrePath = typeof process !== 'undefined' ? './' : '';

let fs     = require(`${sPrePath}FileSystemUtil`);
let logger = require(`${sPrePath}LoggerUtil`);
let sleep  = require(`${sPrePath}Sleep`);

/**
 * Version v0.2.0
 *
 * @author: Nicolas DUPRE (VISEO)
 *
 * Interface to create / release file which purpose is a Lock file to prevent
 * concurrent processing.
 *
 * @return {LockManager}
 * @constructor
 *
 * @TODO : isLockExists() : Method to check if the file exists
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
    self.lock = function ($sLockName = self._sLockName, $sLockContent = '') {
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

            if (!self.fs().exists(sLockPathFile)) {
                self.fs().write(sLockPathFile, $sLockContent);
                bLocked = true;
                break;
            }

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
        let sLockPathFile = self.getLockFilePath($sLockName);

        if (self.fs().exists(sLockPathFile)) return self.fs().read(sLockPathFile);

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
        let sLockPathFile = self.getLockFilePath($sLockName);

        if (self.fs().exists(sLockPathFile)) {
            self.fs().delete(sLockPathFile);
            return true;
        }

        return false;
    };

    return self;
}

module.exports = LockManager;

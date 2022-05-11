# TestComplete - LockManager

> A little library to handle lock file (check, set, release).

* **Version** : ``v0.2.0``
* **Dependencies** :
    * ``FileSystemUtim`` : [TestComplete/Core/FileSystemUtil](https://gitlab.viseo.com/testcomplete/core/filesystemutil)
        * ``./node_modules/@testcomplete/filesystemutil/FileSystemUtil.js``
    * ``LoggerUtil`` : [TestComplete/Core/LoggerUtil](https://gitlab.viseo.com/testcomplete/core/loggerutil)
        * ``./node_modules/@testcomplete/loggerutil/LoggerUtil.js``
    * ``Sleep`` : [TestComplete/Library/Sleep](https://gitlab.viseo.com/testcomplete/library/sleep)
        * ``./node_modules/@testcomplete/sleep/Sleep.js``
    

## Summary

[](MakeSummary)



## LockManager Setup for TestComplete

As this library is published on **npmjs**,
you can easily get library with the following command
if you have **nodejs** installed on your computer.

````bash
npm install @testcomplete/lockmanager
````

Please confer to this documentation to add script in TestComplete :

Script List for the setup :

* ``./node_modules/@testcomplete/filesystemutil/FileSystemUtil.js``
* ``./node_modules/@testcomplete/loggerutil/LoggerUtil.js``
* ``./node_modules/@testcomplete/sleep/Sleep.js``
* ``./node_modules/@testcomplete/lockmanager/LockManager.js``

[@testcomplete/testcompletelibrarysetup](https://www.npmjs.com/package/@testcomplete/testcompletelibrarysetup)



## Get Started

In the most complex systems it exists a lock concept to prevent concurrent
execution as like lock on table in Database System or Locking object as it
exists in SAP. This library creates a lock file in specified folder.
If lock exists, it will wait for the other execution will release lock during
a limited time. So it offers intelligence in concurrent execution
to prevent blocking situation which could lead to unexpected error.

To setup a lock concept, please do as follow :


### Requiring Libary

````javascript
// 1. Requiring Library
const LockManager = require('LockManager');

// 2. Instantiate Lock Manager
let LockMgr = new LockManager();
````



### Setting Up Lock Manager

To be functionnal, lock file system must be able to access to a shared
folder that will be accessible to all agents/executions which will run
lock file system.

I advise to use a shared network device.

The first step is to set the Folder path which will store lock file

````javascript
// 3. Setting Up LockManager
// --- 3.1. Set Folder Path
LockMgr.setLockFolderPath('/absolute/path/to/lock/folder/');
````



### Putting / Releasing lock file

There is two ways to work with lock file.
You can use a setup method to define the lock name which will be use
by this instance until you set a new one or specified lock name
in each method call.

I advise to setup the lock name at the beginning to simplify code writing.

````javascript
// 4. Setting up Lock Name
LockMgr.setLockName('EnterAnyStringWhichRespectYourSystemFilenameNamingConvention');
````

Once done, you have simply to call method ``lock()`` to get and set lock.

````javascript
if(LockMgr.lock( )){
    // Lock acquired, continue processing
} else {
    // Lock can not be acquired, raised error
}
````

If the lock already exist, the method ``lock( )`` will try every minute (interval)
to get and set lock for a maximum of 5 minutes (timeout).

**Interval** & **Timeout** can be configured.
Please confer to chapter **Detailed Documentation**.

Once your processing is done, do not forget to release the lock.
Do not forget to release lock in your error management as well.
In TestComplete, I advise to use Events to systematically release locks
when an error occur.

````javascript
LockMgr.release( );
````






## Detailed Documentation

Please find for the detailled documentation the instance
of **LockManager** under the variable ``LockMgr`` :

````javascript
let LockMgr = new LockManager();
````


### Setting Up Lock Name ``setLockName()``

> LockManager setLockName( String $sLockName )

The method ``setLockName()`` set the current working lock name for the
instance. All methods which use the lock name will refer to
internally stored lock name.

The method expects one argument which is a string standing for the name
of the file representing the lock file.

````javascript
LockMgr.setLockName('MyLockName');
````



### Setting Up Lock Folder Path ``setLockFolderPath()``

> LockManager setLockFolderPath( String $sLockFolderPath = './' )

The method ``setLockFolderPath()`` define the folder path where
lock files will be created and released.
By default, the folder path is set to ``null`` implying the lock file
will be located to the current execution. Lock will only work for the
same process, but for concurrent execution, it is preferred to
use a shared folder.

````javascript
LockMgr.setLockFolderPath('S:/TC_DATA/Technical/Locks/');
````



### Setting Timeout ``setTimeout()``

> LockManager setTimeout( [ Number $nTimeout = 300000 ] )

The method ``setTimeout()`` set the maximum time where the LockManager
will wait to get and set the lock file with method ``lock()``.

The timeout is expressed in millisecond and by default, it will wait for
five minutes.

````javascript
// Maximum waiting time to 10 minutes
LockMgr.setTimeout(10 * 60 * 1000);
````



### Setting Interval ``setInterval()``

> LockMgr setInterval( [ Number $nInterval = 60000 ] )

The method ``setInterval`` set the delay between to attempts get and set lock.
If the interval is to big, another process can get and set lock before 
your execution and you will have to wait more time.

The interval is expressed in milisecond and by default, il will retry every
one minutes to get and set lock.

````javascript
// Set attemps interval to 5 seconds
LockMgr.setInterval(5000);
````



### Get & Set Lock ``lock()``

> Boolean lock( [ String $sLockName = self._sLockName [, String $sLockContent = ''] ] )
>
> - Where self._sLockName set with method ``setLockName()``.

The method ``lock()`` is the opening method for the lock concept.
It will get & set the lock. If the lock is not available, it will wait
for the specified time set with method ``setTimeout()`` and perform
availability check every ``n`` second set with method `setInterval()`.

If the lock has been get and set, ``lock()`` method returns ``true``.
If the lock has not been get and set, it returns ``false``.

The error handling is in your charge thanks to the returned boolean.

````javascript
if(LockMgr.lock()){
    // Lock Acquired.
} else {
    // Lock not Acquired.
}
````

You can pass data to put in the lock file by filling the second argument.
In that case, you have to provided the first argument which is the lock name.
Set ``null`` to previously lock name set with method `setLockName()`.

````javascript
if(LockMgr.lock(null, 'Process ID : 1234')){
    // Lock Acquired.
} else {
    // Lock not Acquired.
}
````



### Release Lock ``release()``

> Boolean release( [ String $sLockName = self._sLockName ] )
>
> - Where self._sLockName set with method ``setLockName()``.

The method ``release()`` is the closing method for the lock concept.
It will delete the file representing the lock in the specified folder.

If the file has been deleted successfully, ``release()`` returns `true`.
If the file has not been deleted successfully (error or no longer exists),
it returns ``false``.

````javascript
// We do not care about the success or not of the lock file deletion.
LockMgr.release();
````



### Get Lock content ``getLockContent()``

> String|Boolean getLockContent( [ String $sLockName = self._sLockName] )
>
> - Where self._sLockName set with method ``setLockName()``.

As you can put content to the lock file, the method ``getLockContent``
will retrieve its content.

If the file does not exists, the method will returns ``false``, else
returns the file content (or an empty string if there is no content).

````javascript
let ProcessID = LockMgr.getLockContent();
````



### Retrieve full path of Lock ``getLockFilePath()``

> String|Boolean getLockFilePath( [ String $sLockName = self._sLockName] )
>
> - Where self._sLockName set with method ``setLockName()``.

If you need to get the full path to the lock file for any other purpose
than using lock concept, you can retrieve the path with the method 
``getLockFilePath()``.

You can provided the lock name (or left blank to use previously lock name
set with method ``setLockName()``).

If the ``$sLockName`` is invalid (or not set), the method will returns `false`,
else returns the path to the lock file.

````javascript
let sLockPath = LockMgr.getLockFilePath();
````
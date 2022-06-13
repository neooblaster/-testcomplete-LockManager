// 1. Requiring Library
const LockManager = require('LockManager');

function ConcurrentTestSimulation () {
  // 2. Instantiate Lock Manager
  let LockMgr = new LockManager();
  
  // 3. Setting Up location to the folder storing locks files
  LockMgr.setLockFolderPath('./Locks');
  
  // 4. Setting Up maximum time to wait to acquiring lock file
  LockMgr.setTimeout(2 * 60 * 1000);  // 15 secondes
  
  // 5. Setting Up interval time between 2 retry
  LockMgr.setInterval(1000);          // every second
  
  // 6. Setting Up the file name of the lock
  LockMgr.setLockName('LockManager_LockFile');
  
  // 7. Get Lock
  LockMgr.lock(); 
  
}
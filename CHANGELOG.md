# LockManager Changelog

## Version 0.3.0 - 2022.05.12

* [NEW] new function ``isLockExists()`` which check if the file exists and
optionally check if the content match (if specified).
* [CHANGED] Setting up a **timeout** of `0` will works as creates file if not exists,
so returning ``true`` or `false` (when file exists).
* [CHANGED] ``lock()`` method now returns `true` if the lock file exists and
it's content is equal to the content provided in the second arguments.
This behavior means the lock has been retrieved.



## Version 0.2.0 - 2022.05.11

* [NEW] Initial Version (published)
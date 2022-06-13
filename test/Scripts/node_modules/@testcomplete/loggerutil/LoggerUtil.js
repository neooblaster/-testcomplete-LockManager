/**
 * Version v0.1.2
 *
 * @author: Nicolas DUPRE (VISEO)
 *
 * Logger Util for TestComplete & NodeJS Compatibility.
 *
 * @return {{warning: warning, message: message, error: error}|{warning: *, message: *, error: *}}
 */
function LoggerUtil() {
    // Test Complete
    try {
        if (Log) {
            return {
                message: Log.Message,
                error: Log.Error,
                warning: Log.Warning
            };
        }
    } catch ($err) {
        // NodeJS
        try {
            if (console) {
                return {
                    message: console.log,
                    error: console.error,
                    warning: console.warn
                };
            }
        } catch ($err) {
            return {
                message: () => {},
                error: () => {},
                warning: () => {}
            }
        }
    }
}

module.exports = LoggerUtil;
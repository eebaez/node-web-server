/* Logger
 * Purpose:
 *     Standardize logging functionality across the application.
 * Functionality:
 *     - logging levels
 *     - one JSON object per line (valid JSON, safe escaping via JSON.stringify)
 *     - warn/error on stderr via console.warn / console.error
 *     - debug suppressed when NODE_ENV is production
 */

const { NODE_ENV } = process.env;
type LEVELS = "debug" | "info" | "warn" | "error";

const getTimestamp = (): string => {
    return new Date().toISOString();
};

const debug = (message: string) => {
    log("debug", message);
};

const info = (message: string) => {
    log("info", message);
};

const warn = (message: string) => {
    log("warn", message);
};

const error = (message: string) => {
    log("error", message);
};

const writeLine = (level: LEVELS, line: string) => {
    switch (level) {
        case "debug":
        case "info":
            console.log(line);
            break;
        case "warn":
            console.warn(line);
            break;
        case "error":
            console.error(line);
            break;
    }
};

const log = (level: LEVELS, message: string) => {
    if (level === "debug" && NODE_ENV === "production")
        return;

    const line = JSON.stringify({
        timestamp: getTimestamp(),
        level,
        message,
    });

    writeLine(level, line);
};

export default {
    debug,
    info,
    warn,
    error,
    log,
};

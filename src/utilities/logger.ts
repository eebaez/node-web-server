/* Logger 
* Purpose:
    Standarize logging functionality across the application.
* Functionality:
    - logging levels
    - color coding
    - structured output
    - debug mode for non-production setup
*/

const { NODE_ENV } = process.env;
type LEVELS = "debug" | "info" | "warn" | "error" ;

const turnRed = (text: string): string => {
    return `\x1b[31m${text}\x1b[0m`;
};

const turnGreen = (text: string): string => {
    return `\x1b[32m${text}\x1b[0m`;
};

const turnYellow = (text: string): string => {
    return `\x1b[33m${text}\x1b[0m`;
};

const turnPurple = (text: string): string => {
    return `\x1b[35m${text}\x1b[0m`;
};

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

const log = (level: LEVELS, message: string) => {
    if (level === "debug" && NODE_ENV === "production")
        return;

    let levelColorCoded: string;

    switch (level) {
        case "debug":
            levelColorCoded = turnPurple(level);
            break;
        case "info":
            levelColorCoded = turnGreen(level);
            break;
        case "warn":
            levelColorCoded = turnYellow(level);
            break;
        case "error":
            levelColorCoded = turnRed(level);
            break;
        default:
            levelColorCoded = turnGreen(level);
            break;
    }

    console.log(`{ "timestamp": "${getTimestamp()}", "level": "${levelColorCoded}", "message": "${message}" }`);
};

export default {
    debug,
    info,
    warn,
    error,
    log
};

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

const turnRed = (text) => {
    return `\x1b[31m${text}\x1b[0m`;
};

const turnGreen = (text) => {
    return `\x1b[32m${text}\x1b[0m`;
};

const turnYellow = (text) => {
    return `\x1b[33m${text}\x1b[0m`;
};

const turnPurple = (text) => {
    return `\x1b[35m${text}\x1b[0m`;
};

const getTimestamp = () => {
    return new Date().toISOString();
};

const debug = (message) => {
    log("debug", message);
};

const info = (message) => {
    log("info", message);
};

const warn = (message) => {
    log("warn", message);
};

const error = (message) => {
    log("error", message);
};

const log = (level, message) => {
    if (level === "debug" && NODE_ENV === "production")
        return;

    const logEntry = {
        "timestamp": getTimestamp(),
        "level": level,
        "message": message
    };

    let levelColorCoded = level;

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
    }

    console.log(`{ "timestamp": "${getTimestamp()}", "level": "${levelColorCoded}", "message": "${message}" }`);
};

module.exports = {
    debug,
    info,
    warn,
    error,
    log
};

/* Logger
 * Purpose:
 *     Standardize logging functionality across the application.
 * Functionality:
 *     - logging levels
 *     - one JSON object per line (valid JSON, safe escaping via JSON.stringify)
 *     - warn/error on stderr via console.warn / console.error
 *     - debug suppressed when NODE_ENV is production
 *     - messages accept string or Error (message, name, stack when available)
 */

const { NODE_ENV } = process.env;
type LEVELS = "debug" | "info" | "warn" | "error";

/** Value passed to log lines: plain text or an Error (stack and name included when useful). */
type LogMessage = string | Error;

type LogRecord = {
    timestamp: string;
    level: LEVELS;
    message: string;
    name?: string;
    stack?: string;
};

const getTimestamp = (): string => {
    return new Date().toISOString();
};

const normalizeFromError = (err: Error): Pick<LogRecord, "message" | "name" | "stack"> => {
    const message =
        err.message.trim().length > 0
            ? err.message
            : err.name !== "" && err.name !== "Error"
              ? err.name
              : "Error";

    const out: Pick<LogRecord, "message" | "name" | "stack"> = {
        message,
        name: err.name,
    };

    const stack = err.stack?.trim();
    if (stack !== undefined && stack.length > 0) {
        out.stack = stack;
    }

    return out;
};

const normalizeLogMessage = (input: LogMessage): Pick<LogRecord, "message" | "name" | "stack"> => {
    if (typeof input === "string") {
        return { message: input };
    }

    if (input instanceof Error) {
        return normalizeFromError(input);
    }

    return { message: String(input) };
};

const debug = (message: LogMessage) => {
    log("debug", message);
};

const info = (message: LogMessage) => {
    log("info", message);
};

const warn = (message: LogMessage) => {
    log("warn", message);
};

const error = (message: LogMessage) => {
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

const log = (level: LEVELS, message: LogMessage) => {
    if (level === "debug" && NODE_ENV === "production")
        return;

    const parts = normalizeLogMessage(message);

    const record: LogRecord = {
        timestamp: getTimestamp(),
        level,
        message: parts.message,
    };

    if (parts.name !== undefined) {
        record.name = parts.name;
    }
    if (parts.stack !== undefined) {
        record.stack = parts.stack;
    }

    writeLine(level, JSON.stringify(record));
};

export default {
    debug,
    info,
    warn,
    error,
    log,
};

export type { LEVELS, LogMessage };

// modules
import { createServer } from "node:http";
import type { IncomingMessage, ServerResponse } from "node:http";
import logger from "./utilities/logger.ts";

// variables
const hostname: string = process.env.HOSTNAME || "localhost";
const port: number = Number(process.env.PORT) || 3000;

type SIGNAL = "SIGTERM" | "SIGINT";

const server = createServer();

// helper functions
const inspectRequest = (request: IncomingMessage) => {
    const { method, url, headers } = request;
    logger.debug(`${method}, ${url}, ${headers["user-agent"]}`);
};

const gracefulShutdown = (signal: SIGNAL) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    
    server.close(() => {
        logger.info("Server closed, exisiting process.");
        process.exit(0); // exit once all connections are closed
    });

    // closes all connections, ensuring the server closes successfully
    server.closeAllConnections();

    // force close if cleanup takes too long
    setTimeout(() => {
        logger.error("Forcing shutdown after 10s timeout.");
        process.exit(1);
    }, 10000);
};

//listener
server.on("request", (request: IncomingMessage, response: ServerResponse) => {

    // handle request body
    const rawBody: Buffer[] = [];

    request.on("error", (err: Error) => {
        logger.error(err.message);

    }).on("data", (chunk: Buffer) => {
        rawBody.push(chunk);

    }).on("end", () => {
        const body = Buffer.concat(rawBody).toString();
        // now that the body has arrived and the rest of request info is available then it can be processed.

        response.on("error", (err: Error) => {
            logger.error(err.message);
        });

        inspectRequest(request);

        response.statusCode = 200;
        response.setHeader("Content-Type", "text/html");
        response.end("<html><body><h1>Hello, World!</h1></body></html>");
    });
});

server.listen(port, hostname, () => {
    logger.info(`Server running at http://${hostname}:${port}/`);
});

// list for termination signals
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

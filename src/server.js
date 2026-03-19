// modules
const http = require("node:http");
const logger = require("./utilities/logger");

// variables
const hostname = process.env.HOSTNAME || "localhost";
const port = process.env.PORT || 3000;

const server = http.createServer();

// helper functions
const inspectRequest = (request) => {
    const { method, url, headers } = request;
    logger.debug(`${method}, ${url}, ${headers["user-agent"]}`);
};

const gracefulShutdown = signal => {
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
server.on("request", (request, response) => {
    
    // handle request body
    let body = [];
    request.on("error", err => {
        logger.error(err);
    }).on("data", chunck => {
        body.push(chunck);
    }).on("end", () => {
        body = Buffer.concat(body).toString();
        // now that the body has arrived and the rest of request info is available then it can be processed.

        response.on("error", err => {
            logger.error(err);
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

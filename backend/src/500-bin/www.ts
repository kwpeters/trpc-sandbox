#!/usr/bin/env node

import * as http from "http";
import { app } from "../400-app/app";
import { ISystemError } from "../100-lib/depot/nodeTypes";
import { logger } from "../200-util/logger";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { trpcRouter } from "../400-app/routes/trpcRoot";
import ws from "ws";


/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

applyWSSHandler(
    {
        wss:           new ws.Server({server}),
        router:        trpcRouter,
        // Note:  When using websockets, you don't have the normal request and
        // response parameters.
        createContext: () => {
            return { isAdmin: true };
        }
    }
);


/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: ISystemError) {
    if (error.syscall !== "listen") {
        throw error;
    }

    const bind = typeof port === "string"
        ? "Pipe " + port
        : "Port " + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            logger.error(bind + " requires elevated privileges");
            process.exit(1);
            break;
        case "EADDRINUSE":
            logger.error(bind + " is already in use");
            process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
    logger.info(`Listening on ${bind}`);
}

import * as path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors, {CorsOptions} from "cors";
import { router as indexRouter } from "./routes/index";
import { router as usersRouter } from "./routes/users";
import { morganMiddleware } from "./morganMiddleware";
import { middleware as trpcMiddleware } from "./routes/trpcRoot";

export const app = express();


const __whitelist = ["http://example1.com", "http://example2.com"];

const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        // For now, allow everything.
        callback(null, true);

        // // Don't block REST tools or server-to-server requests.
        // const allow = !origin;
        //
        // if (allow || whitelist.includes(origin)) {
        //     callback(null, true);
        // }
        // else {
        //     callback(new Error("Not allowed by CORS"));
        // }
    },
    credentials: true
};
const corsMiddleware = cors(corsOptions);

// CORS must be configured first.

// To allow pre-flight requests associated with "complex" (DELETE requests and
// requests with custom headers), add an OPTIONS handler to all routes.
app.options("*", corsMiddleware);
app.use(corsMiddleware);

app.use(morganMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../assets")));

app.use("/", indexRouter);
app.use("/users", usersRouter);


app.use("/trpc", trpcMiddleware);

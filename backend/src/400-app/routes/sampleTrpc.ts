import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { trpc } from "../trpc";

const trpcRouter = trpc.router(
    {
        sayHi:       trpc.procedure.query((_req) => "Hi"),
        logToServer: trpc.procedure.input((v) => {
            if (typeof v === "string") {
                return v;
            }

            throw new Error("Invalid input.  Expected string.");
        })
        .mutation((req) => {
            const text = req.input;
            console.log(`client says: ${text}`);
            return true;
        }),

        // Can nest routers within this one by adding additional entries where
        // the key is the path the router will be attached under.
    }
);


export const middleware = createExpressMiddleware({ router: trpcRouter });

export type TrpcRouter = typeof trpcRouter;

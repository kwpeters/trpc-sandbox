import { initTRPC } from "@trpc/server";
import { createExpressMiddleware } from "@trpc/server/adapters/express";

const t = initTRPC.create();

const trpcRouter = t.router({
    sayHi:       t.procedure.query((_req) => "Hi"),
    logToServer: t.procedure.input((v) => {
        if (typeof v === "string") {
            return v;
        }

        throw new Error("Invalid input.  Expected string.");
    })
    .mutation((req) => {
        const text = req.input;
        console.log(`client says: ${text}`);
        return true;
    })
});


export const middleware = createExpressMiddleware({ router: trpcRouter });

export type TrpcRouter = typeof trpcRouter;

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { adminProcedure, trpc } from "../trpc";
import { createContext } from "../context";
import { userRouter } from "./trpcUser";


export const trpcRouter = trpc.router(
    {
        sayHi:       trpc.procedure.query((_req) => "Hi"),
        logToServer: trpc.procedure.input((v) => {
            // An example of a custom validation.  Typically, this would be done
            // with the Zod validation library.
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
        secretData: adminProcedure.query(({ctx}) => {
            // Because _adminProcedure_ middleware was specified for this
            // endpoint, the context will have a _user_ property.
            console.log(`${ctx.user}`);
            return "Super top secret admin data";
        }),
        // Nest the tRPC user router at the path "/users/...".
        users: userRouter
    }
);

export const middleware = createExpressMiddleware(
    {
        router:        trpcRouter,
        createContext
    }
);
export type TrpcRouter = typeof trpcRouter;

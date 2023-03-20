import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { trpc } from "../trpc";
import { userRouter } from "./trpcUser";

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

        // Nest the tRPC user router at the path "/users/...".
        users: userRouter
    }
);

export const middleware = createExpressMiddleware({ router: trpcRouter });
export type TrpcRouter = typeof trpcRouter;

import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";
import { createContext } from "./context";

/**
 * The one and only instance of TRPC for this backend.
 */
export const trpc =
    initTRPC
    .context<inferAsyncReturnType<typeof createContext>>()
    .create();

export type Trpc = typeof trpc;


////////////////////////////////////////////////////////////////////////////////
// Admin middleware
////////////////////////////////////////////////////////////////////////////////

const isAdminMiddleware = trpc.middleware(({ctx, next}) => {
    if (!ctx.isAdmin) {
        throw new TRPCError({code: "UNAUTHORIZED"});
    }
    // Pass the next middleware layer a modified version of ctx.
    return next({ctx: {user: {id: 1}}});
});

export const adminProcedure = trpc.procedure.use(isAdminMiddleware);

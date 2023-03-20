import { CreateExpressContextOptions } from "@trpc/server/adapters/express";


export function createContext(
    { req, res }: CreateExpressContextOptions
): { isAdmin: boolean} {
    // Normally you would build the returned object form info in the _req_
    // object.
    return {
        isAdmin: true
    };
}

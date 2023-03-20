import { trpc } from "../trpc";
import { z } from "zod";


export interface IUser {
    id: string,
    name?: string
}


// A procedure that always accepts an object containing a _userId_ property of type string.
const userProcedure = trpc.procedure.input(
    z.object({ userId: z.string()})
);

// A tRPC router for users.
// Not to be confused with the Express users router.
export const userRouter = trpc.router(
    {
        get: userProcedure.query(({input}): IUser => {
            return {
                id:   input.userId
            };
        }),
        update:
            userProcedure
            // This input object is *merged* with the existing input object
            // defined by userProcedure.
            .input(z.object({name: z.string()}))
            // Defining the output type is optional, because TS can usually
            // infer it. If the object returned from this function has
            // additional properties, they will be removed before sending the
            // response over the wire.  This is done to make sure you are not
            // exposing something you shouldn't be.
            .output(z.object({name: z.string(), id: z.string()}))
            .mutation((req) => {
                console.log(`req.ctx = ${req.ctx}`);
                console.log(`Updating user ${req.input.userId} to have the name ${req.input.name}`);
                return {id: req.input.userId, name: req.input.name};
            })
    }
);

export type UserRouter = typeof userRouter;

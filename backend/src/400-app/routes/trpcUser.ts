import { trpc } from "../trpc";


export interface IUser {
    id: number,
    name: string
}

// A tRPC router for users.
// Not to be confused with the Express users router.
export const userRouter = trpc.router(
    {
        getUser: trpc.procedure.query((_req): IUser => {
            return {
                id:   1,
                name: "Kyle"
            };
        })
    }
);

export type UserRouter = typeof userRouter;

import { initTRPC } from "@trpc/server";

export type Trpc = ReturnType<typeof initTRPC.create>;

/**
 * The one and only instance of TRPC for this backend.
 */
export const trpc: Trpc = initTRPC.create();

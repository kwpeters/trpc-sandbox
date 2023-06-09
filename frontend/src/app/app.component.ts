import { Component } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink, loggerLink, createWSClient, wsLink, splitLink } from "@trpc/client";

// Import the *types* from the backend.
import type { TrpcRouter } from "../../../backend/src/400-app/routes/trpcRoot";
import type { IUser } from '../../../backend/src/400-app/routes/trpcUser';


@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'trpc-sandbox-frontend';

    public queryResult: string | undefined;
    public mutationRetVal: boolean | undefined;
    public user: IUser | undefined;
    public updatedUser: IUser | undefined;
    public secretData: string | undefined;


    public constructor() {
        this.queryResult = "message not initialized"
    }


    public async ngOnInit(): Promise<void> {

        const wsClient = createWSClient({ url: "ws://localhost:3000/trpc" });

        const client = createTRPCProxyClient<TrpcRouter>({
            // Links are a lot like Express middleware in that they are invoked
            // sequentially until an ending link (that sends the request) is
            // encountered.
            links: [
                loggerLink(),
                // HTTP-only link
                // // httpLink() will only send one request to the server at a
                // // time.
                // httpBatchLink({
                //     url: "http://localhost:3000/trpc",
                //     headers: {Authorization: "TOKEN"}
                // }),

                // Websocket-only link
                // // wsLink(
                // //     {
                // //         client: createWSClient({url: "ws://localhost:3000/trpc"})
                // //     }
                // // ),

                // When using both HTTP and websocket servers.
                splitLink(
                    {
                        condition: (op) => op.type === "subscription",
                        true: wsLink(
                            {
                                client: wsClient
                            }
                        ),
                        false: httpBatchLink(
                            {
                                url: "http://localhost:3000/trpc",
                                headers: {Authorization: "TOKEN"}
                            }
                        ),
                    }
                )

            ]
        });

        // Calling the server's query procedure.
        this.queryResult = await client.sayHi.query();

        // Calling the server's mutate procedure.
        this.mutationRetVal = await client.logToServer.mutate("Hello from the frontend");

        // An example of calling a procedure on a nested router.
        this.user = await client.users.get.query({userId: "123"});

        // An example of using a Zod type as input.
        this.updatedUser = await client.users.update.mutate({userId: "1234", name: "Ryan"});

        this.secretData = await client.secretData.query();

        // Subscribe to the websocket.
        const connection = client.users.onUpdate.subscribe(
            undefined,   // Nothing to pass in
            {
                onData: (id) => {
                    // This code will be invoked whenever the server publishes a
                    // new value to the subscription.  This can be in response
                    // to other users' actions.
                    console.log(`subscription onData() -> ${id}`);
                }
            }
        );

        // When done listening for these events, do:
        connection.unsubscribe();
        // ... or, to close everything down:
        // close();

    }
}

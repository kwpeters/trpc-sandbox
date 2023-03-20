import { Component } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { TrpcRouter } from "../../../backend/src/400-app/routes/trpcRoot";
import { IUser } from '../../../backend/src/400-app/routes/trpcUser';

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


    public constructor() {
        this.queryResult = "message not initialized"
    }


    public async ngOnInit(): Promise<void> {
        const client = createTRPCProxyClient<TrpcRouter>({
            links: [httpBatchLink({
                url: "http://localhost:3000/trpc"
            })]
        });

        // Calling the server's query procedure.
        this.queryResult = await client.sayHi.query();

        // Calling the server's mutate procedure.
        this.mutationRetVal = await client.logToServer.mutate("Hello from the frontend");

        // An example of calling a procedure on a nested router.
        this.user = await client.users.getUser.query();
    }
}

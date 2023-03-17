import { Component } from '@angular/core';
import { createTRPCProxyClient, httpBatchLink } from "@trpc/client";
import { TrpcRouter } from "../../../backend/src/400-app/routes/sampleTrpc";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = 'trpc-sandbox-frontend';

    public message: string | undefined;

    public constructor() {
        this.message = "message not initialized"
    }


    public async ngOnInit(): Promise<void> {
        const client = createTRPCProxyClient<TrpcRouter>({
            links: [httpBatchLink({
                url: "http://localhost:3000/trpc"
            })]
        });

        this.message = await client.sayHi.query();

        await client.logToServer.mutate("Hello from the frontend");
    }

}

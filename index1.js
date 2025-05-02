// Connecting using both everscale-standalone-client/nodejs &  everscale-inpage-provider ,
//  but facing connection issues while connecting.
//Error :verscale provider was not found at ProviderRpcClient.ensureInitialized

import { Address, ProviderRpcClient, TvmException } from 'everscale-inpage-provider';
import { EverscaleStandaloneClient } from 'everscale-standalone-client/nodejs.js';

const client = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: {
                id: 1,
                group: "mainnet",
                type: "jrpc",
                data: {
                    endpoint: "https://jrpc.venom.foundation/rpc",
                },
            },
        }),
});

console.log(client);

async function main() {
    await client.ensureInitialized();
}

main();
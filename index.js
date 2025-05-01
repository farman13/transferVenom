import { ProviderRpcClient, Address } from "everscale-inpage-provider"
import { EverscaleStandaloneClient, SimpleAccountsStorage } from "everscale-standalone-client";

const ADMIN_ADDRESS = '0:7c4db728ec21c6719b83997a6c84c889780d6e7fdfb57bdbcda42fc2186a1ea0'
const ADMIN_PRIVATE_KEY = 'da3e3ce8c4ede283b0b7344834cc72d95096ff192d686e8cf33e551bfc9f43f3'

const WALLET_ABI = {
    'ABI version': 2,
    'version': '2.3',
    'header': ['pubkey', 'time', 'expire'],
    'functions': [
        {
            'name': 'sendTransaction',
            'inputs': [
                { 'name': 'dest', 'type': 'address' },
                { 'name': 'value', 'type': 'uint128' },
                { 'name': 'bounce', 'type': 'bool' },
                { 'name': 'flags', 'type': 'uint8' },
                { 'name': 'payload', 'type': 'cell' }
            ],
            'outputs': []
        }
    ],
    'events': []
};

const client = new ProviderRpcClient({
    fallback: () =>
        EverscaleStandaloneClient.create({
            connection: {
                id: 1,
                type: 'jrpc',
                group: 'mainnet',
                data: {
                    endpoint: 'https://jrpc.venom.foundation/rpc',
                },
            },
        }),
});


console.log("client:", client)

const TransferVenom = async (receiver, amount) => {

    try {
        console.log("1")
        await client.ensureInitialized();
        console.log("2")

        const currentProvider = await client.getProviderState();

        console.log('Current provider state:', currentProvider);

        const accountStorage = new SimpleAccountsStorage();

        accountStorage.addAccount({
            address: ADMIN_ADDRESS,
            publickey: '',
            privatekey: ADMIN_PRIVATE_KEY
        })

        await client.changeAccount(accountStorage);

        await client.ensureInitialized();

        const contract = new client.Contract(WALLET_ABI, new Address(ADMIN_ADDRESS));

        const nanoAmount = BigInt(Math.floor(amount * 1e9));

        console.log(`Transferring ${amount} VENOM from ${ADMIN_ADDRESS} to ${receiver}...`);

        const params = {
            dest: new Address(receiver),
            value: nanoAmount.toString(),
            bounce: false,
            flags: 3, // Regular message transfer flag
            payload: '', // Empty payload for simple transfer
        }

        const transaction = await contract.methods.sendTransaction(params).sendExternal({
            publicKey: await accountStorage.getAccount(ADMIN_ADDRESS).publicKey
        })

        console.log('Transaction successful:', transaction);
    }
    catch (err) {
        console.log("Error in transfering", err)
    }
}

TransferVenom('0:fb444f39cdab4f7d7fc71a0464a7be7c64e883c35d470606677bec7348acd817', 0.0001);
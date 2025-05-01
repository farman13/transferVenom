// Connecting using just everscale-standalone-client/nodejs.js
// Got Error bcoz using Contract from everscale-inpage-provider which underthe hood check for this.provider.ensureInitialized
// while sending transaction.

import pkg from 'everscale-standalone-client/nodejs.js';
const { EverscaleStandaloneClient } = pkg;

import { Contract, Address } from 'everscale-inpage-provider';

const WalletAbi = {
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

const adminKeys = {
    publicKey: "0b8522e08acd66b0f32787d3b837bd836f2df8316042d3cdee037d8d09309282",
    secretKey: "da3e3ce8c4ede283b0b7344834cc72d95096ff192d686e8cf33e551bfc9f43f3"
};


async function main() {

    const ever = await EverscaleStandaloneClient.create({
        connection: {
            id: 1,
            group: "mainnet",
            type: "jrpc",
            data: {
                endpoint: "https://jrpc.venom.foundation/rpc",
            },
        },
    });

    console.log(ever);

    const walletAddress = new Address('0:7c4db728ec21c6719b83997a6c84c889780d6e7fdfb57bdbcda42fc2186a1ea0'); // Replace with actual deployed wallet address


    const nanoAmount = BigInt(Math.floor(.001 * 1e9));

    const params = {
        dest: new Address('0:fb444f39cdab4f7d7fc71a0464a7be7c64e883c35d470606677bec7348acd817'),
        value: nanoAmount.toString(),
        bounce: false,
        flags: 3,
        payload: '',
    };

    console.log(params);


    const walletContract = new Contract(ever, WalletAbi, walletAddress);
    console.log("Wallet contract is ready:", walletContract.abi.toString());
    try {
        // Send transaction (GIves Error here!!!!!!!!!!!!!!!!!!!!!!!!!!!!)
        const transaction = await walletContract.methods.sendTransaction(params).send({
            from: walletAddress, // Sender's wallet address
            amount: nanoAmount.toString(), // Amount of VENOM to cover transaction costs
            signer: { keys: { publicKey: adminKeys.publicKey, secretKey: adminKeys.secretKey } }, // Replace with actual signing keys
        });

        console.log('Transaction sent:', transaction);
    } catch (error) {
        console.error('Error sending transaction:', error);
    }

}

main().catch(console.error);
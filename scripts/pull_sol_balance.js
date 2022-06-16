const { PublicKey, clusterApiUrl, Connection } = require("@solana/web3.js");
const { getTwitterActiveUser, saveTwitterActiveUserBalance } = require('./utils/utils');

// Sleep func
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    let connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    users = getTwitterActiveUser()
    console.log(`User length: ${Object.keys(users).length}`);

    for (var address in users) {
        let balance;
        try {
            balance = await connection.getBalance(new PublicKey(address));
        } catch (error) {
            console.log(`<${address}> balance inquiry failed, error is ${error}`);
            balance = 0
        }
        console.log(`${address}'s balance is ${balance}`);
        saveTwitterActiveUserBalance(address, balance);

        await sleep(500)
    }

    // Object.keys(users).forEach(async address => {
    //     let balance = await connection.getBalance(new PublicKey(address));
    //     await saveTwitterActiveUserBalance(address, balance);
    // })

    console.log("over");
})();

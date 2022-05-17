const { PublicKey, clusterApiUrl, Connection } = require("@solana/web3.js");

(async () => {
    let connection = new Connection(clusterApiUrl('mainnet-beta'), 'confirmed');
    console.log(await connection.getBalance(new PublicKey("4D4Tbb69WnUSD6X1SD9vApvWoN58EznViuFVhbeBQuex")));
})();

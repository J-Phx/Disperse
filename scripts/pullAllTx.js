const hre = require("hardhat");
// const {} = require()
const { saveBscStakeAllTx } = require('./utils/utils');


const STARTBLOCKNUMBER = 16741283;
const ENDBLOCKNUMBER = 19463009;
const CONTRACTADDRESS = "0x9eBBEB7f6b842377714EAdD987CaA4510205107A";
const ABI = [{ "inputs": [{ "internalType": "string", "name": "name_", "type": "string" }, { "internalType": "string", "name": "symbol_", "type": "string" }, { "internalType": "uint256", "name": "totalSupply_", "type": "uint256" }, { "internalType": "uint8", "name": "decimals_", "type": "uint8" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "spender", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "spender", "type": "address" }], "name": "allowance", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "account", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "burn", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "decimals", "outputs": [{ "internalType": "uint8", "name": "", "type": "uint8" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "subtractedValue", "type": "uint256" }], "name": "decreaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "spender", "type": "address" }, { "internalType": "uint256", "name": "addedValue", "type": "uint256" }], "name": "increaseAllowance", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "sender", "type": "address" }, { "internalType": "address", "name": "recipient", "type": "address" }, { "internalType": "uint256", "name": "amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "nonpayable", "type": "function" }]

const FROM_ADDRESS = "0x24e1Ae757ca647101B0e7614217b7AE26338F578";

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const latestBlk = async () => { return await hre.ethers.provider.getBlockNumber() }
async function main() {

    const stake_contract = await hre.ethers.getContractAt(ABI, CONTRACTADDRESS);
    const eventFilter = stake_contract.filters.Transfer()


    // var currentBlk = STARTBLOCKNUMBER;

    while (true) {
        let last = await latestBlk()
        // await sleep(1000)
        console.log(`lastest block is: ${last}`)

        // console.log(`current start block number is ${currentBlk}`);

        // let currentBlk = Math.min(currentBlk, last);
        let second = STARTBLOCKNUMBER + 4000
        let logs = await stake_contract.queryFilter(eventFilter, STARTBLOCKNUMBER, second)
        let logs2 = await stake_contract.queryFilter(eventFilter, second + 1, last)
        // console.log(`log length ${logs.length}`);
        // processing one block log
        var count = 0;
        for (let j = 0; j < logs.length; j++) {
            tx = logs[j];
            // console.log(tx);
            // const txHash = tx.transactionHash;
            // const txBlockBumer = tx.blockNumber;
            const txFrom = tx.args[0];
            // const txTo = tx.args[1];
            // const txAmount = tx.args[2].toString();
            // const txData = {"blockNumber": txBlockBumer, "from": txFrom, "to": txTo, "amount": txAmount};
            // console.log(txData);
            // saveBscStakeAllTx(txHash, txData);
            if (txFrom === FROM_ADDRESS) {
                count += 1;
            }
        }
        for (let j = 0; j < logs2.length; j++) {
            tx = logs2[j];
            // console.log(tx);
            // const txHash = tx.transactionHash;
            // const txBlockBumer = tx.blockNumber;
            const txFrom = tx.args[0];
            // const txTo = tx.args[1];
            // const txAmount = tx.args[2].toString();
            // const txData = {"blockNumber": txBlockBumer, "from": txFrom, "to": txTo, "amount": txAmount};
            // console.log(txData);
            // saveBscStakeAllTx(txHash, txData);
            if (txFrom === FROM_ADDRESS) {
                count += 1;
            }
        }
        console.log(`The current number of verified transactions is ${count}`);
        console.log('----------------------------------------------------')
        await sleep(10000)
    }


    console.log(`All transactions have been pulled, for a total of ${count} items.`);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

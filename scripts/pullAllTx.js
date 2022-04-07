const hre = require("hardhat");
// const {} = require()
const {saveBscStakeAllTx} = require('./utils/utils');


const STARTBLOCKNUMBER = 10462479;
const ENDBLOCKNUMBER = 10463009;
const CONTRACTADDRESS = "0x85fDfa14D4D1284Bc26FEe8278755258db1Ab03A";
const ABI = [{"type":"constructor","stateMutability":"nonpayable","inputs":[{"type":"string","name":"name_","internalType":"string"},{"type":"string","name":"symbol_","internalType":"string"},{"type":"uint256","name":"totalSupply_","internalType":"uint256"},{"type":"uint8","name":"decimals_","internalType":"uint8"}]},{"type":"event","name":"Approval","inputs":[{"type":"address","name":"owner","internalType":"address","indexed":true},{"type":"address","name":"spender","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"event","name":"Transfer","inputs":[{"type":"address","name":"from","internalType":"address","indexed":true},{"type":"address","name":"to","internalType":"address","indexed":true},{"type":"uint256","name":"value","internalType":"uint256","indexed":false}],"anonymous":false},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"allowance","inputs":[{"type":"address","name":"owner","internalType":"address"},{"type":"address","name":"spender","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"approve","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"balanceOf","inputs":[{"type":"address","name":"account","internalType":"address"}]},{"type":"function","stateMutability":"nonpayable","outputs":[],"name":"burn","inputs":[{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint8","name":"","internalType":"uint8"}],"name":"decimals","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"decreaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"subtractedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"increaseAllowance","inputs":[{"type":"address","name":"spender","internalType":"address"},{"type":"uint256","name":"addedValue","internalType":"uint256"}]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"name","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"string","name":"","internalType":"string"}],"name":"symbol","inputs":[]},{"type":"function","stateMutability":"view","outputs":[{"type":"uint256","name":"","internalType":"uint256"}],"name":"totalSupply","inputs":[]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transfer","inputs":[{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]},{"type":"function","stateMutability":"nonpayable","outputs":[{"type":"bool","name":"","internalType":"bool"}],"name":"transferFrom","inputs":[{"type":"address","name":"sender","internalType":"address"},{"type":"address","name":"recipient","internalType":"address"},{"type":"uint256","name":"amount","internalType":"uint256"}]}]


async function main() {

    const stake_contract = await hre.ethers.getContractAt(ABI, CONTRACTADDRESS);
    const eventFilter = stake_contract.filters.Transfer()


    let count;

    for(let i = STARTBLOCKNUMBER; i <= ENDBLOCKNUMBER; i++) {
        console.log(`current start block number is ${i}`);
        // const _startBlock = i;
        // const _endBlock = Math.min(ENDBLOCKNUMBER, i + 1);
        const logs = await stake_contract.queryFilter(eventFilter, i, i+1)
        console.log(`log length ${logs.length}`);
        for(let j = 0; j < logs.length; j++) {
            tx = logs[j];
            console.log(tx);
            const txHash = tx.transactionHash;
            const txBlockBumer = tx.blockNumber;
            const txFrom = tx.args[0];
            const txAmount = tx.args[1].toString();
            const txData = {"blockNumber": txBlockBumer, "from": txFrom, "amount": txAmount};
            console.log(txData);
            saveBscStakeAllTx(txHash, txData);
            count ++;
        }
    }

    console.log(`All transactions have been pulled, for a total of ${count} items.`);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

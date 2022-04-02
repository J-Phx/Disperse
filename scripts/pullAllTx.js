const hre = require("hardhat");
// const {} = require()
const {saveBscStakeAllTx} = require('./utils/utils');


const STARTBLOCKNUMBER = 16502264;
const ENDBLOCKNUMBER = 16566892;
const CONTRACTADDRESS = "0x6c62593B4DEd894318563e5b965a70158a38B9D9";
const ABI = [{"inputs":[{"internalType":"address","name":"_bep20Token","type":"address"},{"internalType":"uint256","name":"_startBlockNumber","type":"uint256"},{"internalType":"uint256","name":"_endBlockNumber","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BEP20Token","outputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getBep20Balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEndBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"limitAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setLimitAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blockNumberOfShift","type":"uint256"}],"name":"shiftEndBlockNumber","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"isStaked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"userStakeState","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]


async function main() {

    const stake_contract = await hre.ethers.getContractAt(ABI, CONTRACTADDRESS);
    const eventFilter = stake_contract.filters.Deposit()


    let count;

    for(let i = STARTBLOCKNUMBER; i <= ENDBLOCKNUMBER; i += 2000) {
        console.log(`current start block number is ${i}`);
        const _startBlock = i;
        const _endBlock = Math.min(ENDBLOCKNUMBER, i + 1999);
        const logs = await stake_contract.queryFilter(eventFilter, _startBlock, _endBlock)
        for(let j = 0; j < logs.length; j++) {
            tx = logs[j];
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

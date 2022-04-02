const hre = require("hardhat");
const {saveBscStakeAllTx} = require('./utils/utils');

const STARTBLOCKNUMBER = 16550108;
const ENDBLOCKNUMBER = 16550108;
const CONTRACTADDRESS = "0x6c62593b4ded894318563e5b965a70158a38b9d9".toLowerCase();
const ABI = [{"inputs":[{"internalType":"address","name":"_bep20Token","type":"address"},{"internalType":"uint256","name":"_startBlockNumber","type":"uint256"},{"internalType":"uint256","name":"_endBlockNumber","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Withdraw","type":"event"},{"inputs":[],"name":"BEP20Token","outputs":[{"internalType":"contract IBEP20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"endBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"getBep20Balance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getEndBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"limitAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"setLimitAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_blockNumberOfShift","type":"uint256"}],"name":"shiftEndBlockNumber","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"startBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"userInfo","outputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"bool","name":"isStaked","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"userStakeState","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_to","type":"address"},{"internalType":"uint256","name":"_amount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"}]


async function main() {

    const stake_contract = await hre.ethers.getContractAt(ABI, CONTRACTADDRESS);
    let count;

    for(let i = STARTBLOCKNUMBER; i <= ENDBLOCKNUMBER; i++) {
        console.log(`current block number is ${i}`);
        const block = await hre.ethers.provider.getBlockWithTransactions(i);
        const txs = block.transactions;
        for(let j = 0; j < txs.length; j++) {
            tx = txs[j];
            console.log(`current tx is ${tx.hash}`);
            if(tx.to && tx.to.toLowerCase() == CONTRACTADDRESS && tx.data.substring(0, 10) == "0xb6b55f25") {
                console.log(`tx.from is ${tx.from}`);
                const userInfo = await stake_contract.userInfo(tx.from);
                if (userInfo.isStaked == true) {
                    const amount = userInfo.amount.toString()
                    console.log(`${tx.from} is staked, amount is ${amount}`);
                    saveBscStakeAllTx(tx.from, amount);
                    count ++;
                }
            }
        }
    }

    console.log(`All transactions have been pulled, for a total of ${count} items.`);


    // tx = await hre.ethers.provider.getTransaction("0x3b8d16e71bf07f9678c7d0b8dbfd3270ac430e545fd8ed52c8d2e95364e7514c");
    // console.log(`Create contract`);
    // console.log(tx);
    // tx = await hre.ethers.provider.getTransaction("0x6a01150332a57548f3ee2ae42d3bb3d93a29734de4b5de80cfdc022f21205c29");
    // console.log(`Transfer ownership`);
    // console.log(tx);
    // tx = await hre.ethers.provider.getTransaction("0xb44bc0a37b1530c9a0642ea676156360756bb3204d71dbd21fa545842654600a");
    // console.log(`Successful tx`);
    // console.log(tx);
    // isStaked = await stake_contract.userInfo(tx.from);
    // console.log(isStaked);
    // console.log(isStaked.amount.toString());
    // console.log(isStaked.isStaked);

    // tx = await hre.ethers.provider.getTransaction("0x9e19b31b7d7f680597f6f99b444c1151ad2c2a1ae665cdef3372c66dae8da272");
    // // console.log(`Failed tx`);
    // // console.log(tx);
    // isStaked = await stake_contract.userInfo("0xF5345F580D2933dB36Fa957bC5d7ce5bF7626370");
    // console.log(isStaked);
    
    // receipt = await hre.ethers.provider.getTransactionReceipt("0x9e19b31b7d7f680597f6f99b444c1151ad2c2a1ae665cdef3372c66dae8da272");
    // console.log(`Failed tx`);
    // console.log(receipt);
    // receipt = await hre.ethers.provider.getTransactionReceipt("0x9e19b31b7d7f680597f6f99b444c1151ad2c2a1ae665cdef3372c66dae8da272");
    // console.log(`Successful tx`);
    // console.log(receipt);
    
    
    // const start_block = await hre.ethers.provider.getBlockWithTransactions(STARTBLOCKNUMBER);
    // console.log(start_block.transactions);

    
    // const start_block = await hre.ethers.provider.getBlock(STARTBLOCKNUMBER);
    // console.log(start_block.transactions);
    // const txs = start_block.transactions;

    // for (let i = 0; i < txs.length; i++) {
    //     tx = await hre.ethers.provider.getTransaction(txs[i]);
    //     console.log(tx);
    //     break;
    // }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

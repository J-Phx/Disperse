const hre = require("hardhat");
const {saveStakeConfig} = require("./utils/utils")
const config = require('./configs/StakeConfig.json')

async function main() {
    const c = config[hre.network.name]
    const usdt_address = c.usdt_address;
    const start_timestamp = c.start_timestamp;
    const end_timestamp = c.end_timestamp;
    var current_blockNum;
    await hre.ethers.provider.getBlockNumber().then((blockNumber) => {
        current_blockNum = blockNumber
        console.log(`current block number is ${current_blockNum}`);
    });
    
    const current_block = await hre.ethers.provider.getBlock(current_blockNum);
    const current_blockNum_time = current_block.timestamp;
    console.log(`current block number's timestamp is ${current_blockNum_time}`);

    const current_timestamp = new Date().getTime();
    console.log(`current timestamp is ${current_timestamp}`);
    
    const start_blockNum = current_blockNum + parseInt((start_timestamp - current_blockNum_time) / 3);
    console.log(`start block number is ${start_blockNum}`);
    saveStakeConfig(hre.network.name, "start_blockNum", start_blockNum);
    const end_blockNum = start_blockNum + parseInt((end_timestamp - start_timestamp) / 3);
    console.log(`end block number is ${end_blockNum}`);
    saveStakeConfig(hre.network.name, "end_blockNum", end_blockNum);

    if(start_blockNum <= 0) {console.log("The start time must be greater than 0."); return}
    if(end_blockNum <= start_blockNum) {console.log("The end time must be greater than the start time."); return}

    const Stake = await hre.ethers.getContractFactory("BEP20Staking");
    const stake_contract = await Stake.deploy(usdt_address, start_blockNum, end_blockNum);
    await stake_contract.deployed();
    console.log("BusdStaking deployed to: ", stake_contract.address);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

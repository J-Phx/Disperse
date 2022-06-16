const hre = require("hardhat");
const config = require('../configs/StakeConfig.json');

const c = config[hre.network.name]
const usdt_address = c.usdt_address;
const start_blockNum = c.start_blockNum;
const end_blockNum = c.end_blockNum;

module.exports = [
    usdt_address,
    start_blockNum,
    end_blockNum,
];


// npx hardhat verify --network bsc_testnet --constructor-args .\scripts\verify\stakeArguments.js 0x0C313C51e757FDD574923FaADCDa1E1d1E060651
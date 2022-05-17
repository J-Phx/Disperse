const hre = require("hardhat");
const yesno = require('yesno');
const { getLPTStakeAddresses, saveDepositedUser } = require('./utils/utils');
const config = require('./configs/PullTxConfig.json');


const ABI = [{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_pid",
            "type": "uint256"
        },
        {
            "internalType": "address",
            "name": "_user",
            "type": "address"
        }
    ],
    "name": "deposited",
    "outputs": [
        {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
        }
    ],
    "stateMutability": "view",
    "type": "function"
}]

async function main() {

    const network = hre.network.name;
    const c = config[network];
    let lp_price = c.lp_price;
    let staked_address_infos = getLPTStakeAddresses()[network] || {};
    let staked_addresses = staked_address_infos['addresses'] || [];
    const CONTRACTADDRESS = c.contract_address;
    console.log(staked_addresses.length, CONTRACTADDRESS);

    // DEBUG
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }

    const lp_contract = await hre.ethers.getContractAt(c.lp_abi, c.lp_address);
    const decimals = await lp_contract.decimals();
    console.log(`LP address is ${lp_contract.address}, decimals is <${decimals}>`);
    const stake_contract = await hre.ethers.getContractAt(ABI, CONTRACTADDRESS);

    let staked_infos = new Object();
    for (let i = 0; i < staked_addresses.length; i++) {
        let address = staked_addresses[i];
        let amount = await stake_contract.deposited(2, address);
        amount = hre.ethers.utils.formatUnits(amount, decimals);
        let value = parseFloat(amount) * lp_price;
        console.log(`${address} -> ${value}`);
        if (value > 0) {
            staked_infos[address] = value;
        }
    }

    saveDepositedUser(network, staked_infos);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

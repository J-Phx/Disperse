const hre = require("hardhat");
const {getSavedContractAddresses, getTestAddresses} = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json')

// Maximum number of transfers
const MAXNUMBEROFTX = 200;
// Amount of single transfer
const AMOUNTOFTX = hre.ethers.utils.parseEther("1");


async function main() {
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address)
    
    const addresses = getTestAddresses();
    var totalAmount = addresses.length * AMOUNTOFTX;
    await token_contract.approve(disperse_contract, totalAmount);
    console.log(`token address is ${token_contract.address}`);
    console.log(`token.approve(${disperse_contract.address}), amount is ${totalAmount}.`)
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }
    
    batch = parseInt(addresses.length / MAXNUMBEROFTX);
    for (let i = 0; i <= batch; i++) {
        addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
        len = addressesForEach.length;
        console.log(`address length:${len}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}`);
            // batch mint
            await disperse_contract.disperseTokenSimple(c.token_address, addressesForEach, AMOUNTOFTX);
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

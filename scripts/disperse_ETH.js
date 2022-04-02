const hre = require("hardhat");
const {getSavedContractAddresses, getIdoAddresses} = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json')

// Maximum number of transfers
const MAXNUMBEROFTX = 100;
// Amount of single transfer
const AMOUNTOFTX = 1;  // wei


async function main() {
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);
    
    const addresses = getIdoAddresses();
    
    batch = parseInt(addresses.length / MAXNUMBEROFTX);
    for (let i = 0; i <= batch; i++) {
        addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
        len = addressesForEach.length;
        var totalAmount = len * AMOUNTOFTX;
        console.log(`totalAmount:${totalAmount}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}`);
            // batch distribut
            await disperse_contract.disperseEther(addressesForEach, AMOUNTOFTX, {value: totalAmount});
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

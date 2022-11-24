const hre = require("hardhat");
const { ethers } = require("hardhat");
const { getSavedContractAddresses, getIdoAddresses } = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json')

// Maximum number of transfers
const MAXNUMBEROFTX = 100;
// Amount of single transfer
const AMOUNTOFTX = ethers.utils.parseEther("0.01");  // wei


async function main() {
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    console.log("Disperse contract address:", disperse_contract.address);
    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);

    const addresses = ['0xe521f55751503b73ab92184CD1Fa919647F0e4f3', '0x9446558F2852e58b763677Df52B236d9583ee05D', '0x3A3D823Be5b8B027dA404593a648901F274D9a10', '0x44Be49302c553F90602E8F30cD40280d3A4ceDec', '0x255b2EFf04A09FE54685034802FFfdb760875A3C'];

    batch = parseInt(addresses.length / MAXNUMBEROFTX);
    for (let i = 0; i <= batch; i++) {
        addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
        len = addressesForEach.length;
        var totalAmount = len * AMOUNTOFTX;
        console.log(`totalAmount:${totalAmount}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}`);
            // batch distribut
            await disperse_contract.disperseEther(addressesForEach, AMOUNTOFTX, { value: totalAmount });
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

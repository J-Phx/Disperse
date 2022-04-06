const hre = require("hardhat");
const {getSavedContractAddresses, getIdoAddressesFromDb, updateIdoAddressesToDb} = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json');

// Maximum number of transfers
const MAXNUMBEROFTX = 50;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));


async function main() {
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    console.log(`Disperse contract address is ${disperse_contract.address}`);
    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address)
    const decimals = await token_contract.decimals();
    const token_symbol = await token_contract.symbol();
    console.log(`The address of the token to be distributed is $${token_symbol}: ${token_contract.address}`);
    console.log(`The decimal of the token is ${decimals}`);

    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);
    
    const address_infos = await getIdoAddressesFromDb();
    let addresses = new Array();
    let amounts = new Array();
    let totalAmount = 0;
    for (let i = 0; i < address_infos.length; i++) {
        const address_info = address_infos[i];
        addresses.push(address_info.address);
        amounts.push(hre.ethers.utils.parseUnits(address_info.amount, decimals));
        totalAmount += parseFloat(address_info.amount);
    }

    if (addresses.length != amounts.length) {
        console.log("The parameter length is different.");
        return;
    }
    console.log(`Should be approve ${hre.ethers.utils.parseUnits(''+totalAmount, decimals)} to ${disperse_contract.address}`);
    await token_contract.approve(disperse_contract.address, hre.ethers.utils.parseUnits(''+totalAmount, decimals));
    console.log(`token.approve(${disperse_contract.address}), amount is ${totalAmount}.`);
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }
    
    var count = 0;
    const batch = parseInt(addresses.length / MAXNUMBEROFTX);
    for (let i = 0; i <= batch; i++) {
        addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
        amountsForEach = amounts.splice(0, MAXNUMBEROFTX);
        len = addressesForEach.length;
        if (len != amountsForEach.length) {
            console.log("The parameter length is different.");
            return;
        }
        console.log(`address length:${len}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}`);
            // batch distribut
            await disperse_contract.disperseToken(c.token_address, addressesForEach, amountsForEach);
            await updateIdoAddressesToDb(addressesForEach);

            console.log(`last address:${addressesForEach[len - 1]}, end time:${new Date()}`);
            count += addressesForEach.length;
            console.log(`The total number of addresses that have been transferred is ${count}`);
            await sleep(30000)
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const hre = require("hardhat");
const {getSavedContractAddresses, getAirdropAddresses} = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json');
const { util } = require("chai");
const { utils } = require("ethers");

// Maximum number of transfers
const MAXNUMBEROFTX = 100;


async function main() {
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address)
    console.log(`The address of the token to be distributed is ${token_contract.address}`);

    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);
    
    const address_infos = getAirdropAddresses();
    let addresses = new Array();
    let amounts = new Array();
    let totalAmount = 0;
    for (let i = 0; i < address_infos.length; i++) {
        const address_info = address_infos[i];
        addresses.push(address_info.address);
        amounts.push(hre.ethers.utils.parseEther(address_info.amount));
        totalAmount += parseFloat(address_info.amount);
    }

    if (addresses.length != amounts.length) {
        console.log("The parameter length is different.");
        return;
    }
    console.log(`Should be approve ${totalAmount} to ${disperse_contract.address}`);
    await token_contract.approve(disperse_contract.address, hre.ethers,utils.parseEther(totalAmount));
    console.log(`token address is ${token_contract.address}`);
    console.log(`token.approve(${disperse_contract.address}), amount is ${totalAmount}.`);
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }
    
    batch = parseInt(addresses.length / MAXNUMBEROFTX);
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
        }
    }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

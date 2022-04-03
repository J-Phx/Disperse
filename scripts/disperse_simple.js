const hre = require("hardhat");
const {getSavedContractAddresses, saveComplateAddress, getComplateAddress, getIdoAddresses, getRefundAddresses, getRefundTestAddresses} = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json')

// Maximum number of transfers
const MAXNUMBEROFTX = 100;
// Amount of single transfer
const AMOUNTOFTX = 21;


async function main() {
    console.log(new Date());
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address)
    console.log(`The address of the token to be distributed is ${token_contract.address}`);

    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);
    
    // Ido 
    // const ido_addresses = getIdoAddresses();
    
    // refund
    // const refund_addresses = getRefundTestAddresses();
    const refund_addresses = getRefundAddresses();
    console.log(`The number of refund addresses is ${refund_addresses.length}`);
    
    // complate
    const complate_addresses = getComplateAddress()
    console.log(`The number of complate addresses is ${complate_addresses.length}`);
    
    // 
    const addresses = refund_addresses.filter(function(v){ return complate_addresses.indexOf(v) == -1 })
    console.log(`The number of finally addresses is ${addresses.length}`);
    
    // Release
    // var totalAmount = hre.ethers.utils.parseEther("" + addresses.length * AMOUNTOFTX);
    // Test
    var totalAmount = addresses.length * AMOUNTOFTX;
    
    await token_contract.approve(disperse_contract.address, totalAmount);
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
        len = addressesForEach.length;
        console.log(`address length:${len}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}`);
            // batch distribut
            // Release
            // await disperse_contract.disperseTokenSimple(c.token_address, addressesForEach, hre.ethers.utils.parseEther(""+AMOUNTOFTX));
            // Test
            await disperse_contract.disperseTokenSimple(c.token_address, addressesForEach, AMOUNTOFTX);

            // 
            console.log(`The number of addressesForEach is ${addressesForEach.length}`);
            saveComplateAddress(addressesForEach)
        }
    }
    console.log(new Date());
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

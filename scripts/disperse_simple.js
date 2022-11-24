const hre = require("hardhat");
const { getSavedContractAddresses, saveCompleteAddress, getCompleteAddress, getIdoAddresses, getRefundAddresses, getRefundTestAddresses, getAirdropAddresses } = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json')

// Maximum number of transfers
const MAXNUMBEROFTX = 100;
// Amount of single transfer
const AMOUNTOFTX = 20;

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
    console.log(new Date());
    const contracts = getSavedContractAddresses()[hre.network.name];
    const c = config[hre.network.name]

    const disperse_contract = await hre.ethers.getContractAt('Disperse', contracts['DISPERSE']);
    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address)
    const token_symbol = await token_contract.symbol();
    console.log(`The address of the token to be distributed is $${token_symbol}: ${token_contract.address}`);
    const decimals = await token_contract.decimals();
    console.log(`The decimal of the token is ${decimals}`);

    // Test
    // await disperse_contract.disperseTokenSimple(c.token_address, ["0x67C09A12125De06f23Ac79FCA1336F3bdf97fE67"], AMOUNTOFTX);

    // Ido 
    // const ido_addresses = getIdoAddresses();

    // refund
    // const refund_addresses = getRefundTestAddresses();
    // const refund_addresses = getRefundAddresses();
    // console.log(`The number of refund addresses is ${refund_addresses.length}`);

    // complate
    // const complete_addresses = getCompleteAddress()
    // console.log(`The number of complate addresses is ${complete_addresses.length}`);

    // AirDrop
    const airdrop_addresses = getAirdropAddresses()
    console.log(`The number of airdrop addresses is ${airdrop_addresses.length}`);

    // 
    // const addresses = refund_addresses.slice(complete_addresses.length);
    const addresses = airdrop_addresses;
    console.log(`The number of finally addresses is ${addresses.length}`);


    // var totalAmount = addresses.length * AMOUNTOFTX;
    const allowance = await token_contract.allowance(c.caller, disperse_contract.address);
    const allowance_dex = hre.ethers.utils.formatUnits(allowance, decimals);
    console.log(`User(${c.caller}) approved <${disperse_contract.address}> using ${allowance_dex} $${token_symbol}`);
    let ok = await yesno({
        question: 'Allowance:: Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }

    // Release
    if (allowance_dex < addresses.length * AMOUNTOFTX) {
        var totalAmount = hre.ethers.utils.parseUnits("100000", decimals);
        await token_contract.approve(disperse_contract.address, totalAmount);
        console.log(`token address is ${token_contract.address}`);
        console.log(`token.approve(${disperse_contract.address}), amount is ${totalAmount}.`);
        let ok = await yesno({
            question: 'Approve:: Are you sure you want to continue?'
        });
        if (!ok) {
            process.exit(0)
        }
    }

    batch = parseInt(addresses.length / MAXNUMBEROFTX);
    for (let i = 0; i <= batch; i++) {
        addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
        len = addressesForEach.length;
        console.log(`address length:${len}`);
        if (len > 0) {
            console.log(`last address:${addressesForEach[len - 1]}, start time:${new Date()}`);
            console.log(`The number of addressesForEach is ${addressesForEach.length} =====> ${AMOUNTOFTX} $${token_symbol} per address.`);
            let ok = await yesno({
                question: 'Disperse:: Are you sure you want to continue?'
            });
            if (!ok) {
                process.exit(0)
            }
            // Release
            await disperse_contract.disperseTokenSimple(c.token_address, addressesForEach, hre.ethers.utils.parseUnits("" + AMOUNTOFTX, decimals));

            // saveCompleteAddress(addressesForEach)

            // await sleep(30000)
            console.log(`last address:${addressesForEach[len - 1]}, end time:${new Date()}`);
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

const hre = require("hardhat");
const { getSavedContractAddresses, getIdoAddressesFromDb, updateIdoAddressesToDb, getIdoAddressesFromDbByStatus } = require('./utils/utils');
const yesno = require('yesno');
const config = require('./configs/DisperseConfig.json');


// The code of status
const INIT_CODE = 0;
const ING_CODE = 1;
const SUCCESS_CODE = 2;
const ERROR_CODE = 3;

// Sleep func
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// Milliseconds
const SLEEP_MS = 50000;
// const SLEEP_MS_UPDATE_DB = 2000;

// Maximum number of transfers
const MAXNUMBEROFTX = 50;

// Approve amount (Larger than actual amount)
// Actual amount: 16068833.6673
const APPROVE_AMOUNT = 300000;
// const APPROVE_AMOUNT = 4750;
// 16,073,750


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

    const address_infos = await getIdoAddressesFromDb();
    let addresses = new Array();
    let amounts = new Array();
    let totalAmount = 0;
    for (let i = 0; i < address_infos.length; i++) {
        const address_info = address_infos[i];
        addresses.push(address_info.address);
        amounts.push(hre.ethers.utils.parseUnits(address_info.amount.toString(), decimals));
        totalAmount += parseFloat(address_info.amount);
    }

    if (addresses.length != amounts.length) {
        console.log("The parameter length is different.");
        return;
    }
    console.log(`Should be approve ${hre.ethers.utils.parseUnits('' + totalAmount, decimals)} to ${disperse_contract.address}`);
    await token_contract.approve(disperse_contract.address, hre.ethers.utils.parseUnits('' + APPROVE_AMOUNT, decimals));
    console.log(`token.approve(${disperse_contract.address}), amount is ${APPROVE_AMOUNT}.`);
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }

    // Current progress
    const success_addresses = await getIdoAddressesFromDbByStatus(SUCCESS_CODE);
    var progress_count = success_addresses.length;
    console.log(`The number of addresses currently transferred is ${progress_count}`);

    while (true) {
        const address_infos = await getIdoAddressesFromDb(MAXNUMBEROFTX);
        if (address_infos.length == 0) {
            const success_addresses = await getIdoAddressesFromDbByStatus(SUCCESS_CODE);
            console.log(`INFO: No new address was found. The current number of transferred addresses is: ${success_addresses.length}`);
            break;
        }

        console.log(`INFO: The first address of the current batch is ${address_infos[0].address}, start time:${new Date()}`);
        let addresses = new Array();
        let amounts = new Array();
        for (let i = 0; i < address_infos.length; i++) {
            const address_info = address_infos[i];
            addresses.push(address_info.address);
            amounts.push(hre.ethers.utils.parseUnits(address_info.amount.toString(), decimals));
        }
        if (addresses.length != amounts.length) {
            console.log("EEROR: The parameter length is different.");
            break;
        }

        if (addresses.length > 0) {
            // batch distribut
            await updateIdoAddressesToDb(addresses, ING_CODE)
            // await sleep(SLEEP_MS_UPDATE_DB)
            console.log("INFO: The address of the current batch starts the transfer.");
            try {
                await disperse_contract.disperseToken(c.token_address, addresses, amounts);
            } catch (error) {
                // Update status to 3
                await updateIdoAddressesToDb(addresses, ERROR_CODE);
                // To update the database
                // await sleep(SLEEP_MS)
                console.log(`ERROR: The current batch of addresses failed to transfer, reason: ${error}`);
                break;
            }
            await updateIdoAddressesToDb(addresses, SUCCESS_CODE);
            // await sleep(SLEEP_MS_UPDATE_DB)
            console.log(`INFO: The address of the current batch was transferred successfully, the first address:${addresses[0]}, end time:${new Date()}`);
            // Current progress
            progress_count += addresses.length;
            console.log(`INFO: The total number of addresses that have been transferred is >>>${progress_count}<<<`);
            // Sleep
            await sleep(SLEEP_MS)
        } else {
            console.log("ERROR: The address length of the current batch is empty.");
            break;
        }
    }



    // var count = 0;
    // const batch = parseInt(addresses.length / MAXNUMBEROFTX);
    // for (let i = 0; i <= batch; i++) {
    //     addressesForEach = addresses.splice(0, MAXNUMBEROFTX);
    //     amountsForEach = amounts.splice(0, MAXNUMBEROFTX);
    //     len = addressesForEach.length;
    //     if (len != amountsForEach.length) {
    //         console.log("The parameter length is different.");
    //         return;
    //     }
    //     console.log(`address length:${len}`);
    //     if (len > 0) {
    //         console.log(`last address:${addressesForEach[len - 1]}`);
    //         // batch distribut
    //         await disperse_contract.disperseToken(c.token_address, addressesForEach, amountsForEach);
    //         await updateIdoAddressesToDb(addressesForEach);

    //         console.log(`last address:${addressesForEach[len - 1]}, end time:${new Date()}`);
    //         count += addressesForEach.length;
    //         console.log(`The total number of addresses that have been transferred is ${count}`);
    //         await sleep(30000)
    //     }
    // }
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

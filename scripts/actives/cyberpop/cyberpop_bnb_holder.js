const { waffle, ethers } = require("hardhat");
const yesno = require('yesno');
const { getBNBHolder, saveBNBHolder } = require('../../utils/utils');


const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function main() {

    let user_address_infos = getBNBHolder() || {};
    user_addresses = new Set(Object.keys(user_address_infos)) || new Set();
    console.log(user_addresses.size);

    // DEBUG
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }

    const provider = waffle.provider;
    // debug
    // const balance0ETH = await provider.getBalance("0x24e1Ae757ca647101B0e7614217b7AE26338F578");
    // console.log(balance0ETH);

    // const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address);

    let addresses = Array.from(user_addresses);
    let count = 0;
    for (let i = 0; i < addresses.length; i++) {
        count++;
        let address = addresses[i];
        if (user_address_infos[address] > 0) {
            console.log(`Continue--<${address}> balance: ${user_address_infos[address]}, index: ${count}`);
            continue;
        }
        try {
            let balance = await provider.getBalance(address);
            balance = parseInt(balance);
            console.log(`<${address}> balance: ${balance}, index: ${count}`);
            saveBNBHolder(address, balance);
            sleep(50)
        } catch (error) {
            console.log(error);
        }

    }

    console.log(`Over`);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

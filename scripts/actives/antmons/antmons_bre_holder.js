const hre = require("hardhat");
const yesno = require('yesno');
const { getBREHolder, saveBREHolder } = require('../../utils/utils');
const config = require('../../configs/DisperseConfig.json');
const { BigNumber } = require("ethers");


async function main() {

    const network = hre.network.name;
    const c = config[network];
    let user_address_infos = getBREHolder("antmons") || {};

    user_addresses = new Set(Object.keys(user_address_infos)) || new Set();

    const CONTRACTADDRESS = c.token_address;
    console.log(user_addresses.size, CONTRACTADDRESS);

    // DEBUG
    let ok = await yesno({
        question: 'Are you sure you want to continue?'
    });
    if (!ok) {
        process.exit(0)
    }

    const token_contract = await hre.ethers.getContractAt(c.token_abi, c.token_address);

    let addresses = Array.from(user_addresses);
    for (let i = 0; i < addresses.length; i++) {
        let address = addresses[i];
        let balance = await token_contract.balanceOf(address);
        balance = parseInt(balance);
        console.log(`<${address}> balance: ${balance}`);
        saveBREHolder("antmons", address, balance);
    }

    console.log(`Over`);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

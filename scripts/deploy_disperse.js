const hre = require("hardhat");
const {saveContractAddress} = require("./utils/utils");

async function main() {
    const Disperse = await hre.ethers.getContractFactory("Disperse");
    const disperse_contract = await Disperse.deploy();
    await disperse_contract.deployed();
    console.log("Disperse deployed to: ", disperse_contract.address);

    saveContractAddress(hre.network.name, "DISPERSE", disperse_contract.address);
}


main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

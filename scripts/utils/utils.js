const fs = require('fs')
const path = require('path')

function getStakeConfig() {
    let json
    try {
        json = fs.readFileSync(path.join(__dirname, '../configs/StakeConfig.json'))
    } catch (err) {
        json = '{}'
    }
    const config = JSON.parse(json)
    return config
}

function getSavedContractAddresses() {
    let json
    try {
        json = fs.readFileSync(path.join(__dirname, '../deployments/contract-addresses.json'))
    } catch (err) {
        json = '{}'
    }
    const addrs = JSON.parse(json)
    return addrs
}

function getTestAddresses() {
    let data
    try {
        data = fs.readFileSync(path.join(__dirname, "./addresses.json"))
    } catch(err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

function getBscStakeAllTx() {
    let json
    try {
        json = fs.readFileSync(path.join(__dirname, './allTx.json'))
    } catch (err) {
        json = '{}'
    }
    const infos = JSON.parse(json)
    return infos
}

function saveStakeConfig(network, key, value) {
    const config = getStakeConfig()
    config[network] = config[network] || {}
    config[network][key] = value
    fs.writeFileSync(path.join(__dirname, '../configs/StakeConfig.json'), JSON.stringify(config, null, '    '))
}

function saveContractAddress(network, contract, address) {
    const addrs = getSavedContractAddresses()
    addrs[network] = addrs[network] || {}
    addrs[network][contract] = address
    fs.writeFileSync(path.join(__dirname, '../deployments/contract-addresses.json'), JSON.stringify(addrs, null, '    '))
}

function saveBscStakeAllTx(txHash, txData) {
    const infos = getBscStakeAllTx() || {}
    infos[txHash] = txData
    fs.writeFileSync(path.join(__dirname, './allTx.json'), JSON.stringify(infos, null, '    '))
}

module.exports = {
    getTestAddresses,
    getStakeConfig,
    getSavedContractAddresses,
    saveStakeConfig,
    saveContractAddress,
    saveBscStakeAllTx
}

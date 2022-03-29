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

function saveStakeConfig(network, key, value) {
    const config = getStakeConfig()
    config[network] = config[network] || {}
    config[network][key] = value
    fs.writeFileSync(path.join(__dirname, '../configs/StakeConfig.json'), JSON.stringify(config, null, '    '))
}

module.exports = {
    getStakeConfig,
    saveStakeConfig
}

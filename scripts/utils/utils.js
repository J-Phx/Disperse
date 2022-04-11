const fs = require('fs')
const path = require('path')
const mysql = require('mysql')

// connect mysql
const pool = mysql.createPool({
    // host: '8.210.210.140', // 连接的服务器
    host: '172.31.184.186', // 连接的服务器
    port: 3306, // mysql服务运行的端口
    user: 'boba', // 用户名
    password: 'Boba@2022', // 用户密码  
    database: 'boba_prod', // 选择的库
})

let query = function (sql, values) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                reject(err)
            } else {
                connection.query(sql, values, (err, rows) => {

                    if (err) {
                        reject(err)
                    } else {
                        resolve(rows)
                    }
                    connection.release()
                })
            }
        })
    })
}

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
    } catch (err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

function getIdoAddresses() {
    let data
    try {
        data = fs.readFileSync(path.join(__dirname, "./ido_address.json"))
    } catch (err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

async function getIdoAddressesFromDb(limit) {
    console.log('================SELECT==================');
    let sql;
    if (limit && limit !== undefined) {
        sql = `SELECT address,amount FROM ido_addresses WHERE status!=2 LIMIT ${limit}`;
    } else {
        sql = `SELECT address,amount FROM ido_addresses WHERE status!=2`;
    }

    console.log(`SQL: ${sql}`);
    const data_json = await query(sql);
    console.log(`The number of data is ${data_json.length}`);
    return data_json;
}

async function getIdoAddressesFromDbByStatus(status) {
    console.log('================SELECT By Status==================');
    let sql = `SELECT address,amount FROM ido_addresses WHERE status=${status}`;

    console.log(`SQL: ${sql}`);
    const data_json = await query(sql);
    return data_json;
}

async function updateIdoAddressesToDb(addresses, status) {
    // console.log('================Update Status==================');
    // await addresses.forEach(async address => {
    //     const sql = `UPDATE ido_addresses SET status=${status} WHERE address='${address}'`;
    //     // console.log(`SQL: ${sql}`);
    //     await query(sql)
    // });

    console.log('================Update Status==================');
    var instring = "'" + addresses.join("','") + "'";
    let sql = `UPDATE ido_addresses SET status=${status} WHERE address in (${instring})`;
    await query(sql);
    
}

function getRefundAddresses() {
    let data
    try {
        data = fs.readFileSync(path.join(__dirname, "./refund_address.json"))
    } catch (err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

function getRefundTestAddresses() {
    let data
    try {
        data = fs.readFileSync(path.join(__dirname, "./refund_test_address.json"))
    } catch (err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

function getAirdropAddresses() {
    let data
    try {
        data = fs.readFileSync(path.join(__dirname, "./airdrop_address_info.json"))
    } catch (err) {
        data = '[]'
    }
    const data_json = JSON.parse(data)
    return data_json
}

function getCompleteAddress() {
    let json
    try {
        json = fs.readFileSync(path.join(__dirname, './complete_address.json'))
    } catch (err) {
        json = '[]'
    }
    const infos = JSON.parse(json)
    return infos
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

function saveCompleteAddress(addresses) {
    var infos = getCompleteAddress() || []
    infos = infos.concat(addresses)
    console.log(`The number of complete address is ${infos.length}`);
    fs.writeFileSync(path.join(__dirname, './complete_address.json'), JSON.stringify(infos, null, '    '))
}

module.exports = {
    getTestAddresses,
    getIdoAddresses,
    getIdoAddressesFromDb,
    getIdoAddressesFromDbByStatus,
    getRefundAddresses,
    getRefundTestAddresses,
    getAirdropAddresses,
    getCompleteAddress,
    getStakeConfig,
    getSavedContractAddresses,
    updateIdoAddressesToDb,
    saveStakeConfig,
    saveContractAddress,
    saveBscStakeAllTx,
    saveCompleteAddress
}

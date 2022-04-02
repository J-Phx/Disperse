require('dotenv').config();
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    boba_mainnet: {
      url: 'https://mainnet.boba.network/',
      chainId: 288,
      accounts: [process.env.BOBA_MAINNET_PK],
    },
    bsc_mainnet: {
      url: 'https://bscrpc.com',
      chainId: 56,
      accounts: [process.env.BSC_MAINNET_PK],
    },
    boba_rinkeby: {
      url: 'https://rinkeby.boba.network',
      chainId: 28,
      gas: 5000000,
      gasPrice: 1000000000,
      accounts: [process.env.BOBA_RINKEBY_PK],
    },
    bsc_testnet: {
      url: 'https://data-seed-prebsc-1-s1.binance.org:8545',
      chainId: 97,
      accounts: [process.env.BSC_TESTNET_PK],
    },
    local: {
      url: 'http://localhost:8545',
    },
  },
  solidity: {
    version: "0.6.12",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  etherscan: {
    apiKey: {
      bscTestnet: '59GYEFGSN1RYQK5XX6MRRCP1JD5MZJETNF',
      bsc: 'FP5AQFRD8I61QQ6E2V52YT61ABXDGP4J7S'
    }
  },
};

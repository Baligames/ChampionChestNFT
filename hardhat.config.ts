require('dotenv').config();
import '@nomiclabs/hardhat-waffle';
import '@typechain/hardhat';
import '@nomicfoundation/hardhat-foundry';
import 'hardhat-deploy';
import { HardhatUserConfig, task } from 'hardhat/config';
import { NetworkUserConfig } from 'hardhat/types';

import champions from './scripts/tasks/champions';
task('champions', 'Champions task').setAction(champions);

const DEFAULT_MNEMONIC = 'title spike pink garlic hamster sorry few damage silver mushroom clever window';

const { TESTNET_PK, TESTNET_URL, MAINNET_PK, MAINNET_URL } = process.env;

if (!TESTNET_PK) {
  console.warn('TESTNET_PK is unset. Using DEFAULT_MNEMONIC');
} else {
  console.info('TESTNET_PK is set. Using TESTNET_PK');
}

if (!MAINNET_PK) {
  console.warn('MAINNET_PK is unset. Using DEFAULT_MNEMONIC');
}

const testnet: NetworkUserConfig = {
  chainId: 2021,
  url: TESTNET_URL || 'https://saigon-testnet.roninchain.com/rpc',
  accounts: TESTNET_PK ? [TESTNET_PK] : { mnemonic: DEFAULT_MNEMONIC },
  blockGasLimit: 100000000,
};

const mainnet: NetworkUserConfig = {
  chainId: 2020,
  url: MAINNET_URL || 'https://api.roninchain.com/rpc',
  accounts: MAINNET_PK ? [MAINNET_PK] : { mnemonic: DEFAULT_MNEMONIC },
  blockGasLimit: 100000000,
};

const config: HardhatUserConfig = {
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  typechain: {
    outDir: './scripts/typechain-types',
  },
  paths: {
    sources: './src',
    cache: './cache/hardhat',
    deploy: ['./scripts/deploy'],
  },
  namedAccounts: {
    deployer: `privatekey://${TESTNET_PK}`,
  },
  networks: {
    hardhat: {
      hardfork: 'istanbul',
      accounts: {
        mnemonic: DEFAULT_MNEMONIC,
      },
    },
    'ronin-testnet': testnet,
    'ronin-mainnet': mainnet,
  },
};

export default config;

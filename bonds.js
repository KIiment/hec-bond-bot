#! /usr/bin/env node

const {
  StaticJsonRpcProvider,
  JsonRpcProvider,
} = require('@ethersproject/providers');
const ethers = require('ethers');

const abi = require('./abi');
const bonds = require('./bondinfo');




const provider = new JsonRpcProvider('https://rpc.fantom.network/', 250);

const addresses = {
  aggregator: '0x7dc6bad2798ba1AcD8cf34F9a3eF3a168252e1A6',
  dailp: '0xbc0eecda2d8141e3a26d2535c57cadcb1095bca9',
  staking: '0xd12930c8deedafd788f437879cba1ad1e3908cc5',
  shec: '0x75bdef24285013387a47775828bec90b91ca9a5f',
};


module.exports.getBonds = async function() {
  const pairContract = new ethers.Contract(addresses.dailp, abi.pair, provider);
  const reserves = await pairContract.getReserves();
  const marketPrice = reserves[1] / reserves[0] / 1e9;

  const aggContract = new ethers.Contract(addresses.aggregator, abi.aggregator, provider);
  const globalBondData = await aggContract.globalBondData();

  /* Staking rewards
   */
  const stakingContract = new ethers.Contract(addresses.staking, abi.staking, provider);

  let sHecMainContract
  let circ
  try {
  sHecMainContract = new ethers.Contract(addresses.shec, abi.shec, provider);
  circ = await sHecMainContract.circulatingSupply();
  } catch(e){
    console.log(e)
    return;
  }

  const epoch = await stakingContract.epoch();
  const stakingReward = epoch.distribute;
  const stakingRebase = stakingReward / circ;

  const stakingRebasePercentage = stakingRebase * 1200;
  
  async function getBondPrices(bonds, isFour) {
    const clean = bonds.map(({ networkAddr, displayName, decimals }) => {
      const bondData = globalBondData.find((b) => (
        networkAddr.toLowerCase() === b.Contract.toLowerCase()
      ));
      if (!bondData) {
        console.log('Unable to locate bondData', displayName);
        return {};
      }

      let price = +bondData.BondPriceInUSD;

      let discount = (marketPrice * 1e18 - price) / price;
      if (decimals) {
        discount = discount / 1e12 - 1;
      }

      price /= Math.pow(10, decimals || 18);

      return {
        name: displayName,
        price,
        discount: ((isFour ? stakingRebasePercentage : 0) + discount * 100),
      };
    });

    clean.sort((a, b) => a.price - b.price);

    return clean;
  }

  /* Create list with bond data
   */
  return {
    bonds: {
      11: await getBondPrices(bonds.OneOne, false),
      44: await getBondPrices(bonds.FourFour, true),
    },
    stakingRebasePercentage,
  };
};
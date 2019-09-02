const RRC20 = artifacts.require('./RRC20.sol');

module.exports = (deployer) => {
  deployer.deploy(RRC20, 10000, 'Simon Bucks', 1, 'SBX');
};

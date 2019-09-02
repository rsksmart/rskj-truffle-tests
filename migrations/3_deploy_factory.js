const RRC20Factory =
  artifacts.require('./RRC20Factory.sol');

module.exports = (deployer) => {
  deployer.deploy(RRC20Factory);
};

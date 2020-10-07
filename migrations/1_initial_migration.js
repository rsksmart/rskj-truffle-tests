const Migrations = artifacts.require("Migrations");
const Create2 = artifacts.require("Create2");
const Recursive = artifacts.require("Recursive");
const AltBN128Contracts = artifacts.require("AltBN128Contracts");

const ChainID = artifacts.require("ChainID");
const Selfbalance = artifacts.require("Selfbalance");


const Sample = artifacts.require("Sample");
const DestroyAndExtCodeHash = artifacts.require("DestroyAndExtCodeHash")
const SelfDestructor = artifacts.require("SelfDestructor")
const CreateAndExtCodeHash = artifacts.require("CreateAndExtCodeHash")

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Create2);
  deployer.deploy(Recursive);
  deployer.deploy(Sample);
  deployer.deploy(AltBN128Contracts);
  deployer.deploy(ChainID);
  deployer.deploy(Selfbalance);
  deployer.deploy(DestroyAndExtCodeHash);
  deployer.deploy(SelfDestructor);
  deployer.deploy(CreateAndExtCodeHash);


};

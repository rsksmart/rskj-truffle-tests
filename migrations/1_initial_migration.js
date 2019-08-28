const Migrations = artifacts.require("Migrations");
const Create2 = artifacts.require("Create2");
const Recursive = artifacts.require("Recursive");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
  deployer.deploy(Create2);
  deployer.deploy(Recursive);

};

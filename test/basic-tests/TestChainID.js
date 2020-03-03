const ChainID = artifacts.require("ChainID");
var assert = require('assert');

contract('ChainID', async () => {
  it('Should return correct chain ID', async () => {
    //deploys chainID contract 
    const chainIdContract = await ChainID.deployed();
    
    //get chainID by opcode
    let actual = await chainIdContract.getChainId.call();

    //get chainID by web3 method
    let expected  = await web3.eth.net.getId();
    
    assert.equal(actual, expected);
  });
});

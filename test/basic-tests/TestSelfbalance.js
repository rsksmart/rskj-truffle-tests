const Selfbalance = artifacts.require("Selfbalance");
var assert = require('assert');

contract('Selfbalance', async () => {
  it('Should be correct balance', async () => {
    //deploys Selfbalance contract 
    const selfbalanceContract = await Selfbalance.deployed();
    
    //get Selfbalance by opcode
    let actual = await selfbalanceContract.getSelfbalance.call();

    //get Selfbalance by method
    let expected = await web3.eth.getBalance(selfbalanceContract.address);
    
    assert.equal(actual, expected);
  });

  it('Should be same as balance', async () => {
    //deploys Selfbalance contract 
    const selfbalanceContract = await Selfbalance.deployed();
    
    //get Selfbalance by opcode
    let actual = await selfbalanceContract.getSelfbalance.call();

    //get Selfbalance by method
    let expected = await selfbalanceContract.getBalance.call();
    
    assert.equal(actual.toString(), expected.toString());
  });
});

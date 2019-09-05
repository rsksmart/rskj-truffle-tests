const Recursive = artifacts.require('Recursive');

contract('Recursive', () => {
  var recursiveContract;
  beforeEach(async () => {
    recursiveContract = await Recursive.new();
  });

  describe('Verify Recursive', () => {
    it('Should complete recursive call', async () => {
      await web3.eth.sendTransaction({from:"0xcd2a3d9f938e13cd947ec05abc7fe734df8dd826", to: recursiveContract.address.toString(), value: 0x00, gas: 0x0fffff, gasPrice: 0xffffff});
    })
  })
})
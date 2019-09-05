var assert = require('assert');
contract('FirstTest', () => {
    describe('Verify is RSK', () => {
      it('Network should be RSK', async () => {
        let network = await web3.eth.getNodeInfo();
        assert(network.indexOf('RskJ') >= 0,"Network should be RSK but is :" + network);
        
    })
    })
  })
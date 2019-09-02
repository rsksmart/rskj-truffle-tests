const RRC20Factory = artifacts.require('RRC20Factory');

contract('RRC20Factory', (accounts) => {
  it('Verify a Human Standard Token once deployed using both verification functions.', async () => {
    const factory = await RRC20Factory.new();
    const newTokenAddr = await factory.createRRC20.call(100000, 'Simon Bucks', 2, 'SBX', { from: accounts[0] });
    await factory.createRRC20(100000, 'Simon Bucks', 2, 'SBX', { from: accounts[0] });
    const res = await factory.verifyRRC20.call(newTokenAddr, { from: accounts[0] });
    assert(res, 'Could not verify the token.');
  });
});

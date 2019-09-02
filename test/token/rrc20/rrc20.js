var assert = require('assert');
const truffleAssert = require('truffle-assertions');

const RRC20Abstraction = artifacts.require('RRC20');
let HST;

contract('RRC20', (accounts) => {
  beforeEach(async () => {
    HST = await RRC20Abstraction.new(10000, 'Simon Bucks', 1, 'SBX', { from: accounts[0] });
  });

  it('Creation: Should create an initial balance of 10000 for the creator', async () => {
    const balance = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance.toNumber(), 10000);
  });

  it('Creation: Test correct setting of vanity information', async () => {
    const name = await HST.name.call();
    assert.strictEqual(name, 'Simon Bucks');

    const decimals = await HST.decimals.call();
    assert.strictEqual(decimals.toNumber(), 1);

    const symbol = await HST.symbol.call();
    assert.strictEqual(symbol, 'SBX');
  });

  it('Creation: Should succeed in creating over 2^256 - 1 (max) tokens', async () => {
    const max = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
    const HST2 = await RRC20Abstraction.new(max, 'Simon Bucks', 1, 'SBX', { from: accounts[0] });
    const totalSupply = await HST2.totalSupply();
    assert.equal(totalSupply, max, 'result is not correct');
  });

  // TRANSERS
  it('Transfers: Transfer should be reversed.', async () => {
    const balanceBefore = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceBefore.toNumber(), 10000);
    await truffleAssert.reverts(
      web3.eth.sendTransaction(
        { from: accounts[0], to: HST.address, value: web3.utils.toWei('10', 'wei') }));
    const balanceAfter = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balanceAfter.toNumber(), 10000);
  });

  it('Transfers: Should transfer 10000 to accounts[1] with accounts[0] having 10000', async () => {
    await HST.transfer(accounts[1], 10000, { from: accounts[0] });
    const balance = await HST.balanceOf.call(accounts[1]);
    assert.strictEqual(balance.toNumber(), 10000);
  });

  it('Transfers: Should fail when trying to transfer 10001 to accounts[1] with accounts[0] having 10000', async () => {
    await truffleAssert.reverts((HST.transfer.call(accounts[1], 10001, { from: accounts[0] })),"Returned error: VM execution error: transaction reverted");
  });

  it('Transfers: Should handle zero-transfers normally', async () => {
    assert(await HST.transfer.call(accounts[1], 0, { from: accounts[0] }), 'zero-transfer has failed');
  });

  it('Approvals: msg.sender should approve 100 to accounts[1]', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    const allowance = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance.toNumber(), 100);
  });

  it('Approvals: msg.sender approves accounts[1] of 100 & withdraws 20 once.', async () => {
    const balance0 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance0.toNumber(), 10000);

    await HST.approve(accounts[1], 100, { from: accounts[0] }); // 100
    const balance2 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance2.toNumber(), 0, 'balance2 not correct');

    await HST.transferFrom.call(accounts[0], accounts[2], 20, { from: accounts[1] });
    await HST.allowance.call(accounts[0], accounts[1]);
    await HST.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] }); // -20
    const allowance01 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance01.toNumber(), 80); // =80

    const balance22 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance22.toNumber(), 20);

    const balance02 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance02.toNumber(), 9980);
  });

  it('Approvals: msg.sender approves accounts[1] of 100 & withdraws 20 twice.', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    const allowance01 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance01.toNumber(), 100);

    await HST.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] });
    const allowance012 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance012.toNumber(), 80);

    const balance2 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance2.toNumber(), 20);

    const balance0 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance0.toNumber(), 9980);


    await HST.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] });
    const allowance013 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance013.toNumber(), 60);

    const balance22 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance22.toNumber(), 40);

    const balance02 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance02.toNumber(), 9960);
  });

  it('Approvals: msg.sender approves accounts[1] of 100 & withdraws 50 & 60 (2nd tx should fail)', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    const allowance01 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance01.toNumber(), 100);

    await HST.transferFrom(accounts[0], accounts[2], 50, { from: accounts[1] });
    const allowance012 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.strictEqual(allowance012.toNumber(), 50);

    const balance2 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance2.toNumber(), 50);

    const balance0 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance0.toNumber(), 9950);

    await truffleAssert.reverts(HST.transferFrom.call(accounts[0], accounts[2], 60, { from: accounts[1] }),"Returned error: VM execution error: transaction reverted");
  });

  it('Approvals: Attempt withdrawal from account with no allowance (should fail)', async () => {
    await truffleAssert.reverts(HST.transferFrom.call(accounts[0], accounts[2], 60, { from: accounts[1] }),"Returned error: VM execution error: transaction reverted");
  });

  it('Approvals: Allow accounts[1] 100 to withdraw from accounts[0]. Withdraw 60 and then approve 0 & attempt transfer.', async () => {
    await HST.approve(accounts[1], 100, { from: accounts[0] });
    await HST.transferFrom(accounts[0], accounts[2], 60, { from: accounts[1] });
    await HST.approve(accounts[1], 0, { from: accounts[0] });
    await truffleAssert.reverts(HST.transferFrom.call(accounts[0], accounts[2], 10, { from: accounts[1] }),"Returned error: VM execution error: transaction reverted");
  });

  it('Approvals: Approve max (2^256 - 1)', async () => {
    await HST.approve(accounts[1], '115792089237316195423570985008687907853269984665640564039457584007913129639935', { from: accounts[0] });
    const allowance = await HST.allowance(accounts[0], accounts[1]);
    assert.equal(allowance,'115792089237316195423570985008687907853269984665640564039457584007913129639935');
  });

  it('Approvals: msg.sender approves accounts[1] of max (2^256 - 1) & withdraws 20', async () => {
    const balance0 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance0.toNumber(), 10000);

    const max = '115792089237316195423570985008687907853269984665640564039457584007913129639935';
    await HST.approve(accounts[1], max, { from: accounts[0] });
    const balance2 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance2.toNumber(), 0, 'balance2 not correct');

    await HST.transferFrom(accounts[0], accounts[2], 20, { from: accounts[1] });
    const allowance01 = await HST.allowance.call(accounts[0], accounts[1]);
    assert.equal(allowance01,max);

    const balance22 = await HST.balanceOf.call(accounts[2]);
    assert.strictEqual(balance22.toNumber(), 20);

    const balance02 = await HST.balanceOf.call(accounts[0]);
    assert.strictEqual(balance02.toNumber(), 9980);
  });

  it('Events: Should fire Transfer event properly', async () => {
    const res = await HST.transfer(accounts[1], '2666', { from: accounts[0] });
    const transferLog = res.logs.find(element => element.event.match('Transfer'));
    assert.strictEqual(transferLog.args._from, accounts[0]);
    assert.strictEqual(transferLog.args._to, accounts[1]);
    assert.strictEqual(transferLog.args._value.toString(), '2666');
  });

  it('Events: Should fire Transfer event normally on a zero transfer', async () => {
    const res = await HST.transfer(accounts[1], '0', { from: accounts[0] });
    const transferLog = res.logs.find(element => element.event.match('Transfer'));
    assert.strictEqual(transferLog.args._from, accounts[0]);
    assert.strictEqual(transferLog.args._to, accounts[1]);
    assert.strictEqual(transferLog.args._value.toString(), '0');
  });

  it('Events: Should fire Approval event properly', async () => {
    const res = await HST.approve(accounts[1], '2666', { from: accounts[0] });
    const approvalLog = res.logs.find(element => element.event.match('Approval'));
    assert.strictEqual(approvalLog.args._owner, accounts[0]);
    assert.strictEqual(approvalLog.args._spender, accounts[1]);
    assert.strictEqual(approvalLog.args._value.toString(), '2666');
  });
});

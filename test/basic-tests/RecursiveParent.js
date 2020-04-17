const RecursiveParent = artifacts.require('RecursiveParent');

async function expectThrow (promise) {
  try {
    await promise;
  } catch (error) {
      return;
  }
  
  assert.fail('Expected throw not received');
}

contract('RecursiveParent', () => {
  let recursiveContract;
  
  beforeEach(async () => {
    this.recursiveContract = await RecursiveParent.new();
  });

  describe('Call recursive contract', () => {
    it('Using 400 levels of recursion', async () => {
      await this.recursiveContract.increment(400);

      const counter = await this.recursiveContract.counter();
      
      assert.equal(counter, 200);
    });

    it('Using 401 levels of recursion the transaction should be reverted', async () => {
      expectThrow(this.recursiveContract.increment(401));

      const counter = await this.recursiveContract.counter();
      
      assert.equals(counter, 0);
    })
  })
})
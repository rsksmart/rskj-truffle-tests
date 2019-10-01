const  SelfDestructor = artifacts.require("SelfDestructor");
const  DestroyAndExtCodeHash = artifacts.require("DestroyAndExtCodeHash");
const  CreateAndExtCodeHash = artifacts.require("CreateAndExtCodeHash");
const assert = require('assert');
const truffleAssert = require('truffle-assertions');
const utils = require('../basic-tests/utils/common')

contract('EXTCODEHASH', async accounts =>  {
  var selfDestructorContract;
  var destroyAndCheckExtCodeHash;
  var createAndCheckExtCodeHash;

  beforeEach(async () => {
    selfDestructorContract = await SelfDestructor.new();
    destroyAndCheckExtCodeHash = await DestroyAndExtCodeHash.new();
    createAndCheckExtCodeHash = await CreateAndExtCodeHash.new();
  });
  
  it('The EXTCODEHASH of an account that selfdestructed in the current transaction', async () => {

    //Check Extcodehash of contract created
    let hash = await destroyAndCheckExtCodeHash.extCodeHash(selfDestructorContract.address);
    
    //Destroy the contract and check the Extcodehash in the same tx
    let receipt = await destroyAndCheckExtCodeHash.destroyAndExtCodeHash(selfDestructorContract.address);

    let extCodeHash = receipt.logs[0].args[0];

    //Selfdestruct and extcodehash are computed in the same tx, so the first one is not effective
    assert.equal(extCodeHash, hash);
    assert.notEqual(extCodeHash, 0);
  });

  it('The EXTCODEHASH of an account that selfdestructed in different txs', async () => {
    //Check Extcodehash of contract created
    let hash = await destroyAndCheckExtCodeHash.extCodeHash(selfDestructorContract.address);
    
    //Destroy the contract
    await selfDestructorContract.destroy();

    //Check extcodehash of the destroyed contract
    let destroyedHash = await destroyAndCheckExtCodeHash.extCodeHash(selfDestructorContract.address);

    //Selfdestruct is computed in different txs so contract is destroyed
    assert.notEqual(destroyedHash, hash);
    assert.equal(destroyedHash, 0);
  });

  it('The EXTCODEHASH of an account that selfdestructed and later the selfdestruct has been reverted.', async () => {
    //Check Extcodehash of contract created
    let hash = await destroyAndCheckExtCodeHash.extCodeHash(selfDestructorContract.address);

    //Try to destroy the contract and revert it.
    await truffleAssert.reverts(destroyAndCheckExtCodeHash.destroyAndRevert(selfDestructorContract.address));

    //Check extcodehash of the self destructor contract
    let destroyedHash = await destroyAndCheckExtCodeHash.extCodeHash(selfDestructorContract.address);

    //Selfdestruct is computed in different txs, so the contract still alive
    assert.equal(hash, destroyedHash);
    assert.notEqual(destroyedHash, 0);
  });
  
  it('The EXTCODEHASH of an account created in the current tx', async () => {
    //Create contract and check it extcodehash in the same tx
    let receipt = await createAndCheckExtCodeHash.createAndCheckExtCodeHash();
    let extCodeHash = receipt.logs[0].args[0];
    assert.notEqual(extCodeHash, 0);
  });

  it('The EXTCODEHASH of an account that firstly does not exist and later is empty', async () => {
    //Create empty account and check it extcodehash in the same tx
    let receipt = await createAndCheckExtCodeHash.createEmptyAccountAndCheckExtCodeHash();
    let extCodeHash = receipt.logs[0].args[0];
    let emptyHash = "0xc5d2460186f7233c927e7db2dcc703c0e500b653ca82273b7bfad8045d85a470";
    assert.notEqual(extCodeHash, 0);
    assert.equal(emptyHash, extCodeHash);
  });

  it('The EXTCODEHASH of an account that has been newly create and later the creation has been reverted', async () => {
   
    //Get creator address
    let create2addr = await createAndCheckExtCodeHash.getCreatorAddress()
    
    //Get bytecode of contract to create.
    let byteCode = await createAndCheckExtCodeHash.getContractCreation()

    //get not-created address
    let address = utils.buildCreate2Address(create2addr, utils.numberToUint256(0), byteCode);

    //Revert contract creation (address is deterministic)
    await truffleAssert.reverts(createAndCheckExtCodeHash.createAndRevert());
    
    //Do extcodehash of address which creation is reverted
    let hash = await createAndCheckExtCodeHash.extCodeHash(address.toLowerCase());

    assert.equal(hash, 0);
  }); 
});
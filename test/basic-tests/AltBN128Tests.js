const AltBN128Contracts = artifacts.require("AltBN128Contracts");
var assert = require('assert');

function numberToUint256(value) {
  const hex = value.toString(16);
  return `${'0'.repeat(64-hex.length)}${hex}`
}

contract('AltBN128Contracts', function() {
  contract('Add', function() {
    it('should return the expected sum of two points', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractAdd.call(0x1,0x2,0x1,0x2);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "030644e72e131a029b85045b68181585d97816a916871ca8d3c208c16d87cfd3" +
                "15ed738c0e0a7c92e7845f96b2ae9c0a68a6a449e3538fc7ff3ebf7a5a18a2c4";

      assert.equal(comparableResult,expected);
    });

    it('should return zero for the sum of zero points', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractAdd.call(0x0,0x0,0x0,0x0);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "0000000000000000000000000000000000000000000000000000000000000000" +
                "0000000000000000000000000000000000000000000000000000000000000000";

      assert.equal(comparableResult,expected);
    });

    it('should return zero for the sum of two big points', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractAdd.call(
        "0x17c139df0efee0f766bc0204762b774362e4ded88953a39ce849a8a7fa163fa9",
        "0x1e0559bacb160664764a357af8a9fe70baa9258e0b959273ffc5718c6d4cc7c",
        "0x17c139df0efee0f766bc0204762b774362e4ded88953a39ce849a8a7fa163fa9",
        "0x2e83f8d734803fc370eba25ed1f6b8768bd6d83887b87165fc2434fe11a830cb");
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "0000000000000000000000000000000000000000000000000000000000000000" +
                "0000000000000000000000000000000000000000000000000000000000000000";

      assert.equal(comparableResult,expected);
    });
  });
  contract('Mul', function() {
    it('should return true multiply scalar and point', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractMul.call(0x1,0x2,"0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "2f588cffe99db877a4434b598ab28f81e0522910ea52b45f0adaa772b2d5d352"+
                "12f42fa8fd34fb1b33d8c6a718b6590198389b26fc9d8808d971f8b009777a97";

      assert.equal(comparableResult,expected);
    });

    it('should return identity when multiplied by scalar value one', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractMul.call(
        "0x1a87b0584ce92f4593d161480614f2989035225609f08058ccfa3d0f940febe3",
        "0x1a2f3c951f6dadcc7ee9007dff81504b0fcd6d7cf59996efdc33d92bf7f9f8f6",
        0x1);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "1a87b0584ce92f4593d161480614f2989035225609f08058ccfa3d0f940febe3"+
                "1a2f3c951f6dadcc7ee9007dff81504b0fcd6d7cf59996efdc33d92bf7f9f8f6";

      assert.equal(comparableResult,expected);
    });

    it('should return true multiply point by scalar', async () => {
      const contract = await AltBN128Contracts.deployed();

      let res = await contract.callContractMul.call(0x1,0x2,0x9);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "039730ea8dff1254c0fee9c0ea777d29a9c710b7e616683f194f18c43b43b869" +
                "073a5ffcc6fc7a28c30723d6e58ce577356982d65b833a5a5c15bf9024b43d98";

      assert.equal(comparableResult,expected);
    });
  });
  contract('Pairing', function() {
    it('should return true for empty input', async () => {
      const contract = await AltBN128Contracts.deployed();

      let input = [];

      let res = await contract.callContractPair.call(input, input.length);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "0000000000000000000000000000000000000000000000000000000000000001";

      assert.equal(comparableResult,expected);
    });
    it('should return false for invalid pairing input', async () => {
      const contract = await AltBN128Contracts.deployed();

      let input = ["0x1c76476f4def4bb94541d57ebba1193381ffa7aa76ada664dd31c16024c43f59",
                "0x3034dd2920f673e204fee2811c678745fc819b55d3e9d294e45c9b03a76aef41",
                "0x209dd15ebff5d46c4bd888e51a93cf99a7329636c63514396b4a452003a35bf7",
                "0x04bf11ca01483bfa8b34b43561848d28905960114c8ac04049af4b6315a41678",
                "0x2bb8324af6cfc93537a2ad1a445cfd0ca2a71acd7ac41fadbf933c2a51be344d",
                "0x120a2a4cf30c1bf9845f20c6fe39e07ea2cce61f0c9bb048165fe5e4de877550",
                "0x111e129f1cf1097710d41c4ac70fcdfa5ba2023c6ff1cbeac322de49d1b6df7c",
                "0x103188585e2364128fe25c70558f1560f4f9350baf3959e603cc91486e110936",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa"];

      let res = await contract.callContractPair.call(input, input.length);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "0000000000000000000000000000000000000000000000000000000000000000";

      assert.equal(comparableResult,expected);
    });
    it('should return true for valid pairing of big big input', async () => {
      const contract = await AltBN128Contracts.deployed();

      let input = ["0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x275dc4a288d1afb3cbb1ac09187524c7db36395df7be3b99e673b13a075a65ec",
                "0x1d9befcd05a5323e6da4d435f3b617cdb3af83285c2df711ef39c01571827f9d",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x275dc4a288d1afb3cbb1ac09187524c7db36395df7be3b99e673b13a075a65ec",
                "0x1d9befcd05a5323e6da4d435f3b617cdb3af83285c2df711ef39c01571827f9d",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x275dc4a288d1afb3cbb1ac09187524c7db36395df7be3b99e673b13a075a65ec",
                "0x1d9befcd05a5323e6da4d435f3b617cdb3af83285c2df711ef39c01571827f9d",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x275dc4a288d1afb3cbb1ac09187524c7db36395df7be3b99e673b13a075a65ec",
                "0x1d9befcd05a5323e6da4d435f3b617cdb3af83285c2df711ef39c01571827f9d",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x090689d0585ff075ec9e99ad690c3395bc4b313370b38ef355acdadcd122975b",
                "0x12c85ea5db8c6deb4aab71808dcb408fe3d1e7690c43d37b4ce6cc0166fa7daa",
                "0x0000000000000000000000000000000000000000000000000000000000000001",
                "0x0000000000000000000000000000000000000000000000000000000000000002",
                "0x198e9393920d483a7260bfb731fb5d25f1aa493335a9e71297e485b7aef312c2",
                "0x1800deef121f1e76426a00665e5c4479674322d4f75edadd46debd5cd992f6ed",
                "0x275dc4a288d1afb3cbb1ac09187524c7db36395df7be3b99e673b13a075a65ec",
                "0x1d9befcd05a5323e6da4d435f3b617cdb3af83285c2df711ef39c01571827f9d"];

      let res = await contract.callContractPair.call(input, input.length);
      
      let comparableResult = res.map(numberToUint256).join("");
      
      let expected = "0000000000000000000000000000000000000000000000000000000000000001";

      assert.equal(comparableResult,expected);
    });
  });
});
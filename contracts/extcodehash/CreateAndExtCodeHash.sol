pragma solidity^0.5.8;

import "../Create2.sol";


contract CreateAndExtCodeHash {

    event ContractHash(bytes32);
    Create2 cr2;

    constructor() public {
        cr2 = new Create2();
    }

    function getCreatorAddress() view public returns (address) {
        address addr = address(cr2);
        return addr;
    }

	function createAndCheckExtCodeHash() public returns (bytes32){
        Contract newContract = new Contract();
        address newContractAddress = address(newContract);
        bytes32 hash = extCodeHash(newContractAddress);
        emit ContractHash(hash);
        return hash;
	}

    function createEmptyAccountAndCheckExtCodeHash() public returns (bytes32){
        bytes32 hash;
        assembly {
            let newAccount := create(0,0,0)
            hash := extcodehash(newAccount)
        }
        emit ContractHash(hash);
        return hash;
	}

    //The next function use create2 to make the created address deterministic
    function createAndRevert() public {
        bytes memory code = getContractCreation();
        cr2.createOneContract(0, code);
        revert();
    }

    function getContractCreation() public view returns (bytes memory){
        return cr2.getCreationCode();
    }

    function extCodeHash(address addr) public view returns (bytes32){
		bytes32 hash;
        assembly {
            hash := extcodehash(addr)
        }
        return hash;
	}
}

contract Contract {
    uint number = 0;
    constructor () public {
       number = 1;
    }
}
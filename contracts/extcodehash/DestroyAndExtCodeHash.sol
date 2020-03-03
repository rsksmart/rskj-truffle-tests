pragma solidity^0.5.8;

import "./SelfDestructor.sol";

contract DestroyAndExtCodeHash {

    event ContractHash(bytes32);

	function destroyAndExtCodeHash(address addr) public returns (bytes32){
        SelfDestructor sd = SelfDestructor(addr);
        sd.destroy();
        bytes32 hash = extCodeHash(addr);
        emit ContractHash(hash);
        return hash;
	}

    function extCodeHash(address addr) public view returns (bytes32){
		bytes32 hash;
        assembly {
            hash := extcodehash(addr)
        }
        return hash;
	}

    function destroyAndRevert(address addr) public {
        SelfDestructor sd = SelfDestructor(addr);
        sd.destroy();
        revert();
    }
}

pragma solidity ^0.5.15;

contract ChainID {

	function getChainId() external view returns (uint8) {
	    uint8 myid;
	    assembly {
	        myid := chainid()
	    }
	    return myid;
	}
}

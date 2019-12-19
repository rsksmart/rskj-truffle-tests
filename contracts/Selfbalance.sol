pragma solidity ^0.5.15;

contract Selfbalance {

	function getSelfbalance() external view returns (uint256) {
	    uint256 mybalance;
	    assembly {
	        mybalance := selfbalance()
	    }
	    return mybalance;
	}

	function getBalance() external view returns (uint256) {
	    return address(this).balance;
	}
}

pragma solidity ^0.5.8;

contract AltBN128Contracts {
    
    function callContractAdd(uint256 x1, uint256 y1, uint256 x2, uint256 y2) public returns (uint256[2] memory output) {
        uint256[4] memory input;
        
        input[0] = x1;
        input[1] = y1;
        input[2] = x2;
        input[3] = y2;
        
        assembly {
            if iszero(call(not(0), 0x06, 0, input, 0x80, output, 0x40)) {
                revert(0, 0)
            }
        }
    }
    
    function callContractMul(uint256 x1, uint256 y1, uint256 scalar) public returns (uint256[2] memory output) {
        uint256[3] memory input;
        
        input[0] = x1;
        input[1] = y1;
        input[2] = scalar;
        
        assembly {
            if iszero(call(not(0), 0x07, 0, input, 0x60, output, 0x40)) {
                revert(0, 0)
            }
        }
    }
    
    function callContractPair(uint[] memory input, uint lenght) public returns (uint256[1] memory output) {
        uint256 inSize = lenght*0x20;
        
        assembly {
            if iszero(call(not(0), 0x08, 0,add(input, 0x20),inSize, output, 0x20)) {
                revert(0, 0)
            }
        }
    }
}


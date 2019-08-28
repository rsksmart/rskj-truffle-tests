pragma solidity >=0.4.21 <0.6.0;

contract Recursive {
  function () external {
    assembly {
      let callSuccess := staticcall(0xFFFFFF, address, 0x01, 0x00, 0x00, 0x00)
    }
  }
}

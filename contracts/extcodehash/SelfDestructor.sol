pragma solidity^0.5.8;

contract SelfDestructor {
    function destroy() public {
        selfdestruct(msg.sender);
    }
}
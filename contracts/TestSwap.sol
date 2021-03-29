// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "./BatToken.sol";
contract TestSwap {
    
    string public name = "TestSwap Exchange";
    BatToken public token;
    uint256 public rate = 10;

    constructor(BatToken _token) public {
        token = _token;
    }

    function buyTokens() public payable{
        uint256 tokenAmount = msg.value*rate;
        token.transfer(msg.sender, tokenAmount);
    }
}
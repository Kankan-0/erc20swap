// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

import "./BatToken.sol";
contract TestSwap {
    
    string public name = "TestSwap Exchange";
    BatToken public token;
    uint256 public redemption_rate = 10;

    event TokensPurchased(
        address account,
        address token,
        uint256 amount,
        uint256 redemption_rate
    );

    event TokensSold(
        address account,
        address token,
        uint256 amount,
        uint256 redemption_rate
    );

    constructor(BatToken _token) public {
        token = _token;
    }

    function buyTokens() public payable{
        uint256 tokenAmount = msg.value*redemption_rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);
        emit TokensPurchased(msg.sender, address(token), tokenAmount, redemption_rate);
    }

    function sellTokens(uint256 _tokenAmount) public {
        require(token.balanceOf(msg.sender) >= _tokenAmount);
        uint256 etherAmount = _tokenAmount / redemption_rate;
        require(address(this).balance >= etherAmount);
        token.transferFrom(msg.sender, address(this), _tokenAmount);
        msg.sender.transfer(etherAmount);
        emit TokensSold(msg.sender, address(token), _tokenAmount, redemption_rate);
    }
}
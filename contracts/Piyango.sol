// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Piyango is Ownable {
    
    uint nonce = 0;
    address winner;
    address redeemer;
    bool winer = false;
    bool redemer = false;
    bool isOpen = false;
    uint256 private participantCount = 0;
    mapping (uint256 => address) participants;
    mapping(address => bool) isParticipant;


    function openRegisters() public onlyOwner {
        isOpen = true;
    }

    function isGameAvailable() public view returns(bool){
        return isOpen;
    }

    function register() public payable {
        require(isParticipant[msg.sender] != true);
        require(participantCount < 10);
        require(isOpen);
        require(msg.value == 10 ether);
        participantCount++;
        participants[participantCount] = msg.sender;
        isParticipant[msg.sender] = true;
        if(participantCount == 10){
            draw();
            isOpen = false;
        }
    }

    function getBalanceOfContract() public view returns(uint){
        return address(this).balance;
    }

    function draw() private {
        nonce++;
        uint256 dicefirst = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce))) % 10 + 1;
        winner = participants[dicefirst];
        nonce++;
        uint256 dicesec = uint(keccak256(abi.encodePacked(block.timestamp, block.difficulty, nonce))) % 10 + 1;
        redeemer = participants[dicesec];
    }

    function getWinner() public view returns(address) {
        return winner;
    }

    function getRedeem() public view returns(address) {
        return redeemer;
    }

    function takePrize() public payable {
        require(msg.sender == winner);
        (bool sent, ) = msg.sender.call{value: 50 ether}("");
        require(sent, "Failed to send Ether");
        winer = true;
    }

    function takeRedeem() public payable {
        require(msg.sender == redeemer);
        (bool sent, ) = msg.sender.call{value: 10 ether}("");
        require(sent, "Failed to send Ether");
        redemer = true;
    }

    function takeFunds() public payable onlyOwner {
        require(winer && redemer);
        payable(owner()).transfer(address(this).balance);
    }

    function resetGame() public onlyOwner {
        require(address(this).balance < 1 ether);
        participantCount = 0;
        winer = false;
        redemer = false;
    }
    
    fallback() external payable {

    }

    receive() external payable { 

    }
}
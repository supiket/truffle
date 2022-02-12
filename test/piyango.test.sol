pragma solidity ^0.8.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Piyango.sol";

contract PiyangoTest {

    Piyango piyango;
    address nonOwnerAccount = 0x5f922b199f7eb5259f814f3DD1764ABbB1e735a5;

    function beforeAll() public {
        piyango = new Piyango();     
    }

    function testInitialBalance() public {
        uint expected = 0;
        Assert.equal(piyango.getBalanceOfContract(), expected, "Initial balance should be 0");
    }
    
    function testNonOwnerOpenRegisters() public {
        bool r;
        (r, ) = nonOwnerAccount.call(abi.encodePacked(piyango.openRegisters.selector));
        Assert.isTrue(r, "Non-owner cannot open registers.");
    }

    // TODO: find a way to chain "call"s so that the state of the test contract is changed
    /*function testRegisterAlreadyRegistered() public {
        //(r, ) = nonOwnerAccount.call{value: 10 ether}(abi.encodePacked(piyango.register.selector));
        bool r;
        (r, ) = nonOwnerAccount.call{value: 10 ether}(abi.encodePacked(piyango.register.selector));
        Assert.isTrue(r, "Account already registered.");
    }*/

    function testRegisterMsgValueNotSatisfied() public {
        bool r;
        (r, ) = nonOwnerAccount.call(abi.encodePacked(piyango.register.selector));
        Assert.isTrue(r, "Should have sent exactly 10 ethers to register.");
    }

}

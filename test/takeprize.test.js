const Piyango = artifacts.require("Piyango")
var expectThrow =  async (promise, message) => {
    try {
        await promise;
    } catch (err) {
        return;
    }
    assert(false, message);
}

var expectSuccess =  async (promise, message) => {
    try {
        await promise;
    } catch (err) {
        assert(false, message);
    }
}

contract("Piyango", (accounts) => {

    let piyango
    let addr
    let defaultBalance

    before(async () => {
        piyango = await Piyango.deployed()
        
        addr = accounts[0].address
        piyango.winner = addr
        defaultBalance = await web3.eth.getBalance(accounts[0])
        // piyango.send(web3.utils.toWei(web3.utils.toBN("50"), "ether")).then(function(result) {
        //     console.log(web3.eth.getBalance(piyango.address))
        // });
    })

    describe("Initial Contract state", async () => { 
        it("Initial contract balance should be 0", async () => {
            const balance = await piyango.getBalanceOfContract()
            assert.equal(balance.toNumber(), 0, "The contract balance is not initially 0.")
        })
        it('Contract should be closed', async() => {
            const val = await piyango.isGameAvailable();
            assert.equal(val, false, "Account is available before openRegisters call.")
        });
    });
    describe('Opennig the game', async () => {
        let initial_balance;
        before(async () => {
            initial_balance  = await web3.eth.getBalance(accounts[1])
        });
        it('User can\'t open the game if it is not the owner.', async () => {
            await expectThrow(piyango.openRegisters.call({from: accounts[1]}), "Should throw error.");
        });
        it('Owner can open the game.', async () => {
            await expectSuccess(piyango.openRegisters.call({from: accounts[0]}), "Shouldn't throw error.");
        });
        /*it('Can be registered', async () => {
            await piyango.register({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")})
        });*/
        /*it('Account should be ready', async () => {
            const balance = await web3.eth.getBalance(accounts[1])
            console.log("Balance", balance)
            assert.notEqual(balance, 0, "It shouldn't be 0");
        });

        it("should be 10", async () => {
            const balance = await piyango.getBalanceOfContract()
            assert.equal(balance, 10e18, "The contract balance is 10.")
        })*/

        // it("account balance should increase by 50 ethers", async () => {
        //     let initialBalance = accounts[0].balance
        //     await piyango.takePrize()
            
        //     // expected value , actual value
        //     assert.equal( defaultBalance + 50 , initialBalance + 50 , "The account balance increased by 50 ethers")

        // })
    });

});



// function takePrize() public payable {
//     require(msg.sender == winner);
//     (bool sent, ) = msg.sender.call{value: 50 ether}("");
//     require(sent, "Failed to send Ether");
//     winer = true;
// }
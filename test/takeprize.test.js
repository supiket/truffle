const Piyango = artifacts.require("Piyango")

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

/*it('Account should be ready', async () => {
            const balance = await web3.eth.getBalance(accounts[1])
            console.log("Balance", balance)
            assert.notEqual(balance, 0, "It shouldn't be 0");
        });
        it('Can be registered', async () => {
            await piyango.register({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")})
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
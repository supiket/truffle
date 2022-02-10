const Piyango = artifacts.require("Piyango")

contract("Piyango", (accounts) => {

    let piyango
    let addr
    let defaultBalance

    before(async () => {
        piyango = await Piyango.deployed()
        
        addr = accounts[0].address
        piyango.winner = addr
        defaultBalance = accounts[0].balance
        // piyango.send(web3.utils.toWei(web3.utils.toBN("50"), "ether")).then(function(result) {
        //     console.log(web3.eth.getBalance(piyango.address))
        // });
    })

    describe("", async () => { 

        it("should be 0", async () => {
            const balance = await piyango.getBalanceOfContract()
            assert.equal(balance.toNumber(), 0, "The contract balance is initially 0.")
        })


        it("should be 50", async () => {
            
            await piyango.send(web3.utils.toWei(web3.utils.toBN("50"), "ether")).then(function(result) {});

            const balance = await piyango.getBalanceOfContract()
            assert.equal(balance, BigInt(50e18), "The contract balance is 50.")
        })


        // it("account balance should increase by 50 ethers", async () => {
        //     let initialBalance = accounts[0].balance
        //     await piyango.takePrize()
            
        //     // expected value , actual value
        //     assert.equal( defaultBalance + 50 , initialBalance + 50 , "The account balance increased by 50 ethers")

        // })



















        // it("should be 0", async () => {
        //     const balance = await lottery.getBalanceOfContract()
        //     assert.equal(balance.toNumber(), 0, "The contract balance is initially 0.")
        // })
        // it("should be 1", async () => {
        //     const balance = await lottery.send(accounts[1], web3.utils.toWei(web3.utils.toBN("1"), "ether"), {from: accounts[0]})
        //     console.log(balance.toNumber())
        //     assert.equal(balance.toNumber(), 1, "The contract balance is 1 after send coin.")
        // })
    });


});


// function takePrize() public payable {
//     require(msg.sender == winner);
//     (bool sent, ) = msg.sender.call{value: 50 ether}("");
//     require(sent, "Failed to send Ether");
//     winer = true;
// }
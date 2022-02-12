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
    let winner, redeemer

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
    describe('Openning the game', async () => {
        let initial_balance;
        before(async () => {
            initial_balance  = await web3.eth.getBalance(accounts[1])
        });
        it('User can\'t open the game if it is not the owner.', async () => {
            await expectThrow(piyango.openRegisters.call({from: accounts[1]}), "Should throw error.");
            const val = await piyango.isGameAvailable();
            assert.equal(val, false, "Account is available before openRegisters call from the owner.")
        });
        it('User can\'t register to the game if it closed.', async () => {
            await expectThrow(piyango.register.call({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}));
        });
        it('Owner can open the game.', async () => {
            await expectSuccess((piyango.openRegisters).call({from: accounts[0]}), "Shouldn't throw error.");
        });
        it('Game is available after owner opens it.', async _=>{
            const val = await piyango.isGameAvailable();
            await assert.equal(val, true, "Account couldn't be opened by the owner.")
        })
    });
    describe('Register', async () => {
        it('Users can\'t register if value < 10 ether.', async () => {
            await expectThrow(piyango.register({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("1"), "ether")}))
        });
        it('Users can register after the game is open.', async () => {
            await expectSuccess(piyango.register({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}))
        });
        it("should be 10", async () => {
            const balance = await piyango.getBalanceOfContract()
            assert.equal(balance, 10e18, "The contract balance is 10.")
        })
        it('Users can\'t register if they already registered.', async () => {
            await expectThrow(piyango.register({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}))
        });
        it('Other users can register.', async _=>{
            await expectSuccess(piyango.register({from: accounts[0], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}))
            for(let i = 2; i < 10; i++){
                await expectSuccess(piyango.register({from: accounts[i], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}))
            }
        })
    });
    describe('After Draw', async () => {
        it('Contract should be closed', async() => {
            const val = await piyango.isGameAvailable();
            assert.equal(val, false, "Account is available after draw call.")
        });
        it('Winner is one of the participants', async() => {
            winner = await piyango.getWinner();
            assert.include(accounts, winner, "Winner is not a participant");
        });
        it('Redeemer is one of the participants', async() => {
            redeemer = await piyango.getRedeem();
            assert.include(accounts, redeemer, "Redeemer is not a participant");
        });
    });

    describe('Get money' ,async _=>{
        it("Owner can't get funds before winner and redeemer.", async _=>{
            await expectThrow(piyango.takeFunds({from: accounts[0]}))
        })
        it("A user can't get prize if it is not the winner.", async _=>{
            const notWinner = accounts.filter(a=>a!==winner)
            const n = Math.round(Math.random()*8)
            await expectThrow(piyango.takePrize({from: notWinner[n]}))
        })
        it("A user can't get redeem if it is not the redeemer.", async _=>{
            const notRedeemer = accounts.filter(a=>a!==redeemer)
            const n = Math.round(Math.random()*8)
            await expectThrow(piyango.takeRedeem({from: notRedeemer[n]}))
        })
        it("Winner can get the prize.", async _=>{
            await expectSuccess(piyango.takePrize({from: winner}))
        })
        it("Redeemer can get the prize.", async _=>{
            await expectSuccess(piyango.takeRedeem({from: winner}))
        })
        it("A user can't get funds if it is not the owner.", async _=>{
            const notOwner = accounts.filter(a=>a!==accounts[0])
            const n = Math.round(Math.random()*8)
            await expectThrow(piyango.takeFunds({from: notOwner[n]}))
        })
        it("Winner can get the funds.", async _=>{
            await expectSuccess(piyango.takeFunds({from: accounts[0]}))
        })
    })

    describe('Reseting the game', async () => {
        it('User can\'t reset the game if it is not the owner.', async () => {
            await expectThrow(piyango.resetGame.call({from: accounts[1]}), "Should throw error.");
            const val = await piyango.isGameAvailable();
            assert.equal(val, false, "Account is available before resetGame call from the owner.")
        });
        it('User can\'t register to the game if it closed.', async () => {
            await expectThrow(piyango.register.call({from: accounts[1], value:web3.utils.toWei(web3.utils.toBN("10"), "ether")}));
        });
        it('Owner can open the game.', async () => {
            await expectSuccess((piyango.resetGame).call({from: accounts[0]}), "Shouldn't throw error.");
        });
        it('Game is available after owner opens it.', async _=>{
            const val = await piyango.isGameAvailable();
            await assert.equal(val, true, "Account couldn't be opened by the owner.")
        })
    });


});

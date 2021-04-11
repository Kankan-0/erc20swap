const TestSwap = artifacts.require("./TestSwap.sol");
const BatToken = artifacts.require("./BatToken.sol");

function tokens(params) {
    return web3.utils.toWei(params, 'ether');
}

contract("testSwap functionality tests", accounts => {
    describe("Unit test", ()=>{
        let testSwap,batToken,initialSupply;
        before(async() => {
            initialSupply = tokens("1000000");
            batToken = await BatToken.deployed();
            testSwap = await TestSwap.deployed(batToken.address);
        })
        describe("Exchange contract deployment", ()=> {
            
            it("Contract should have a name", async () => {
                const name = await testSwap.name();
                assert.equal(name, 'TestSwap Exchange');
            });
            it ("Contract should have tokens", async () => {
    
                assert.equal((await batToken.balanceOf(accounts[0])).toString(), 0);
                assert.equal((await batToken.balanceOf(testSwap.address)).toString(), initialSupply);
    
            })
        })
      
        describe("Token contract deployment", ()=> {
            it("Contract should have a name", async () => {
                // const batToken = await BatToken.deployed();
    
                const name = await batToken.name();
                assert.equal(name, 'BAT Token');
            });
        })
    
        describe("Token buying/selling facility should work", ()=>{
            it("Users are allowed to buy the tokens at a fixed rate", async ()=>{
                const investorAccount = accounts[1]
                const investorBalanceBefore = await batToken.balanceOf(investorAccount);
                const exchangeBalanceBefore = await batToken.balanceOf(testSwap.address)
                assert.equal(investorBalanceBefore.toString(), tokens('0'))
                assert.equal(exchangeBalanceBefore.toString(), initialSupply);
                const eventEmitted = await testSwap.buyTokens({from: investorAccount, value: tokens('1')})
                const investorBalanceAfter = await batToken.balanceOf(investorAccount);
                const exchangeBalanceAfter = await batToken.balanceOf(testSwap.address)
                assert.equal(exchangeBalanceAfter.toString(), tokens('999990'))
                assert.equal(investorBalanceAfter.toString(), tokens('10'));

                assert.equal(eventEmitted.logs.length, 1);
                assert.equal(eventEmitted.logs[0].args.account, investorAccount);
                assert.equal(eventEmitted.logs[0].args.token, batToken.address);
                assert.equal(eventEmitted.logs[0].args.amount.toString(), tokens('10'));
                assert.equal(eventEmitted.logs[0].args.redemption_rate.toString(), 10);
            })

            it("Users are allowed to sell the tokens at a fixed rate", async ()=>{
                const investorAccount = accounts[1]
                batToken.approve(testSwap.address, tokens('6'), {from: investorAccount})
                const investorBalanceBefore = await batToken.balanceOf(investorAccount);
                assert.equal(investorBalanceBefore.toString(), tokens('10'));
                const eventEmitted = await testSwap.sellTokens(tokens('6'), {from: investorAccount})
                const investorBalanceAfter = await batToken.balanceOf(investorAccount);
                assert.equal(investorBalanceAfter.toString(), tokens('4'));

                assert.equal(eventEmitted.logs.length, 1);
                assert.equal(eventEmitted.logs[0].args.account, investorAccount);
                assert.equal(eventEmitted.logs[0].args.token, batToken.address);
                assert.equal(eventEmitted.logs[0].args.amount.toString(), tokens('6'));
                assert.equal(eventEmitted.logs[0].args.redemption_rate.toString(), 10);
            })
        })
    })
});

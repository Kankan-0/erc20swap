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
    
        describe("Token buying facility should work", ()=>{
            it("Users are allowed to buy the tokens at a fixed rate", async ()=>{
                await testSwap.buyTokens({from: accounts[1], value: web3.utils.toWei('1')})
                let investorBalance = await batToken.balanceOf(accounts[1]);
                assert.equal(investorBalance.toString(), tokens('10'));
            })
        })
    })
});

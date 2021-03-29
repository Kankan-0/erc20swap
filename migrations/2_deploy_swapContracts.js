
const TestSwap = artifacts.require("TestSwap")
const BatToken = artifacts.require("BatToken")


module.exports = async (deployer) => {
    const initialSupply = web3.utils.toWei("1000000");
    // deploy the Bat token contract with an initial supply of 10000    
    await deployer.deploy(BatToken, initialSupply);
    const batToken = await BatToken.deployed();
    
    await deployer.deploy(TestSwap, batToken.address);
    const testSwap = await TestSwap.deployed();
    // transfer all the tokens to the exchange
    await batToken.transfer(testSwap.address, initialSupply);
}
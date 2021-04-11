import React, { Component } from "react";
import logo from "../logo.png";
import "./App.css";
import getWeb3 from "./getWeb3";
import Navbar from "./Navbar";

import Main from './Main'
import TokenSwap from "../abis/TestSwap.json";
import Token from "../abis/BatToken.json";

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      ethBalance: '',
      tokenBalance:'',
      token: {},
      testSwap: {},
      loading: true
    }
  }
  componentDidMount = async () => {
    try {
      window.web3 = await getWeb3();
      await this.loadBlockchainData();
    } catch (e) {}
  };

  loadBlockchainData = async () => {
    const web3 = window.web3

    const accounts = await web3.eth.getAccounts()
    const ethBalance = await web3.eth.getBalance(accounts[0])
    this.setState({account: accounts[0], ethBalance})

    // Load BatToken
    const networkId = await web3.eth.net.getId();
    const tokenData = Token.networks[networkId]
    if (tokenData) {
      const token = await new web3.eth.Contract(Token.abi, tokenData.address)
      let tokenBalance = await token.methods.balanceOf(this.state.account).call()
      this.setState({token, tokenBalance: tokenBalance.toString()})
    }
    else {
      window.alert('Token not deployed to the selected network')
    }

    // Load TestSwap
    const testSwapData = TokenSwap.networks[networkId]
    if (testSwapData) {
      const testSwap = await new web3.eth.Contract(TokenSwap.abi, testSwapData.address)
      this.setState({testSwap})
    }
    else {
      window.alert('EthSwap contract not deployed to detected network.')
    }
    this.setState({ loading: false })
  }
  buyTokens = (etherAmount) => {
    this.setState({ loading: true })
    this.state.testSwap.methods.buyTokens().send({ value: etherAmount, from: this.state.account }).on('transactionHash', async (hash) => {
      await this.refreshBalance()
      this.setState({ loading: false })
    })
  }
  
  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.testSwap._address, tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.testSwap.methods.sellTokens(tokenAmount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }


  refreshBalance = async () => {
    const tokenBalance = await this.state.token.methods.balanceOf(this.state.account).call()
    const accounts = await window.web3.eth.getAccounts()
    const ethBalance = await window.web3.eth.getBalance(accounts[0])
    this.setState({ethBalance, tokenBalance})
  }
  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main
        ethBalance={this.state.ethBalance}
        tokenBalance={this.state.tokenBalance}
        buyTokens={this.buyTokens}
        sellTokens={this.sellTokens}
      />
    }
    return (
      <div>
        <Navbar account = {this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                {content}
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

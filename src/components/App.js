import React, { Component } from 'react';
import Web3 from 'web3';
import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';

/*
  1. Realizar la conexión con Metamask y la BlockChain con la que se está trabajandoweb3.currentProvider
  2. Importar el Contrato inteligente 
*/

class App extends Component {
  
  async componentWillMount(){//life cycle method

    await this.cargarWeb3();
    //console.log(window.web3);
    await this.cargarDatosBlockchain();
  }

  async cargarWeb3(){
    //Detectando MetaMask en el navegador
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);//se crea la conexión implementando web3
      await window.ethereum.enable();

    }
    // otros navegadores
    else if (window.web3) {
        window.web3 = new Web3(window.web3.currentProvider);
    }
    // Non-dapp browsers...
    else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
  }

  async cargarDatosBlockchain(){
    const web3 = window.web3;
    //cargar cuenta
    const accounts = await web3.eth.getAccounts();
    //console.log(accounts);
    this.setState({account: accounts[0]});

    const networkId = await web3.eth.net.getId();
    //console.log(networkId);
    const networkData = Marketplace.networks[networkId];//se verifica la red donde se despliega el contrato

    if(networkData){//
      const marketplace = web3.eth.Contract(Marketplace.abi, Marketplace.networks[networkId].address);
    }else {
        window.alert("contrato no desplegado para la red detectada");
    }
    
    //console.log(Marketplace.abi, Marketplace.networks[5777].address);
  }
  
constructor(props){
  super(props);
  this.state = {
    account: '',
    productCount: 0,
    products: [],
    loading: true
  }
}

  render() {
    return (
      <div>
        <Navbar account ={this.state.account}/>
        
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <p>{this.state.account}</p>
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;

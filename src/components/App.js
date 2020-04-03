import React, { Component } from 'react';
import Web3 from 'web3';
//import logo from '../logo.png';
import './App.css';
import Marketplace from '../abis/Marketplace.json';
import Navbar from './Navbar';
import Main from './Main';

/*
  1. Realizar la conexión con Metamask y la BlockChain con la que se está trabajandoweb3.currentProvider
  2. Importar el Contrato inteligente
  3. Realizar la capa UI
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
      this.setState({marketplace});
      const productCount = await marketplace.methods.productCount().call();
      this.setState({productCount});
      //console.log(productCount);
      //cargar productos
      for(var i = 1; i <= productCount; i++){
        const product = await marketplace.methods.products(i).call();
        this.setState({
          products: [...this.state.products, product]
        });
      }
      this.setState({loading: false});
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
  this.createProduct = this.createProduct.bind(this);
  this.purchaseProduct = this.purchaseProduct.bind(this);
}

    createProduct(nombre, precio){//función para capturar los datos de un producto y enviarlo al almacenamiento
      this.setState({loading:true});
      this.state.marketplace.methods.createProduct(nombre, precio).send({from: this.state.account})
      .once('receipt', (receipt) => {
        this.setState({loading: false});
      });
    }

    purchaseProduct(id, precio){//función para la venta de productos
      this.setState({loading:true});
      this.state.marketplace.methods.purchaseProduct(id).send({from: this.state.account, value: precio})
      .once('receipt', (receipt) => {
        this.setState({loading: false});
      });
    }

  render() {
    return (
      <div>
        <div>
          <Navbar account ={this.state.account}/>
          <div className="container-fluid mt-5">
              <div className="row">
                {this.state.loading ? 
                  "Cargando..." : 
                  <Main 
                  products={this.state.products}
                  createProduct={this.createProduct}
                  purchaseProduct={this.purchaseProduct}/>
                }
              </div>
          </div>
        </div>
        
      </div>
       );
  }
}

export default App;

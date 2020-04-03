import React, { Component } from 'react';


class Main extends Component {
  
  render() {
    return (
      <div>
        <div id="content">
          <h1>Agregar Producto</h1>
        </div>
          <form onSubmit={(event) => {
            event.preventDefault()
            const nombre = this.productName.value
            const precio = window.web3.utils.toWei(this.productPrice.value.toString(), 'Ether'); 
            this.props.createProduct(nombre, precio)
          }}>
            <div className="form-group">
              <label >Nombre de producto</label>
              <input ref={(input) => {this.productName=input}} type="text" className="form-control" id="formGroupExampleInput" placeholder="Iphone" required />
            </div>
            <div className="form-group">
              <label >Precio de producto</label>
              <input ref={(input) => {this.productPrice=input}} type="text" className="form-control" id="formGroupExampleInput2" placeholder="1000" required />
            </div>
            <button type="submit" className="btn btn-primary mb-2">Confirmar</button>
          </form>
          <p> </p>
          <h2>Comprar producto</h2>
          <table className="table">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Producto</th>
                <th scope="col">Precio</th>
                <th scope="col">Propietario</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody id="productList">
              {this.props.products.map((product, key) =>{
                return(
                  <tr key={key}>
                    <th scope="row">{product.id.toString()}</th>
                    <td>{product.name}</td>
                    <td>{window.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td>
                    <td>{product.owner}</td>
                    <td>
                      {!product.purchased? 
                        <button className="buyButton" 
                        id={product.id}
                        value={product.price}
                        onClick={(event) =>{
                          this.props.purchaseProduct(event.target.id, event.target.value)
                        }}>
                          Comprar
                        </button> 
                      :null}
                    </td>
                  </tr>
                )
              })}
              
            </tbody>
          </table>
      </div>
    );
  }
}

export default Main;
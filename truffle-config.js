require('babel-register');
require('babel-polyfill');

/*conecta este proyecto con una red BlockChain, en este caso con la red Blockchain local de Ganache
 la cual esta conectada por la direccion ip señalada en el atributo host y el puerto 7545*/
module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}

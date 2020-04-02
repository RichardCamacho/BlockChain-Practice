const Marketplace = artifacts.require("./Marketplace.sol");

//tourist churn analyst course spatial camera poet member act tuition common cousin
//SC = smart contract
//Este js se emplea para verificar que el contrato pueda ser deplegado en la red blockchain

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace' , ([deployer, seller, buyer]) => {
    let marketplace //variable para almacenar el estado del SC

    before(async () => {
        marketplace = await Marketplace.deployed()
    });

    describe('deployment' , async () =>{
        it('deploys successfully' , async () => {
            const address = await marketplace.address //se toma la direccion del SC
            //se verifica que esta exista, que no sea nula o que esté vacía
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        });

        it('has a name' , async () =>{
            const name = await marketplace.nombre()
            assert.equal(name, 'Contrato de prueba')   
        });
    });

    describe('products' , async () =>{
        let result, productCount

        before(async () => {
            result = await marketplace.createProduct('iPhone X', web3.utils.toWei('1', 'Ether'), {from: seller})
            //From: seller => indica quien realiza la acción
            productCount = await marketplace.productCount()
        });

        it('creates products' , async () =>{
            
            assert.equal(productCount, 1) 
            //console.log(result.logs);  
            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'correcto')
            assert.equal(event.name,'iPhone X', 'nombre correcto')
            assert.equal(event.price,'1000000000000000000', 'precio correcto')
            assert.equal(event.owner, seller, 'propietario correcto')
            assert.equal(event.purchased, false, 'vendido correcto')

            //fallas
            //debe tener un nombre
             await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), {from: seller}).should.be.rejected;
            //debe tener un precio
             await marketplace.createProduct('iPhone X', 0, {from: seller}).should.be.rejected;
        });

        it('lists products', async () => {
            const product = await marketplace.products(productCount)
            assert.equal(product.id.toNumber(), productCount.toNumber(), 'correcto')
            assert.equal(product.name,'iPhone X', 'nombre correcto')
            assert.equal(product.price,'1000000000000000000', 'precio correcto')
            assert.equal(product.owner, seller, 'propietario correcto')
            assert.equal(product.purchased, false, 'vendido correcto')

        });

        it('sells products', async () => {
           
            let oldSellerBalance = await web3.eth.getBalance(seller);
            oldSellerBalance = new web3.utils.BN(oldSellerBalance);

            //el comprador realiza la actividad exitosamente
            result = await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1', 'Ether')})

            const event = result.logs[0].args
            assert.equal(event.id.toNumber(), productCount.toNumber(), 'correcto')
            assert.equal(event.name,'iPhone X', 'nombre correcto')
            assert.equal(event.price,'1000000000000000000', 'precio correcto')
            assert.equal(event.owner, buyer, 'propietario correcto')
            assert.equal(event.purchased, true, 'vendido correcto')

            //verificar que el vendedor recibió el pago
            let newSellerBalance = await web3.eth.getBalance(seller);
            newSellerBalance = new web3.utils.BN(newSellerBalance);

            let price = web3.utils.toWei('1', 'Ether');
            price = new web3.utils.BN(price);

            //console.log(oldSellerBalance, newSellerBalance, price);
            
            //ERROR
            await marketplace.purchaseProduct(99,{from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('0.5', 'Ether')}).should.be.rejected;
            await marketplace.purchaseProduct(productCount,{from: deployer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            await marketplace.purchaseProduct(productCount,{from: buyer, value: web3.utils.toWei('1', 'Ether')}).should.be.rejected;
            
        });

    });

})
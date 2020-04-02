pragma solidity >=0.5.0 <0.7.0;

contract Marketplace{

    string public nombre;
    //para almacenar cuantos productos hay en la estructura
    uint public productCount = 0;
    //estructura para almacenar los productos
    mapping(uint => Product) public products;


    //modelo de un producto
    struct Product{
        uint id;
        string name;
        uint price;
        address payable owner;
        bool purchased;
    }

    event ProductCreated(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    event ProductPurchased(
        uint id,
        string name,
        uint price,
        address payable owner,
        bool purchased
    );

    constructor() public{
        nombre = "Contrato de prueba";
    }

    function createProduct(string memory _name, uint _price) public {
            //verificar que los parametros son correctos
            require(bytes(_name).length > 0,'');
            require(_price > 0,'');

            //Incrementar el contador
            productCount++;
            //Crear el producto
            products[productCount] = Product(productCount, _name, _price, msg.sender, false);
            //Disparar o ejecutar un evento
            emit ProductCreated(productCount, _name, _price, msg.sender, false);
    }

    function purchaseProduct(uint _id) public payable{//payable: marca la funcion para hacer transferencias
        //obtener el producto
        Product memory _product = products[_id];//se hace una copia temporal del producto
        //obtener el propietario/venderdor
        address payable _seller = _product.owner;
        //validando la venta
        require(_product.id > 0 && _product.id <= productCount, '');//el producto tiene un id valido
        require(msg.value >= _product.price, '');//lo dispuesto a pagar es suficiente para adquirir el producto
        require(!_product.purchased, '');//verificar que el producto no ha sido vendido
        require(msg.sender != _seller, '');//el comprador no es el mismo vendedor

        //transferir la propiedad del producto
        _product.owner = msg.sender;//el nuevo dueño será quien llame a la función
        //marcar la venta del producto
        _product.purchased = true;
        //actualizar el producto
        products[_id] = _product;
        //pagar al vendedor
        address(_seller).transfer(msg.value);
        //Disparar el evento
        emit ProductPurchased(productCount, _product.name, _product.price, msg.sender, true);
    }
}


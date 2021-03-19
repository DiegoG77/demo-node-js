const express = require("express");

const cart = require("./json/cart-654.json");
const category = require("./json/category-all.json");
const products = require("./json/product-all.json");

const fs = require('fs');

const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/static' ));
app.use(express.json());

app.get("/carrito", (req, res) => {
    res.send(cart);
});

app.get("/categorias", (req, res) => {
    res.send(category);
});

app.get("/productos", (req, res) => {
    res.send(products);
});

app.post('/compra', function (req, res) {

    let purchaseString =
        
    `Fecha: ${req.body.fecha}
    Usuario: ${req.body.usuario}

    Datos de envío:
    País: ${req.body.pais}
    Ciudad: ${req.body.ciudad}
    Calle: ${req.body.calle}
    Número de puerta: ${req.body.nPuerta}
    Código postal: ${req.body.codigoPostal}
    `;

    if (req.body.tipoDeEnvio == "5") {

        purchaseString += 
        `Tipo de Envío: Standard
        `;
    }else if (req.body.tipoDeEnvio == "7") {

        purchaseString +=
        `Tipo de Envío: Express
        `;
    }else if (req.body.tipoDeEnvio == "15") {

        `Tipo de Envío: Premium
        `;
    }

    if (req.body.met == "1") {

    purchaseString +=`
    Datos de pago:
    Número de tarjeta: ${req.body.nombre}
    Nombre: ${req.body.nombre}
    Apellido: ${req.body.apellido}
    `;    
    }else if (req.body.met == "2") {

    purchaseString +=`
    Datos de pago:
    Banco: ${req.body.nBanco}
    Número de cuenta: ${req.body.nCuenta}
    Nombre: ${req.body.tNombre}
    Apellido: ${req.body.tApellido}
    `;

    }

    purchaseString += 
    `
    Total: 
    ${req.body.totalConEnvio} 
    (Productos: ${req.body.total} + Costo de envío: ${req.body.costoDeEnvio}) 

    Productos comprados:
    `;

    for (let i = 0; i < req.body.productos.length; i++) {
        const array = req.body.productos[i];
        
        purchaseString +=
        `${array.nombreP} (${array.cantidad}) subtotal: ${array.precio}. `;
    }

    purchaseString += `
    

    
    `;



    fs.appendFile("new purchase.txt", purchaseString, function (err) {
        if(err) {
            console.log(err);
            res.send({
                mensaje: "Ha ocurrido un error: " + err
            });
        }else{
            console.log("Archivo guardado");
            res.send({
                mensaje: "Tu compra ha sido realizada con exito, serás redirigido a la página de productos"
            });
        }
    });
});

app.listen(port, () => {
    console.log("Escuchando solicitudes a http://localhost:" + port);
});

var express = require('express');
var router = express.Router();
var consultas = require('../models/consultas')
var cloudinary = require('cloudinary').v2;
var nodemailer = require('nodemailer');

router.get('/productos', async function (req, res, next) {

    var productos = await consultas.getProductos();

    productos = productos.map(productos => {
        if (productos.img_id) {
            const imagen = cloudinary.url(productos.img_id, {
                width: 250,
                height: 250,
                crop: 'fill'
            });
            return {
                ...productos,
                imagen
            }
        } else {
            return {
                ...productos,
                imagen: ''
            }
        }
    })

    res.json(productos);

});

router.get('/inicio', async function (req, res, next) {

    var inicio = await consultas.getInicio();

    inicio = inicio.map(inicio => {
        if (inicio.img_id) {
            const imagen = cloudinary.url(inicio.img_id, {
                width: 900,
                crop: 'fill'
            });
            return {
                ...inicio,
                imagen
            }
        } else {
            return {
                ...inicio,
                imagen: ''
            }
        }
    })

    res.json(inicio);

});

router.get('/nosotros', async function (req, res, next) {

    var nosotros = await consultas.getNosotros();

    nosotros = nosotros.map(nosotros => {
        if (nosotros.img_id) {
            const imagen = cloudinary.url(nosotros.img_id, {
                width: 300,
                crop: 'fill'
            });
            return {
                ...nosotros,
                imagen
            }
        } else {
            return {
                ...nosotros,
                imagen: ''
            }
        }
    })

    res.json(nosotros);

});

router.post('/contacto', async (req, res) => {
    const mail = {
        to: 'sergasgoi@hotmail.com',
        subject: 'Contacto web',
        html: `La persona ${req.body.nombre} <br>
        con correo: ${req.body.email} <br>
        y telefono: ${req.body.telefono} <br> 
        Envio el siguiente mensaje: ${req.body.mensaje}`
    }

    const transport = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth:{
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    })

    await transport.sendMail(mail);

    res.status(201).json({
        error:false,
        message: 'Mensaje Enviado'
    })
})


module.exports = router;
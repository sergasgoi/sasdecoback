var express = require('express');
var router = express.Router();
var consultas = require('../../models/consultas')
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);


router.get('/', async function (req, res, next) {

    var productos = await consultas.getProductos();

    productos = productos.map(productos => {
        if (productos.img_id) {
            const imagen = cloudinary.image(productos.img_id, {
                width: 180,
                height: 180,
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

    res.render('admin/productos', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        productos
    });
});

router.get('/agregar', function (req, res, next) {
    res.render('admin/agregar', {
        layout: 'admin/layout'
    });
});

router.get('/editar/:id', async function (req, res, next) {

    var id = req.params.id;
    var data = await consultas.getProductosById(id);

    res.render('admin/editar', {
        layout: 'admin/layout',
        data
    });

});

router.get('/delete/:id', async function (req, res, next) {

    let producto = await consultas.getProductosById(req.params.id);
    if (producto.img_id) {
        await (destroy(producto.img_id));
    }


    await consultas.deleteProductos(req.params.id);
    res.redirect('/admin/productos');

});

router.post('/agregar', async function (req, res, next) {


    try {
        var imagen = '';
        if (req.body.titulo != "" && req.body.precio != "" && req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
            await consultas.insertProductos({
                ...req.body,
                img_id
            });
            res.redirect('/admin/productos');
        } else {
            img_id = null;
            res.render('admin/agregar', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        });
    }

});

router.post('/editar', async function (req, res, next) {

    try {

        let img_id = req.body.img_original;
        let borrar_img_vieja = false;

        if (req.body.img_delete === "1") {
            img_id = null;
            borrar_img_vieja = true;
        } else {
            if (req.files && Object.keys(req.files).length > 0) {
                imagen = req.files.imagen;
                img_id = (await uploader(imagen.tempFilePath)).public_id;
                borrar_img_vieja = true;
            }
        }
        if (borrar_img_vieja && req.body.img_original) {
            await (destroy(req.body.img_original));
        }



        var obj = {
            titulo: req.body.titulo,
            precio: req.body.precio,
            img_id
        }

        await consultas.editProductos(obj, req.body.id);
        res.redirect('/admin/productos');

    } catch (error) {
        console.log(error);
        res.render('admin/editar', {
            layout: 'admin/layout',
            error: true,
            message: 'No se edito'
        });
    }

});





module.exports = router;
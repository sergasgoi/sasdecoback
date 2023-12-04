var express = require('express');
var router = express.Router();
var consultas = require('../../models/consultas')
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {

    var inicio = await consultas.getInicio();

    inicio = inicio.map(inicio => {
        if (inicio.img_id) {
            const imagen = cloudinary.image(inicio.img_id, {
                width: 400,
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

    res.render('admin/inicio', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        inicio
    });
});

router.get('/agregar', function (req, res, next) {
    res.render('admin/agregarin', {
        layout: 'admin/layout'
    });
});

router.post('/agregar', async function (req, res, next) {

    try {
        var imagen = '';
        if (req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
            await consultas.insertInicio({
                ...req.body,
                img_id
            });
            res.redirect('/admin/inicio');
        } else {
            img_id = null;
            res.render('admin/agregarin', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregarin', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        });
    }

});

router.get('/editar/:id', async function (req, res, next) {

    var id = req.params.id;
    var data = await consultas.getInicioById(id);

    res.render('admin/editarin', {
        layout: 'admin/layout',
        data
    });

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
            img_id
        }

        await consultas.editInicio(obj, req.body.id);
        res.redirect('/admin/inicio');

    } catch (error) {
        console.log(error);
        res.render('admin/editarin', {
            layout: 'admin/layout',
            error: true,
            message: 'No se edito'
        });
    }

});

router.get('/delete/:id', async function (req, res, next) {

    let producto =  await consultas.getInicioById(req.params.id);
    if(producto.img_id){
        await (destroy(producto.img_id));
    }


    await consultas.deleteInicio(req.params.id);
    res.redirect('/admin/inicio');

});


module.exports = router;

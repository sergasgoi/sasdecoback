var express = require('express');
var router = express.Router();
var consultas = require('../../models/consultas')
var util = require('util');
var cloudinary = require('cloudinary').v2;
const uploader = util.promisify(cloudinary.uploader.upload);
const destroy = util.promisify(cloudinary.uploader.destroy);

router.get('/', async function (req, res, next) {

    var nosotros = await consultas.getNosotros();

    nosotros = nosotros.map(nosotros => {
        if (nosotros.img_id) {
            const imagen = cloudinary.image(nosotros.img_id, {
                width: 300,
                height: 300,
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

    res.render('admin/nosotros', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        nosotros
    });
});

router.get('/agregar', function (req, res, next) {
    res.render('admin/agregarnos', {
        layout: 'admin/layout'
    });
});

router.post('/agregar', async function (req, res, next) {


    try {
        var imagen = '';
        if (req.body.titulo != "" && req.body.leyenda != "" && req.files && Object.keys(req.files).length > 0) {
            imagen = req.files.imagen;
            img_id = (await uploader(imagen.tempFilePath)).public_id;
            await consultas.insertNosotros({
                ...req.body,
                img_id
            });
            res.redirect('/admin/nosotros');
        } else {
            img_id = null;
            res.render('admin/agregarnos', {
                layout: 'admin/layout',
                error: true,
                message: 'Todos los campos son requeridos'
            });
        }
    } catch (error) {
        console.log(error);
        res.render('admin/agregarnos', {
            layout: 'admin/layout',
            error: true,
            message: 'No se cargo la novedad'
        });
    }

});

router.get('/editar/:id', async function (req, res, next) {

    var id = req.params.id;
    var data = await consultas.getNosotrosById(id);

    res.render('admin/editarnos', {
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
            img_id,
            titulo: req.body.titulo,
            leyenda: req.body.leyenda
        }

        await consultas.editNosotros(obj, req.body.id);
        res.redirect('/admin/nosotros');

    } catch (error) {
        console.log(error);
        res.render('admin/editarnos', {
            layout: 'admin/layout',
            error: true,
            message: 'No se edito'
        });
    }

});

router.get('/delete/:id', async function (req, res, next) {

    let nosotros = await consultas.getNosotrosById(req.params.id);
    if (nosotros.img_id) {
        await (destroy(nosotros.img_id));
    }


    await consultas.deleteNosotros(req.params.id);
    res.redirect('/admin/nosotros');

});


module.exports = router;

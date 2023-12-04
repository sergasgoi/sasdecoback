var pool = require('./bd');

async function getProductos() {
    var query = 'select * from productos order by id asc';
    var datos = await pool.query(query);
    return datos;

}

async function getInicio() {
    var query = 'select * from inicio';
    var datos = await pool.query(query);
    return datos;

}

async function getNosotros() {
    var query = 'select * from nosotros';
    var datos = await pool.query(query);
    return datos;

}



async function insertProductos(obj){
    try{
        var query = 'insert into productos set ?';
        var datos = await pool.query(query, [obj]);
        return datos;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function insertInicio(obj){
    try{
        var query = 'insert into inicio set ?';
        var datos = await pool.query(query, [obj]);
        return datos;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function insertNosotros(obj){
    try{
        var query = 'insert into nosotros set ?';
        var datos = await pool.query(query, [obj]);
        return datos;
    }
    catch(error){
        console.log(error);
        throw error;
    }
}

async function getProductosById(id){

    var query = 'select * from productos where id=?';
    var datos = await pool.query(query, [id]);
    return datos[0];

}

async function getInicioById(id){

    var query = 'select * from inicio where id=?';
    var datos = await pool.query(query, [id]);
    return datos[0];

}

async function getNosotrosById(id){

    var query = 'select * from nosotros where id=?';
    var datos = await pool.query(query, [id]);
    return datos[0];

}

async function editProductos(obj, id){

    var query = 'update productos set ? where id=?';
    var datos = await pool.query(query, [obj, id]);
    return datos;

}

async function editInicio(obj, id){

    var query = 'update inicio set ? where id=?';
    var datos = await pool.query(query, [obj, id]);
    return datos;

}

async function editNosotros(obj, id){

    var query = 'update nosotros set ? where id=?';
    var datos = await pool.query(query, [obj, id]);
    return datos;

}

async function deleteProductos(id){
    var query = 'delete from productos where id=?';
    var datos = await pool.query(query, [id]);
    return datos;
}

async function deleteInicio(id){
    var query = 'delete from inicio where id=?';
    var datos = await pool.query(query, [id]);
    return datos;
}

async function deleteNosotros(id){
    var query = 'delete from nosotros where id=?';
    var datos = await pool.query(query, [id]);
    return datos;
}

module.exports = {getProductos, insertProductos, getProductosById, editProductos, deleteProductos, getInicio, insertInicio, getInicioById, editInicio, deleteInicio, getNosotros, insertNosotros, getNosotrosById, editNosotros, deleteNosotros};
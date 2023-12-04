var pool = require('./bd');
var md5 = require('md5')

async function getUser(user, password){
    try{
        var query = 'select * from usuarios where usuario = ? and password = ? limit 1';
        var datos = await pool.query(query, [user, md5(password)]);
        return datos[0];
    }catch(error){
        console.log(error);
    }

}


module.exports = {getUser};
const mysql=require('mysql2');
const db=mysql.createPool({
    host:'127.0.0.1',
    user:'root',
    password:'cf20030524',
    database:'gameweb',
})
db.query('select 1',(err,results)=>{
    if(err) return console.log(err.message)
    console.log('数据库连接成功！!')
})
module.exports=db;
const db=require('../db/index')
module.exports=(req,res,next)=>{
    if(/html/.test(req.path)){
        const mysql_str = 'insert into visit_log set router=?,ip=?'
        db.query(mysql_str,[req.path,req.ip],(err,results)=>{
            if(err) {
                console.log(err.message)
            }
            else if(results.affectedRows!==1){
                console.log('操作数据库失败')
            }
            else{
                //console.log('有人访问系统啦！')
            }
        })
    }
    if(/op/.test(req.path)){
        //console.log(req);
        /*
        const mysql_str = 'insert into operate set router=?,ip=?'
        db.query(mysql_str,[req.path,req.ip],(err,results)=>{
            if(err) {
                console.log(err.message)
            }
            else if(results.affectedRows!==1){
                console.log('操作数据库失败')
            }
            else{
                //console.log('有人访问系统啦！')
            }
        })*/ 
    }
    next();
}
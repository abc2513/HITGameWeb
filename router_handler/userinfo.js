const db=require('../db/index')
var danger_char=RegExp(
    /[(\')(\")(\<)]+/
);
exports.getUserInfo=(req,res)=>{
    const sql=`select * from users where userID=?`
    db.query(sql,req.user.userID,(err,results)=>{
        if(err)return res.cc(err)
        if(results.length!==1)return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message:'获取用户信息成功！',
            data:results[0]
        })
    })
}//获取用户信息
exports.updateUserInfo=(req,res)=>{
    //name\password\email特殊字符检查
    //if(danger_char.test(req.body.name))
        //res.cc('name不能含有英文引号、左尖角括号');
    //if(danger_char.test(req.body.password))
        //res.cc('password不能含有英文引号、左尖角括号');
    //if(danger_char.test(req.body.email))
        //res.cc('email不能含有英文引号、左尖角括号');
    const sql=`update users set email=?, name=? where userID=?`
    db.query(sql,[req.body.email,req.body.name,req.user.userID],(err,results)=>{
        if(err) return res.cc(err);
        if(results.affectedRows!==1)return res.cc('更新用户信息失败！')
        res.cc('更新用户信息成功',0)
    })


}//更新用户信息
exports.create_article=(req,res)=>{ 
    var sqlStr='select * from article where authorID=?'
    db.query(sqlStr,req.user.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length>=2){
            return res.send({status:1,message:' 用户文章上限暂时为2'})
        }
        else{
            var sqlStr2='select * from article where title=?'
            db.query(
                sqlStr2,req.body.title,(err,results)=>{
                if(err){
                    return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                }
                if(results.length>=1){
                    return res.send({status:1,message:' 存在一篇同名的文章！'})
                }
                else{    
                    console.log("trying to create article!");
                    const mysql_str = 'insert into article set ?'
                    db.query(mysql_str,{title:req.body.title,kind:req.body.kind,article_status:req.body.article_status,data:req.body.data,authorID:req.user.userID},(err,results)=>{
                        if(err) {
                            return  res.send({status:1,message:err.message+',数据库出错，请联系网站开发者'})
                        }
                        else if(results.affectedRows!==1){
                            return res.send({status:1,message:'创建文章失败，请稍后再试或联系网站开发者'})
                        }
                        else{
                            var sqlStr3='select * from article where title=?'
                            db.query(
                                sqlStr3,req.body.title,(err,results)=>{
                                if(err){
                                    return res.send({status:1, message:err.message+'创建文章成功，但是出现了意外错误导致无法获取ID，请您自行进入“我的DEMO”查看文章'})
                                }
                                else{
                                    return res.send({status:0, message:'创建文章成功',articleID:results[0].articleID})
                                }
                            })
                        }
                    })
            }});
        }})
}//创建文章
exports.update_article=(req,res)=>{
    var sqlStr='select authorID from article where articleID=? '
    db.query(sqlStr,req.query.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results[0].authorID!=req.user.userID){
            return res.send({status:1,message:'这篇文章并非您所有'})
        }
        else{
            const sql=`update article set article_status=?, data=?,title=? where articleID=?`
            db.query(sql,[req.body.article_status,req.body.data,req.body.title,req.query.articleID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('更新文章失败！稍后再试或联系网站管理员')
                res.cc('更新文章成功',0)
            })
        }
    })
    

}//更新文章
exports.get_my_article=(req,res)=>{
    var sqlStr=`select * from article where articleID=? `
    db.query(sqlStr,req.query.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'文章不存在'})
        }
        else{
            if(results[0].authorID==req.user.userID)
                return res.send({status:0,message:'查询成功',data:JSON.stringify(results[0])})
            else
                return res.cc("该请求路径属于用于用户访问自己的文章，而该文章并不属于您")
        }})
}//获取user指定ID的文章
exports.get_my_article_list=(req,res)=>{
    var sqlStr='select articleID,title,level,article_status from article where authorID=? and kind=?'
    db.query(sqlStr,[req.user.userID,req.query.kind],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取user指定类型的文章列表
const db=require('../db/index')
var danger_char=RegExp(
    /[(\')(\")(\<)]+/
);
exports.getUserInfo=(req,res)=>{
    const sql=`select userID, name, realname, level, email, user_pic from users where userID=?`
    db.query(sql,req.user.userID,(err,results)=>{
        if(err)return res.cc(err)
        if(results.length!==1)return res.cc('获取用户信息失败')
        res.send({
            status:0,
            message:'获取用户信息成功！',
            data:results[0]
        })
    })
}
exports.updateUserInfo=(req,res)=>{
    //name\password\email特殊字符检查
    //if(danger_char.test(req.body.name))
        //res.cc('name不能含有英文引号、左尖角括号');
    //if(danger_char.test(req.body.password))
        //res.cc('password不能含有英文引号、左尖角括号');
    //if(danger_char.test(req.body.email))
        //res.cc('email不能含有英文引号、左尖角括号');
    const sql=`update users set ? where userID=?`
    
    db.query(sql,[req.body,req.user.userID],(err,results)=>{
        if(err) return res.cc(err);
        if(results.affectedRows!==1)return res.cc('更新用户信息失败！')
        res.cc('更新用户信息成功',0)
    })


}
exports.create_article=(req,res)=>{
    console.log("trying to create article!");
    const mysql_str = 'insert into article set ?'
    db.query(mysql_str,{title:req.body.title,kind:req.body.kind,status:req.body.status,data:req.body.data,authorID:req.user.userID},(err,results)=>{
        if(err) {
            return  res.send({status:1,message:err.message+',数据库出错，请联系网站开发者'})
        }
        else if(results.affectedRows!==1){
            return res.send({status:1,message:'创建文章失败，请稍后再试或联系网站开发者'})
        }
        else{
            return res.send({status:0,message:'创建文章完成！'})
        }
    })
}
exports.update_article=(req,res)=>{
    const sql=`update article set ? where articleID=?`
    db.query(sql,[req.body,req.body.articleID],(err,results)=>{
        if(err) return res.cc(err+'请联系网站管理员');
        if(results.affectedRows!==1)return res.cc('更新文章失败！稍后再试或联系网站管理员')
        res.cc('更新文章成功',0)
    })

}
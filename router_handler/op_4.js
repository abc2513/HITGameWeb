const db = require("../db/index");
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
///////////////////强调！所有操作都需要管理员权限判定！/////////////////
exports.upgrade_3=(req,res)=>{
    if(req.user.level<4)
        return res.send({status:1,message:'该请求需要4级权限'})
    var sqlStr=`select * from users where userID=?`
    db.query(sqlStr,req.body.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(results[0].level!=2)
                return res.send({status:1,message:'该操作仅适用于2级用户'})
            else{
                const sql=`update users set level=3 where userID=?`
                db.query(sql,req.body.userID,(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('操作失败！稍后再试或联系网站管理员')
                    res.cc('成功将该用户升级为管理员',0)
                    var router="upgrade_3";
                    var sql_str=`insert into operate set operaterID=?,router=?,body=?`
                    db.query(sql_str,[req.user.userID,router,JSON.stringify(req.body)],(err,results)=>{
                        if(err) {
                            console.log(err.message)
                        }
                        else if(results.affectedRows!==1){
                            console.log('操作数据库失败')
                        }
                        else{
                            //console.log('有人访问系统啦！')
                        }})
                })
            }
        }
    })
}//
exports.downgrade_2=(req,res)=>{
if(req.user.level<4)
    return res.send({status:1,message:'该请求需要4级权限'})
var sqlStr=`select * from users where userID=?`
db.query(sqlStr,req.body.userID,(err,results)=>{
    if(err){
        return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
    }
    if(results.length==0){
        return res.send({status:1,message:'查询不到用户'})
    }
    else{
        if(results[0].level!=3)
            return res.send({status:1,message:'该操作仅适用于3级用户'})
        else{
            const sql=`update users set level=2 where userID=?`
            db.query(sql,req.body.userID,(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('操作失败！稍后再试或联系网站管理员')
                res.cc('成功将该用户取消管理员',0)
                var router="downgrade_2";
                var sql_str=`insert into operate set operaterID=?,router=?,body=?`
                db.query(sql_str,[req.user.userID,router,JSON.stringify(req.body)],(err,results)=>{
                    if(err) {
                        console.log(err.message)
                    }
                    else if(results.affectedRows!==1){
                        console.log('操作数据库失败')
                    }
                    else{
                        //console.log('有人访问系统啦！')
                    }})
            })
        }
    }
})
}
exports.hand_level_4=(req,res)=>{
if(req.user.level<4)
    return res.send({status:1,message:'该请求需要4级权限'})
//注意，这里使用的token后面会进一步校验
var sqlStr=`select * from users where userID=?`
db.query(sqlStr,req.user.userID,(err,results)=>{
    if(err){
        return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
    }
    if(results.length==0){
        return res.send({status:1,message:'查询不到你的账号'})
    }
    else{
        if(!bcrypt.compareSync(req.body.giver_password,results[0].password))return res.cc('你的密码错误!')
        if(req.body.giver_studentID!=results[0].studentID)return res.cc('你的学号错误！')
        if(results[0].level<4) return res.send({status:1,message:'该请求需要4级权限'})
        var sqlStr2=`select * from users where userID=?`
        db.query(sqlStr2,req.body.userID,(err,results)=>{
            if(err){
                return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
            }
            if(results.length==0){
                return res.send({status:1,message:'查询不到指定ID的用户'})
            }
            else{
                if(results[0].level!=3)return res.send({status:1,message:'该操作仅适用于3级用户'})
                if(results[0].name!=req.body.name)return res.cc('用户名和用户ID不匹配');
                if(results[0].email!=req.body.email)return res.cc('用户邮箱与用户ID不匹配');
                if(results[0].realname!=req.body.realname)return res.cc('用户姓名不匹配');
                if(results[0].studentID!=req.body.studentID)return res.cc('用户学号不匹配');
                const sql=`update users set level=4 where userID=?;`
                db.query(sql,[req.body.userID],(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('操作失败！稍后再试或联系网站管理员')
                    const sql2=`update users set level=3 where userID=?`
                    db.query(sql2,[req.user.userID],(err,results)=>{
                        if(err) return res.cc(err+'降级失败！请联系网站管理员');
                        if(results.affectedRows!==1)return res.cc('降级失败！请联系网站管理员')
                        res.cc('操作成功！感谢您一直以来的贡献！',0)
                        var router="hand_level_4";
                        var sql_str=`insert into operate set operaterID=?,router=?,body=?`
                        db.query(sql_str,[req.user.userID,router,JSON.stringify(req.body)],(err,results)=>{
                            if(err) {
                                console.log(err.message)
                            }
                            else if(results.affectedRows!==1){
                                console.log('操作数据库失败')
                            }
                            else{
                                //console.log('有人访问系统啦！')
                            }})
                    })
                })
            }
        })
    }})

}
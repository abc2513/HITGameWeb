const db = require("../db/index");
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
///////////////////强调！所有操作都需要管理员权限判定！/////////////////
exports.get_all_user_list=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select userID,name,level,realname,studentID,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime
     from users
     order by level DESC,regtime DESC
     `
    db.query(sqlStr,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取所有用户列表
exports.get_user_list=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select userID,name,level,realname,studentID,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime
    from users
    where level=?
    order by level DESC,regtime DESC
    `
    db.query(sqlStr,req.query.level,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取所有指定等级用户列表
exports.reset_password=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select level from users where ?`
    db.query(sqlStr,req.query,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(result[0].level>=req.user.level)
                return res.send({status:1,message:'你只能为权限等级低于你的账号重置密码'})
            else{
                const sql=`update users set password='123456789' where userID=?`
                db.query(sql,req.body.userID,(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('重置密码失败！稍后再试或联系网站管理员')
                    res.cc('重置密码为123456789成功！请提醒该用户及时登录并修改为自己的密码！',0)
                })
            }
        }
    })
}//重置指定用户的密码
exports.upgrade_2=(req,res)=>{
    
}//将普通用户升级为正式社员，并填写realname和studentID
exports.get_all_article_list=(req,res)=>{
}//获取指定类型的文章列表(包括草稿)
exports.change_article_status=(req,res)=>{
}//修改指定文章状态（发布/草稿）
exports.change_user_level=(req,res)=>{
}//修改用户权限等级
exports.get_all_annonucement_list=(req,res)=>{
}//获取所有公告列表(包括草稿)
exports.get_announcement=(req,res)=>{
}//获取指定ID的公告
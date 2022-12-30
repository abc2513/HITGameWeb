const db = require("../db/index");
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
///////////////////强调！所有操作都需要管理员权限判定！/////////////////
exports.get_all_user_list=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select userID,name,level,realname,studentID,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime,email,user_status
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
    var sqlStr=`select userID,name,level,realname,studentID,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime,email,user_status
    from users
    where userID like ? and name like ? and email like ? and realname like ? and studentID like ? and level like ? and user_status like ?
    order by level DESC,regtime DESC
    `
    db.query(sqlStr,['%'+req.query.userID+'%','%'+req.query.name+'%','%'+req.query.email+'%','%'+req.query.realname+'%','%'+req.query.studentID+'%','%'+req.query.level+'%','%'+req.query.user_status+'%'],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//查询用户用户列表
exports.reset_password=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from users where userID=?`
    db.query(sqlStr,req.body.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(results[0].level>=req.user.level)
                return res.send({status:1,message:'你只能为权限等级低于你的账号重置密码'})
            else{
                var new_password=bcrypt.hashSync('123456789',10)
                const sql=`update users set password=? where userID=?`
                db.query(sql,[new_password,req.body.userID],(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('重置密码失败！稍后再试或联系网站管理员')
                    res.cc('重置密码为123456789成功！请提醒该用户及时登录并修改为自己的密码！',0)
                    var router="reset_password";
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
}//重置指定用户的密码
exports.upgrade_2=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from users where userID=?`
    db.query(sqlStr,req.body.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(results[0].level!=1)
                return res.send({status:1,message:'该操作仅适用于1级用户'})
            else{
                const sql=`update users set realname=?,studentID=?,level=2 where userID=?`
                db.query(sql,[req.body.realname,req.body.studentID,req.body.userID],(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('操作失败！稍后再试或联系网站管理员')
                    res.cc('成功将该用户升级为正式成员',0)
                    var router="upgrade_2";
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
}//将普通用户升级为正式社员，并填写realname和studentID
exports.update_realinfo=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from users where userID=?`
    db.query(sqlStr,req.body.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(results[0].level>=req.user.level)
                return res.send({status:1,message:'你只能为权限等级低于你的账号订正实名信息'})
            else{
                const sql=`update users set realname=?,studentID=? where userID=?`
                db.query(sql,[req.body.realname,req.body.studentID,req.body.userID],(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('订正实名信息失败！稍后再试或联系网站管理员')
                    res.cc('订正实名信息成功！',0)
                    var router="update_realinfo";
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
}//修改正式社员的realname和studentID
exports.change_user_status=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from users where userID=?`
    db.query(sqlStr,req.body.userID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到用户'})
        }
        else{
            if(results[0].level>=req.user.level)
                return res.send({status:1,message:'你只能为权限等级低于你的账号修改状态！'})
            else{
                const sql=`update users set user_status=? where userID=?`
                db.query(sql,[req.body.user_status,req.body.userID],(err,results)=>{
                    if(err) return res.cc(err+'请联系网站管理员');
                    if(results.affectedRows!==1)return res.cc('修改账号状态失败！稍后再试或联系网站管理员')
                    res.cc('修改账号状态成功！',0)
                    var router="change_user_status";
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
}//修改用户的账号状态
exports.get_all_article_list=(req,res)=>{
}//获取指定类型的文章列表(包括草稿)
exports.change_article_status=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from article where articleID=?`
    db.query(sqlStr,req.body.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            const sql=`update article set article_status=? where articleID=?`
            db.query(sql,[req.body.status,req.body.articleID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('修改文章状态失败！也许该文章已经是指定的状态？或者稍后再试或联系网站管理员')
                res.cc('修改文章状态成功',0)
                var router="change_article_status";
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
    })
}//修改指定文章状态（发布/草稿）
exports.set_article_level=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from article where articleID=?`
    db.query(sqlStr,req.body.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            const sql=`update article set level=? where articleID=?`
            db.query(sql,[req.body.level,req.body.articleID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('修改文章评分失败！稍后再试或联系网站管理员')
                res.cc('修改文章评分成功',0)
                var router="set_article_level";
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
    })
}//设置指定ID文章的评分
exports.get_all_annonucement_list=(req,res)=>{
    if(req.user.level<3)
    return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select articleID,title,level,article_status from article where kind=0
    order by create_time DESC`
    db.query(sqlStr,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取所有公告列表(包括草稿)
exports.get_announcement=(req,res)=>{
    if(req.user.level<3)
    return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from article where articleID=? and kind=0`
    db.query(sqlStr,req.query.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'文章不存在'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results[0])})
        }})
}//获取指定ID的公告
exports.get_operate_list=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select operateID,operaterID,router,body,DATE_FORMAT(time,'%Y/%m/%d-%H:%i:%s') as time,users.name
    from operate
    join users on operate.operaterID=users.userID
    where operaterID like ? and router like ? and body like ? and (time between ? and ?)
    order by time DESC
    `
    //console.log(req.query.start_time+req.query.end_time)
    db.query(sqlStr,['%'+req.query.operatorID+'%','%'+req.query.router+'%','%'+req.query.operate_body+'%',req.query.start_time+':00',req.query.end_time+':00'],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到操作'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//查询管理日志
exports.all_operate_list=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select operateID,operatorID,router,body,DATE_FORMAT(time,'%Y/%m/%d-%H:%i:%s') as time
     from operate
     order by time DESC
     `
    db.query(sqlStr,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到操作日志'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取所有管理日志
exports.delete_comment=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from comment where commentID=?`
    db.query(sqlStr,req.body.commentID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到评论'})
        }
        else{
            const sql=`update comment set status=? where commentID=?`
            db.query(sql,[req.body.status,req.body.commentID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('更改评论可视性失败！稍后再试或联系网站管理员')
                res.cc('更改评论可视性成功！',0)
                var router="delete_comment";
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
    })
}//修改指定ID的评论可见性
exports.set_index_show=(req,res)=>{
    if(req.user.level<3)
        return res.send({status:1,message:'该请求需要3级权限'})
    var sqlStr=`select * from index_show where ID=?`
    db.query(sqlStr,req.body.ID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到ID'})
        }
        else{
            const sql=`update index_show set articleID=? where ID=?`
            db.query(sql,[req.body.articleID,req.body.ID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('更改主页展示内容失败！稍后再试或联系网站管理员')
                res.cc('更改主页展示内容成功！',0)
                var router="set_index_show";
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
    })
}//修改指定ID的评论可见性
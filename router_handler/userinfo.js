const db=require('../db/index')
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
const multiparty=require('multiparty')//传输文件
const compressing=require('compressing')//解压缩
const fs=require('fs')//系统文件模块
var danger_char=RegExp(
    /[(\')(\")(\<)]+/
);
function emptyDir(path) {
    const files = fs.readdirSync(path);
    files.forEach(file => {
        const filePath = `${path}/${file}`;
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            emptyDir(filePath);
        } else {
            fs.unlinkSync(filePath);
            console.log(`删除${file}文件成功`);
        }
    });
}//删除文件夹内的所有文件
exports.getUserInfo=(req,res)=>{
    const sql=`select *,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime_f from users where userID=?`
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
exports.update_password=(req,res)=>{
    const sql=`select * from users where userID=?`
    db.query(sql,req.user.userID,(err,results)=>{
        if(err)return res.cc(err)
        if(results.length!==1)return res.cc('获取用户信息失败')
        if(!bcrypt.compareSync(req.body.old_password,results[0].password))return res.cc('原密码错误！')
        var new_password=bcrypt.hashSync(req.body.new_password,10)
        const sql2=`update users set password=? where userID=?`
        db.query(sql2,[new_password,req.user.userID],(err,results)=>{
            if(err) return res.cc(err);
            if(results.affectedRows!==1)return res.cc('修改密码失败！')
            res.cc('修改密码成功',0)
        })
    })
}//修改密码
exports.create_article=(req,res)=>{ 
    if(req.user.level<3){
        if(req.body.kind!=1&&req.body.kind!=2){
            res.cc('您的用户权限只能创建kind=1/2的文章')
        }
    }else{
        if(req.body.kind!=1&&req.body.kind!=2&&req.body.kind!=0){
            res.cc('您的用户权限只能创建kind=1/2/0的文章')
        }
    }
    var sqlStr='select * from article where authorID=? and kind=? and create_time>=?'
    var cal_time=new Date();
    cal_time.setMonth(cal_time.getMonth()-1)
    //console.log(cal_time)
    db.query(sqlStr,[req.user.userID,req.body.kind,cal_time],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        switch(req.body.kind){
            case '1':
                if(results.length>=5){
                    return res.send({status:1,message:'用户每月仅能发布5篇DEMO'})
                }
                break;
            case '2':
                if(results.length>=2){
                    return res.send({status:1,message:'用户每月仅能发布2项目文章'})
                }
                break;
            }
        var sqlStr2='select * from article where title=? and kind=?'
        db.query(
            sqlStr2,[req.body.title,req.body.kind],(err,results)=>{
            if(err){
                return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
            }
            if(results.length>=1){
                return res.send({status:1,message:' 存在一篇同名的文章！'})
            }
            else{    
                console.log("trying to create article!");
                const mysql_str = 'insert into article set ?'
                db.query(mysql_str,{title:req.body.title,kind:req.body.kind,article_status:req.body.article_status,data:req.body.data,authorID:req.user.userID,participator:req.body.participator},(err,results)=>{
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
        })
}//创建文章
exports.update_article=(req,res)=>{
    var sqlStr='select authorID from article where articleID=? '
    db.query(sqlStr,req.query.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results[0].authorID!=req.user.userID){
            if(results[0].kind!=0||req.user.level<3)
                return res.send({status:1,message:'这篇文章并非您所有'})
        }
        else{
            const sql=`update article set article_status=?, data=?,title=?,participator=?,pic=? where articleID=?`
            db.query(sql,[req.body.article_status,req.body.data,req.body.title,req.body.participator,req.body.pic,req.query.articleID],(err,results)=>{
                if(err) return res.cc(err+'请联系网站管理员');
                if(results.affectedRows!==1)return res.cc('更新文章失败！稍后再试或联系网站管理员')
                res.cc('更新文章成功',0)
            })
        }
    })
    

}//更新文章
exports.get_my_article=(req,res)=>{
    var sqlStr=`select article.*,users.name,pic
    from article join users on article.authorID=users.userID
    where articleID=?`
    db.query(sqlStr,req.query.articleID,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'文章不存在'})
        }
        else{
            if(results[0].authorID==req.user.userID||(results[0].kind==0&&req.user.level>2))
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
exports.create_comment=(req,res)=>{
    var sqlStr='select * from comment where articleID=? and userID=? and kind=? and status=0'
    db.query(sqlStr,[req.body.articleID,req.user.userID,req.body.kind],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length>=3){
            return res.send({status:1,message:'一个用户只能对一篇文章发表3个评论'})
        }
        else{
            var sqlStr2='select * from comment where text=? and userID=? and kind=?' 
            db.query(
                sqlStr2,[req.body.text,req.user.userID,req.body.kind],(err,results)=>{
                if(err){
                    return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                }
                if(results.length>=1){
                    return res.send({status:1,message:'你发表过相同内容的评论！'})
                }
                else{    
                    //console.log("trying to create article!");
                    const mysql_str = 'insert into comment set ?'
                    db.query(mysql_str,{articleID:req.body.articleID,userID:req.user.userID,text:req.body.text,kind:req.body.kind},(err,results)=>{
                        if(err) {
                            return  res.send({status:1,message:err.message+',数据库出错，请联系网站开发者'})
                        }
                        else if(results.affectedRows!==1){
                            return res.send({status:1,message:'评论失败，请稍后再试或联系网站开发者'})
                        }
                        else{
                            return res.send({status:0, message:'评论成功'})
                        }
                    })
            }});
        }})
}//发表评论
exports.delect_comment=(req,res)=>{
    var sqlStr='select * from comment where commentID=?'
    db.query(sqlStr,[req.body.commentID],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'找不到指定的评论'})
        }
        if(results[0].userID!=req.user.userID){
            return res.cc('这条评论并不属于你')
        }
        else{
            var sqlStr2='delete from comment where commentID=?' 
            db.query(
                sqlStr2,[req.body.commentID],(err,results)=>{
                if(err){
                    return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                }
                if(results.affectedRows!=1){
                    return res.send({status:1,message:'删除失败！请联系网站开发者'})
                }
                else{    
                    return res.send({status:0,message:'删除评论成功！'})
                }
            });
        }
    })
}//删除评论
exports.thumbs_up_change=(req,res)=>{
    var sqlStr='select * from thumbs_up where articleID=? and kind=?'
    db.query(sqlStr,[req.body.articleID,req.body.kind],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            //创建点赞信息
            const sql2=`insert thumbs_up set ? `
            db.query(sql2,{userID:req.user.userID,articleID:req.body.articleID,value:1,kind:req.body.kind},(err,results)=>{
                if(err) return res.cc(err);
                if(results.affectedRows!==1)return res.cc('点赞失败')
                res.cc('点赞成功',0)})
        }
        else{
            //修改点赞信息
            var value=(results[0].value+1)%2;
            var thumbs_upID=results[0].thumbs_upID
            const sql2=`update thumbs_up set value=? where thumbs_upID=?`
            db.query(sql2,[value,thumbs_upID],(err,results)=>{
                if(err) return res.cc(err);
                if(results.affectedRows!==1)return res.cc((value==1?'':'取消')+'点赞失败')
                res.cc((value==1?'':'取消')+'点赞成功',0)})
        }
    })
}//点赞/取消点赞
exports.thumbs_up_check=(req,res)=>{
    var sqlStr='select * from thumbs_up where articleID=? and kind=? and userID=?'
    db.query(sqlStr,[req.query.articleID,req.query.kind,req.user.userID],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results[0])})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results[0])})
        }})
}//获取自己对当前文章的点赞情况
exports.upload_webgl=(req,res)=>{
    //检查该用户一个月内的创建数
    //try{
    var sqlStr1='select * from webgl_upload_info where userID=? && upload_time>=?'
    var cal_time=new Date();
    cal_time.setDate(cal_time.getDate()-1)
    db.query(sqlStr1,[req.user.userID,cal_time],(err,results)=>{
        if(err)return res.cc(err.message+'数据库查询出错!')
        if(results.length>=50)return res.cc('您当天的上传次数已耗尽！')
        //接受文件
        var form=new multiparty.Form()
        form.uploadDir='webgl'
        form.parse(req,function(err,fields,files){
            if(err) return res.cc('上传文件失败'+err)
            //上传文件成功
            console.log(files);
            var file_name=files.file[0].originalFilename.substr(0,files.file[0].originalFilename.length-4)
            compressing.zip.uncompress(files.file[0].path, 'webgl/'+req.user.userID+'/'+file_name)
                .then(() => {
                    console.log('解压缩文件成功');
                    fs.unlinkSync(files.file[0].path)//删除压缩包
                })
                .catch(err => {
                    console.error('解压缩文件失败！'+err);
                    fs.unlinkSync(files.file[0].path)//删除压缩包
                    return res.cc('解压缩文件失败！'+err)
                });
            //记录到数据库
            var sqlStr2='select * from webgl_info where webgl_name=? and userID=?'
            db.query(sqlStr2,[file_name,req.user.userID],(err,results)=>{
                if(err){
                    res.send({status:1, message:err.message+'数据库查重出错!'})
                }
                else if(results.length!=0){
                    //旧的WebGL：啥也不干
                    res.send({status:0,message:'上传成功！',data:req.user.userID+'/'+file_name})
                }else{
                    //新的WebGL：新建数据库记录
                    var sqlStr3='insert into webgl_info set ?'
                    db.query(sqlStr3,{userID:req.user.userID,webgl_name:file_name},(err,results)=>{
                        if(err)return res.cc(err.message+'数据库查重出错!')
                        if(results.affectedRows!=1) return res.cc('数据库插入出错!')
                        res.send({status:0,message:'上传成功！',data:req.user.userID+'/'+file_name})
                    })
                }
                //最后做上传记录登记，无需新增返回数据
                var sqlStr4='insert into webgl_upload_info set ?'
                db.query(sqlStr4,{userID:req.user.userID,webgl_name:file_name},(err,results)=>{
                    if(err)console.log(err)
                })
            })
        })
    })
    //}catch{
    //    res.cc('服务器出现未知错误！请联系管理员！')
    //}

    
}//上传WebGL压缩包(并解压缩)
exports.get_my_webgl_list=(req,res)=>{
    var sqlStr='select * from webgl_info where userID=? and status=0'
    db.query(sqlStr,[req.user.userID],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:0,message:'查询不到webgl'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }
    })
}//获取自己的webgl列表
exports.delete_my_webgl=(req,res)=>{
    var sqlStr='select * from webgl_info where userID=? and status=0 and webgl_infoID=?'
    db.query(sqlStr,[req.user.userID,req.body.webgl_infoID],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'在查询不到指定的webgl'})
        }
        else{
            var file_path='webgl/'+results[0].userID+'/'+results[0].webgl_name
            var sqlStr2='delete from webgl_info where webgl_infoID=?'
            db.query(sqlStr2,[req.body.webgl_infoID],(err,results)=>{
                if(err){
                    return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                }
                if(results.affectedRows==0){
                    return res.send({status:1,message:'删除失败！'})
                }
                else{
                    try{emptyDir(file_path)}
                    finally{return res.send({status:0,message:'删除成功'})}
                }
            })
        }
    })
}//删除自己的指定webgl
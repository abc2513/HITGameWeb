const db = require("../db/index");
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
var containSpecial = RegExp(
    /[(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\+)(\=)(\[)(\])(\{)(\})(\|)(\;)(\')(\")(\,)(\.)(\<)(\>)(\?)(\)]+/
);
var danger_char=RegExp(
    /[(\')(\")(\<)]+/
);
exports.regUser=(req,res)=>{
    var isFailed=0;
    console.log('reguser......')
    const user_info=req.body;
    if(!user_info.name){
        //return res.send({status:1,message:'用户名不能为空'})
        //两个语句等价
        return res.cc('用户名不能为空')
    }
    else if(user_info.name.length>20){
        //return res.send({status:1,message:'用户名长度超过20个字符'})
        return res.cc('用户名长度超过20个字符')
    }
    else if(user_info.name.length<2){
        //return res.send({status:1,message:'用户名长度少于2个字符'})
        return res.cc('用户名长度少于2个字符')
    }
    //else if(danger_char.test(user_info.name) ){
        //return res.send({status:1,message:'用户名不能含有英文引号和左尖括号！'})
    //}
    else if(!user_info.password){
        return res.send({status:1,message:'密码不能为空！'})
    }
    else if(user_info.password.length>=20){
        return res.send({status:1,message:'密码长度超过20个字符'})
    }
    else if(user_info.password.length<6){
        return res.send({status:1,message:'密码长度小于6个字符'})
    }
    //else if(danger_char.test(user_info.password) ){
        //return res.send({status:1,message:'密码不能含有英文引号和左尖括号！'})
    //}
    else if(!user_info.email){
        return res.send({status:1,message:'邮箱不能为空！'})
    }
    else if(user_info.email.length>=20){
        return res.send({status:1,message:'邮箱长度超过20! '})
    }
    else if(!user_info.email.match(/^\w+@\w+\.\w+$/i)){
        return res.send({status:1,message:'邮箱格式不正确！'})
    }
    //else if(danger_char.test(user_info.email) ){
        //return res.send({status:1,message:'邮箱不能含有英文引号和左尖括号！'})
    //}
    var sqlStr='select * from users where name=?'
    db.query(sqlStr,user_info.name,(err,results)=>{
        if(err){
            isFailed=1;
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length>0){
            isFailed=1;
            return res.send({status:1,message:'用户名被占用'})
        }
        if(!isFailed){
            sqlStr='select * from users where email=?'
            db.query(sqlStr,user_info.email,(err,results)=>{
                if(err){
                    isFailed=1;
                    return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                }
                if(results.length>0){
                    isFailed=1;
                    return res.send({status:1,message:'邮箱被占用'})
                } 
                if(!isFailed){
                    //格式校验完成
                    var regdate=new Date();
                    var day=regdate.getDate();
                    var month=regdate.getMonth()+1;
                    var year=regdate.getFullYear();
                    if(month<10)month='0'+month;
                    var s_regdate=`${year}-${month}-${day}`
                    sqlStr='select * from users where regtime like ?'
                    db.query(sqlStr,`${s_regdate}\%`,(err,results)=>{
                        if(err){
                            isFailed=1;
                            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
                        }
                        if(results.length>=20){
                            isFailed=1;
                            return res.send({status:1,message:'当天网站总注册数达到上限！请明天再尝试！测试期间每天仅20个注册数！'})
                        } 
                        if(!isFailed){
                            //注册前检查完成
                            user_info.password=bcrypt.hashSync(user_info.password,10);//加密用户密码
                            //尝试向数据库加入用户信息
                            const req_mysql_str = 'insert into users set ?'
                            db.query(req_mysql_str,{name:user_info.name,password:user_info.password,email:user_info.email},(err,results)=>{
                                if(err) {
                                    isFailed=1;
                                    return  res.send({status:1,message:err.message+'数据库出错，请联系网站开发者'})
                                }
                                if(results.affectedRows!==1){
                                    isFailed=1;
                                    return res.send({status:1,message:'注册失败，请稍后再试或联系网站开发者'})
                                }
                                if(!isFailed){
                                    //完成注册
                                    console.log('reguser success!!user\'s info:');
                                    console.log(user_info);
                                    const req_mysql_str2 = 'select * from users where email=?'
                                    db.query(req_mysql_str2,user_info.email,(err,results)=>{
                                        if(err) {
                                            isFailed=1;
                                            //return  res.send({status:1,message:err.message+'数据库出错，请联系网站开发者'})
                                        }
                                        if(results.length!==1){
                                            isFailed=1;
                                            //return res.send({status:1,message:'注册失败，请稍后再试或联系网站开发者'})
                                        }
                                        if(!isFailed){
                                            return res.send({status:0,message:"注册成功！您的userID为："+results[0].userID})
                                        }
                                        else{
                                            return res.send({status:0,message:"注册成功！但是您的userID由于服务器内部问题获取失败，可稍后在我的账号查看。"})
                                        }
                                    })

                                    

                                }

                            })

                            //return res.send({status:0,message:'reg success!'})
                        }
                    })
                }
            })
        }
    })

}//注册用户
exports.login=(req,res)=>{
    const user_info=req.body;
    var sql=''
    var data=''
    var srcStr=''
    if((!user_info.name)&&(!user_info.userID)&&(!user_info.email))
        res.cc('必须选择userID、name、email其中之一进行登录');
    else{
        if(user_info.userID){
            sql=`select * from users where userID=?`
            data=user_info.userID
            srcStr='userID'
        }
        else if(user_info.email){
            sql=`select * from users where email=?`
            data=user_info.email
            srcStr='email'
        }
        else if(user_info.name){
            sql=`select * from users where name=?`
            data=user_info.name
            srcStr='name'
        }
        db.query(sql,data,(err,results)=>{
            console.log(srcStr+'\:'+data+',尝试登录')
            if(err) return res.cc(err)
            if(results.length!==1)return res.cc('账号不存在!')
            if(!bcrypt.compareSync(user_info.password,results[0].password))return res.cc('密码错误!')
            console.log(srcStr+'\:'+data+',登录成功')
            const user ={...results[0],password:'',user_pic:''}
            const tokenStr =jwt.sign(user,config.jwtSecretKey,{expiresIn:config.expiresIn})
            res.send({
                status:0,
                message:'登录成功!',
                token:'Bearer '+tokenStr 
            })
        })
    }
}//用户登录
exports.get_article_list=(req,res)=>{
    var sqlStr=`select articleID,title,article.level,name,DATE_FORMAT(create_time, '%Y/%m/%d-%H:%i:%s') as create_time
     from article join users on users.userID=article.authorID
     where article_status=0 and kind=?
     order by article.level DESC ,create_time DESC
     `
    db.query(sqlStr,req.query.kind,(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取指定类型的公开文章列表
exports.get_article=(req,res)=>{
    var sqlStr=`select article.*,users.name
     from article join users on article.authorID=users.userID
     where article_status=0 and articleID=?`
    db.query(sqlStr,[req.query.articleID],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'文章不存在或暂未发表'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results[0])})
        }})
}//获取指定ID的公开文章
exports.get_n_newest_article=(req,res)=>{
    var sqlStr=`select articleID,title,article.level,name,DATE_FORMAT(create_time, '%Y/%m/%d-%H:%i:%s') as create_time
     from article join users on users.userID=article.authorID
     where article_status=0 and kind=?
     order by create_time DESC
     limit 0,?
     `
    db.query(sqlStr,[req.query.kind,Number(req.query.n)],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取n个最新的DEMO/项目
exports.get_n_best_article=(req,res)=>{
    var sqlStr=`select articleID,title,article.level,name,DATE_FORMAT(create_time, '%Y/%m/%d-%H:%i:%s') as create_time
     from article join users on users.userID=article.authorID
     where article_status=0 and kind=?
     order by article.level DESC ,create_time DESC
     limit 0,?
     `
    db.query(sqlStr,[req.query.kind,Number(req.query.n)],(err,results)=>{
        if(err){
            return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
        }
        if(results.length==0){
            return res.send({status:1,message:'查询不到文章'})
        }
        else{
            return res.send({status:0,message:'查询成功',data:JSON.stringify(results)})
        }})
}//获取n个评分最高的DEMO/项目
exports.get_visit_time_today=(req,res)=>{
    var date=new Date;
    var month=date.getMonth()+1;
    var timestr=''+date.getFullYear()+'-'+month+'-'+date.getDate()+' 00:00:00'
    var sqlStr=`select ip
    from visit_log
    where router=? and time>=?
    `
    //console.log(timestr)
   db.query(sqlStr,[req.query.router,timestr],(err,results)=>{
       if(err){
           return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
       }
       else{
           return res.send({status:0,message:'查询成功',data:results.length})
       }})
}//获取指定路径的网页今日访问量
exports.get_visit_ip_today=(req,res)=>{
    var date=new Date;
    var month=date.getMonth()+1;
    var timestr=''+date.getFullYear()+'-'+month+'-'+date.getDate()+' 00:00:00'
    var sqlStr=`select distinct ip
    from visit_log
    where router=? and time>=?
    `
   db.query(sqlStr,[req.query.router,timestr],(err,results)=>{
       if(err){
           return res.send({status:1, message:err.message+'请向网站开发者报告这个错误！'})
       }
       else{
           return res.send({status:0,message:'查询成功',data:results.length})
       }})
}//获取指定路径的网页今日访问IP数量
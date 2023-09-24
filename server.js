const express = require('express')//导入express包
const app = express()//创建服务器
const joi = require('joi')//导入joi包
const https = require('https')//导入https包
const fs = require('fs')//导入服务器证书包
const net=require('net')
const cors=require('cors')//导入cors跨域访问包
const path = require('path')//导入路径处理包
const express_jwt=require('express-jwt')//导入登录验证包
const config=require('./config')//导入密码加密配置文件
//////////////////////////////////////////////////////////////////////
//HTTPS相关配置
const SSL_PORT = 443;//服务器端口号
const SSL_PORT_4 = 444;
const http_RORT = 80;
var privateCrt = fs.readFileSync(path.join(process.cwd(), 'zs/fullchain.crt'), 'utf8');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'zs/private.pem'), 'utf8');
const HTTPS_OPTOIN = {
    key: privateKey,
    cert: privateCrt
}; 
/////////////////////////////////////////////////////////////////////////
//web服务器
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
        extended: false,
     parameterLimit: 100000,
     limit: 1024 * 1024 * 100//限制表单数据100MB，10W参数
}));
app.use(bodyParser.json({
        extended: false,
     parameterLimit: 100000,
     limit: 1024 * 1024 * 100
}));
//修改请求大小限制
app.use(function(req,res,next){//封装返回消息函数以供调用
    res.cc=function(err,status=1){
        res.send({status,message: err instanceof Error ? err.message : err })
    }
    next();
})
app.use(express_jwt({secret: config.jwtSecretKey}).unless({path:[/^\/api/,'/',/^\/html/]}))//登录验证
//--在此处应该加入user信息更新查询
// app.use(function(err,req,res,next){
//   console.log('1')
//   if(req.user!=undefined){
//     const sql=`select *,DATE_FORMAT(regtime,'%Y/%m/%d-%H:%i:%s') as regtime_f from users where userID=?`
//     db.query(sql,req.user.userID,(err,results)=>{
//         if(err)return res.cc(err)
//         if(results.length!==1)return res.cc('获取用户信息失败')
//         req.user=results[0]
//         console.log(req.user)
//         next()
//     })
//   }
//   else {
//     console.log(req.user)
//     next()
//   }
// })
app.use("/html",require("./router/statistic"))//统计网页访问数据
app.use("/html/wd",express.static('./文档'))//静态托管文档文件夹
app.use("/html/webgl",express.static('./webgl'))//静态托管webgl文件夹
app.use("/html",express.static('./htmlResources'))//静态托管网页资源文件夹
app.use(cors()) //设置跨域访问
app.use(express.urlencoded({ extended: false }))
app.use('/api',require('./router/user'))//无需登录的接口
app.use('/my',require('./router/user_info'))//lv1的接口
app.use('/op',require('./router/op'))//lv3的接口
app.use('/op4',require('./router/op_4'))//lv4的接口
app.use("/",express.static('./jump'))//只有域名没有后续路径的响应
app.use((err,req,res,next)=>{//将服务端错误响应给客户端
    if(err instanceof joi.ValidationError) return res.cc(err)
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败')
    res.send({status:1,message:err})
    //这里没有next了,运行到这里就截断
})
///////////////////////////////////////////////////////////////////////////
//运行HTTPS服务
const httpsServer = https.createServer(HTTPS_OPTOIN, app);
//const httpsServer6 = https.createServer(HTTPS_OPTOIN6, app);
httpsServer.listen(SSL_PORT,'::');
//httpsServer6.listen(SSL_PORT_6);
///////////////////兼容http
/*net.createServer(function(socket){
    socket.once('data', function(buf){
      console.log(buf[0]);
      // https数据流的第一位是十六进制“16”，转换成十进制就是22
      var address = buf[0] === 22 ? SSL_PORT : http_RORT;
      //创建一个指向https或http服务器的链接
      var proxy = net.createConnection(address, function(){
        proxy.write(buf);
         //反向代理的过程，tcp接受的数据交给代理链接，代理链接服务器端返回数据交由socket返回给客户端
         socket.pipe(proxy).pipe(socket);
      }) 
  
      proxy.on('error', function(err) {
        console.log(err)
      })
    })
  
    socket.on('error', function(err){
      console.log(err);
    })
  }).listen(3000);*/ 
  
  console.log(`服务器在端口号${SSL_PORT}上成功运行！`);
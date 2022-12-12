const express=require('express')//导入express包
const app=express()//创建服务器
const joi =require('joi')
const net =require('net')
//////////////////////////////////////////////////////////////////////
//HTTPS相关
const SSL_PORT = 443;
const SSL_PORT_4 = 444;
const http_RORT = 80;
var https = require('https');
var fs = require('fs'); 
var path = require('path');
var privateCrt = fs.readFileSync(path.join(process.cwd(), 'zs/fullchain.crt'), 'utf8');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'zs/private.pem'), 'utf8');
const HTTPS_OPTOIN = {
    key: privateKey,
    cert: privateCrt
}; 
var privateCrt4 = fs.readFileSync(path.join(process.cwd(), 'zs/fullchain.crt'), 'utf8');
var privateKey4 = fs.readFileSync(path.join(process.cwd(), 'zs/private.pem'), 'utf8');
const HTTPS_OPTOIN4 = {
    key: privateKey4,
    cert: privateCrt4
}; 
/////////////////////////////////////////////////////////////////////////
//web服务器
app.use(function(req,res,next){
    res.cc=function(err,status=1){
        res.send({status,message: err instanceof Error ? err.message : err })
    }
    next();
})
const express_jwt=require('express-jwt')
const config=require('./config')
app.use(express_jwt({secret: config.jwtSecretKey}).unless({path:[/^\/api/,'/',/^\/html/]}))
const statistic=require("./router/statistic")
app.use("/html",statistic)//统计访问数据
app.use("/html",express.static('./htmlResources'))
const cors=require('cors');
app.use(cors()) 
app.use(express.urlencoded({ extended: false }))
const user_router=require('./router/user') 
const user_info_router=require('./router/user_info')
const op_router=require('./router/op')
const op4_router=require('./router/op_4')
app.use('/api',user_router)
app.use('/my',user_info_router)
app.use('/op',op_router)
app.use('/op4',op4_router)

app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err)
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err)
    //这里没有next了,运行到这里就截断
})
app.use("/",express.static('./jump'))
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
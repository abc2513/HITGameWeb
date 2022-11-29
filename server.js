const express=require('express')//导入express包
const app=express()//创建服务器
const joi =require('joi')
//////////////////////////////////////////////////////////////////////
//HTTPS相关
const SSL_PORT = 443;
var https = require('https');
var fs = require('fs'); 
var path = require('path');
var privateCrt = fs.readFileSync(path.join(process.cwd(), 'zs/fullchain.crt'), 'utf8');
var privateKey = fs.readFileSync(path.join(process.cwd(), 'zs/private.pem'), 'utf8');
const HTTPS_OPTOIN = {
    key: privateKey,
    cert: privateCrt
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
app.use("/html",express.static('./htmlResources'))
const cors=require('cors');
app.use(cors()) 
app.use(express.urlencoded({ extended: false }))
const userRouter=require('./router/user') 
app.use('/api',userRouter)
const user_infoRouter=require('./router/user_info')
app.use('/my',user_infoRouter)
app.use((err,req,res,next)=>{
    if(err instanceof joi.ValidationError) return res.cc(err)
    if(err.name==='UnauthorizedError') return res.cc('身份认证失败')
    res.cc(err)
    //这里没有next了,运行到这里就截断
})
///////////////////////////////////////////////////////////////////////////
//运行HTTPS服务
const httpsServer = https.createServer(HTTPS_OPTOIN, app);
httpsServer.listen(SSL_PORT, () => {
    console.log(`服务器在端口号${SSL_PORT}上成功运行！`);
});

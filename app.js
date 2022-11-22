const express=require('express')//导入express包
const app=express()//创建服务器
const cors=require('cors')
app.use(cors())//配置cors跨域
app.use(express.urlencoded({extended:false}))//配置解析表单中间件
const userRouter=require('./router/user')
app.use('/api',userRouter)
app.listen(80,()=>{
    console.log('server run!')
})
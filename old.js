const express=require('express')//导入express包
const app=express()//创建服务器
app.use(express.static('./htmlResources'))
app.get('/',(req,res)=>{
    res.send('hello')
})
app.get('/user',(req,res)=>{
    res.send({name:'get'});
    console.log('someone GET')
    console.log(req.query)
})
app.post('/user',(req,res)=>{
    res.send('post');
    console.log('someone POST')
    console.log(req.query)
})
app.post('/user/:id',(req,res)=>{
    res.send('post');
    console.log('someone POST+id')
    console.log(req.query)//参数
    console.log(req.params.id)//动态参数
})



















app.listen(80,()=>{//在指定端口号运行服务器
    console.log('running');
})

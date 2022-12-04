const express=require('express')
const router =express.Router()
const user_handler=require('../router_handler/op_4')
const express_joi=require('@escook/express-joi')
const{reg_schema, login_schema}=require('../schema/op_4')
//router.post('/reguser',express_joi(reg_schema),user_handler.regUser)
module.exports=router 
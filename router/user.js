const express=require('express')
const router =express.Router()
const user_handler=require('../router_handler/user')
const express_joi=require('@escook/express-joi')
const{reg_schema, login_schema}=require('../schema/user')
router.post('/reguser',express_joi(reg_schema),user_handler.regUser)
router.post('/login',express_joi(login_schema),user_handler.login)
module.exports=router 
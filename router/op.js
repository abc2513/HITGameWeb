const express=require('express')
const router =express.Router()
const user_handler=require('../router_handler/op')
//const express_joi=require('@escook/express-joi')
//const{reg_schema, login_schema}=require('../schema/op')
//router.post('/reguser',express_joi(reg_schema),user_handler.regUser)
router.get('all_user_list',user_handler.get_all_user_list)
router.get('user_list',user_handler.get_user_list)
router.post('reset_password',user_handler.reset_password)

module.exports=router 
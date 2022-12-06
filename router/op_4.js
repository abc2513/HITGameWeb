const express=require('express')
const router =express.Router()
const user_handler=require('../router_handler/op_4')
const express_joi=require('@escook/express-joi')
const{reg_schema, login_schema}=require('../schema/op_4')
//router.post('/reguser',express_joi(reg_schema),user_handler.regUser)
router.post('/upgrade_3',user_handler.upgrade_3)
router.post('/downgrade_2',user_handler.downgrade_2)
router.post('/hand_level_4',user_handler.hand_level_4)
module.exports=router 
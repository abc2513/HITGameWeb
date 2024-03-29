const express=require('express')
const expressJoi=require('@escook/express-joi')
const router=express.Router()
const user_info_handler=require('../router_handler/userinfo')
const { update_user_info,create_article,update_article } = require('../schema/user')

router.get('/userinfo',user_info_handler.getUserInfo)
router.post('/userinfo',expressJoi(update_user_info),user_info_handler.updateUserInfo)
router.post('/update_password',user_info_handler.update_password)
router.post('/create_article',user_info_handler.create_article)//expressJoi(create_article),
router.post('/update_article',user_info_handler.update_article)//expressJoi(update_article),
router.get('/article_list',user_info_handler.get_my_article_list);
router.get('/article',user_info_handler.get_my_article)
router.post('/create_comment',user_info_handler.create_comment)
router.post('/delect_comment',user_info_handler.delect_comment)
router.post('/thumbs_up_change',user_info_handler.thumbs_up_change)
router.get('/thumbs_up_check',user_info_handler.thumbs_up_check)
router.post('/upload_webgl',user_info_handler.upload_webgl)
router.get('/my_webgl_list',user_info_handler.get_my_webgl_list)
router.post('/delete_my_webgl',user_info_handler.delete_my_webgl)
module.exports=router
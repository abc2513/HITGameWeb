const { string } = require('joi')
const joi =require('joi')
var name=joi.string().min(2).max(20).required()
var password=joi.string().min(6).max(20).required()
var email=joi.string().email().required()
exports.reg_schema={
    body:{
        name,
        password,
        email
    }
}
name=joi.string().empty([null, ""]).min(2).max(20)
email=joi.string().empty([null, ""]).email().min(2).max(20)
userID=joi.string().empty([null, ""]).min(7).max(8)
exports.login_schema={
    body:{
        name,
        email,
        userID,
        password,
    }
}
password=joi.string().min(6).max(20).empty(null)
exports.update_user_info={
    body:{
        name:joi.string().min(2).max(20).required(),
        email:joi.string().email().required(),
    }
}
exports.create_article={
    body:{
        title:joi.string().required().max(50).min(2),
        kind:joi.required(),
        data:joi.required(),
        article_status:joi.required(),
    }
}
exports.update_article={
    body:{
        title:joi.string().required().max(50).min(2),
        //kind:joi.required(),
        data:joi.required(),
        article_status:joi.required(),
    }
}
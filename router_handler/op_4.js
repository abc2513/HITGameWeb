const db = require("../db/index");
const bcrypt=require('bcryptjs');
const jwt =require('jsonwebtoken')
const config=require('../config')
///////////////////强调！所有操作都需要管理员权限判定！/////////////////
exports.get_all_article_list=(req,res)=>{}
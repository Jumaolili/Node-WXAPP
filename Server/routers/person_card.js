const request = require('request');
const express = require('express');
const path = require('path');



//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection    
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');


router.post('/person_card', function(req, res) {
    var body = req.body;
    var ta_id = body.ta_id;

    //1. 接收参数
    //2. 根据 ta_id 查询 Users 数据库 得到信息（注意抹去关键信息）
    //3. 将结果发送到客户端

    var promise = new Promise(function(resolve, reject) {
        Users.findOne({
            user_id: ta_id
        }, function(err, ret) {
            if (err) {
                reject(err);
            } else {
                resolve(ret);
            }
        })
    })

    promise
        .then(function(ret) {
            //抹去关键信息
            ret._id = null;
            ret.openid = null;
            ret.session_key = null;
            ret.app_token = null;
            ret.__v = null;
            ret.chat = null;
            ret.is_developper = null;
            ret.fans = null;
            ret.like_list = null;
            ret.browser_record = null;

            //console.log(ret);
            res.json({
                err_code: 0,
                ta: ret
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })

})


//4.  导出
module.exports = router;
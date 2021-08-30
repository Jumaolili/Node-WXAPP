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


router.post('/subscribe_check', function(req, res) {
    var body = req.body;
    var user_id = body.user_id;
    var ta_id = body.ta_id;

    //1. 获取参数
    //2. 判断user 的subscribe 中是否有ta_id
    //3. 返回is_subscribed

    var promise = new Promise(function(resolve, reject) {
        Users.findOne({
            user_id: user_id,
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
            //console.log(ret.subscribe);
            //console.log(ta_id)
            var subscribe = ret.subscribe;
            var len = subscribe.length;
            for (let i = 0; i < len; i++) {
                if (subscribe[i].user_id == ta_id) {
                    return res.json({
                        err_code: 0,
                        is_subscribed: true
                    })
                }
            }
            res.json({
                err_code: 0,
                is_subscribed: false
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
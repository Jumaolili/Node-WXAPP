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



router.post('/subscribe_cancel', function(req, res) {
    //1. 接受参数 user_id 以及 ta_id
    //2. 分别更新Users 两位用户的 subscribe 和 fans
    //3. 返回响应值

    var body = req.body;
    var ta_id = body.ta_id;
    var user_id = body.user_id;

    var promise = new Promise(function(resolve, reject) {
        Users.findOneAndUpdate({
            user_id: user_id
        }, {
            $pull: {
                subscribe: {
                    user_id: ta_id
                }
            }
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })

    promise
        .then(function() {
            return new Promise(function(resolve, reject) {
                Users.findOneAndUpdate({
                    user_id: ta_id
                }, {
                    $pull: {
                        fans: {
                            user_id: user_id
                        }
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(err);
                    }
                })
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function() {
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
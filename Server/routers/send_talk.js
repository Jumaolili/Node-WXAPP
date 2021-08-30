const request = require('request');
const express = require('express');
const path = require('path');

//需要读写文件（存图片）
const fs = require('fs');


//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection    
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');


router.post('/send_talk', function(req, res) {
    var body = req.body;
    var user_id = body.user_id;
    var ta_id = body.ta_id;
    var item_record = body.item_record;
    var item_time = new Date().getTime();
    //console.log(body);

    //1. 接受客户端传来的参数
    //2. 更新 Users 数据库 相应双方chat里面的record
    //3. 返回更新完的数据

    var promise = new Promise(function(resolve, reject) {
        Users.findOneAndUpdate({
            user_id: user_id
        }, {
            $push: {
                "$[item].record": {
                    "role": 'me',
                    "item_record": item_record,
                    "item_time": item_time
                }
            }
        }, {
            arrayFilters: [{
                "item": {
                    $type: "object"
                },
                "item.ta_id": ta_id
            }]
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
                    $push: {
                        "$[item].record": {
                            "role": 'ta',
                            "item_record": item_record,
                            "item_time": item_time
                        }
                    }
                }, {
                    arrayFilters: [{
                        "item": {
                            $type: "object"
                        },
                        "item.ta_id": user_id
                    }]
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
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
            //返回新数据
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    user_id: user_id
                }, function(err, ret) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ret);
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
        .then(function(ret) {
            res.json({
                err_code: 0,
                user: ret
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
const request = require('request');
const express = require('express');

//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');
const Cals = require('../dbTypes/db_cal');


router.post('/want', function(req, res) {
    var body = req.body;
    var user_id = body.user_id;
    var c_id = body.c_id;

    //1. 接受参数 
    //2. 根据c_id 检查 Totallists 数据库 的该项商品
    //3. 检查user_id是否在 该项商品的 c_want 列表
    //4. 如果没有 加上   ；  如果有，返回并且报错
    //5. 返回客户端值

    var promise = new Promise(function(resolve, reject) {
        Totallists.findOne({
            c_id: c_id
        }, function(err, ret) {
            if (err) {
                reject(err);
            } else {
                resolve(ret);
            }
        })
    });

    promise
        .then(function(ret) {
            //检查
            var c_want = ret.c_want;
            var len = c_want.length;
            for (let i = 0; i < len; i++) {
                if (c_want[i] == user_id) {
                    return res.json({
                        err_cdeo: 506,
                        msg: 'WX.Check Error'
                    })
                }
            }
            return new Promise(function(resolve, reject) {
                Totallists.findOneAndUpdate({
                    c_id: c_id
                }, {
                    $push: {
                        c_want: user_id
                    },
                    $inc: {
                        want_length: 1
                    }
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
            //返回值
            res.json({
                err_code: 0,
                is_wanted: true
            })

            return new Promise(function(resolve, reject) {
                Cals.findOne({
                    cal_name: 'cal'
                }, function(err, ret) {
                    if (err) {
                        reject(err)
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
            var newNum = ret.cal_total++;
            return new Promise(function(resolve, reject) {
                Cals.findOneAndUpdate({
                    cal_name: 'cal'
                }, {
                    $set: {
                        cal_total: newNum
                    }
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
        })
        .then(function(ret) {

        }, function(err) {
            console.log(err);
        })

})







//4.  导出
module.exports = router;
const request = require('request');
const express = require('express');

//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');

const wx = {
    AppID: 'wx22b51bf41c5c8abb',
    AppSecret: '83ac1047c468f9199568e7683f708db8'
}


router.post("/get_detail", function(req, res) {
    var body = req.body;
    var c_id = body.c_id;
    var good = null;
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
    })

    promise
        .then(function(ret) {
            good = ret;
            // 查找卖家
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    user_id: ret.user_id
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
            var seller = {
                user_id: ret.user_id,
                img_src: ret.img_src,
                name: ret.name
            };
            res.json({
                err_code: 0,
                seller: seller,
                good: good
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
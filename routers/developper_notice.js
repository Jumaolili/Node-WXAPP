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

const wx = {
    AppID: 'wx22b51bf41c5c8abb',
    AppSecret: '83ac1047c468f9199568e7683f708db8'
}


router.post('/developper_notice', function(req, res) {
    var body = req.body;
    var content = body.content;
    var user_id = body.user_id;
    //console.log(content);

    var promise = new Promise(function(resolve, reject) {
        Users.findOne({
            user_id: user_id
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
            return new Promise(function(resolve, reject) {
                if (ret.is_developper == true) {
                    resolve()
                } else if (ret.is_developper == false) {
                    reject()
                }
            })

        }, function(err) {
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                new Notices({
                    content: content,
                    time: new Date().getTime(),
                    name: 'notice'
                }).save(function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            })
        }, function() {
            res.json({
                err_code: 507,
                msg: 'Unknown Error'
            })
        })
        .then(function() {
            res.json({
                err_code: 0,
                msg: '发布成功'
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
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


router.post('/developper_update', function(req, res) {
    var body = req.body;
    var content = body.content;
    var user_id = body.user_id;
    if (key == wx.AppID || key == wx.AppSecret) {
        var promise = new Promise(function(resolve, reject) {
            Users.findOneAndUpdate({
                user_id: user_id
            }, {
                $set: {
                    is_developper: true
                }
            }, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });

        promise
            .then(function() {
                res.json({
                    err_code: 0,
                    isDevelopper: true,
                    msg: '您的权限已更改为开发者'
                })
            }, function(err) {
                console.log(err);
            })
    } else {
        return res.json({
            err_code: 0,
            isDevelopper: false,
            msg: '不是正确的开发者密匙'
        })
    }
})


//4.  导出
module.exports = router;
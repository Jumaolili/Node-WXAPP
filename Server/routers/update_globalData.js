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



router.post('/update_globalData', function(req, res) {
    //在用户进行上传操作后更新 全局变量user
    //1. 接受用户请求 以及 user_id
    //2. 根据user_id 查找 Users数据库，找到用户信息
    //3.  将用户信息 传给客户端
    var body = req.body;
    var user_id = body.user_id;
    //console.log(body);
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
    })

    promise
        .then(function(ret) {
            res.json({
                user: ret
            });
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
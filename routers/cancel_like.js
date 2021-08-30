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

router.post('/cancel_like', function(req, res) {
    var body = req.body;
    var user_id = body.user_id;
    var c_id = body.c_id;

    //console.log(body);

    //1. 接收客户端参数
    //2. 根据user_id查找 Users 数据库
    //3. 更新 Users 中该用户的 like_list 信息
    //4. 返回值

    var promise = new Promise(function(resolve, reject) {
        Users.findOneAndUpdate({
            user_id: user_id
        }, {
            $pull: {
                like_list: {
                    c_id: c_id
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
            res.json({
                err_code: 0,
                code: 1,
                msg: 'Everything is OK...'
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
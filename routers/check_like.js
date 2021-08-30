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


router.post('/check_like', function(req, res) {
    var body = req.body;
    var c_id = body.c_id;
    var user_id = body.user_id;

    //console.log(body);

    //检查是否收藏
    //1. 接受参数
    //2. 根据user_id 查找 Users数据库 用户
    //3. 遍历 like_list是否有 c_id相同的 项
    //4. 返回结果

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
            var like_list = ret.like_list;
            var len = like_list.length;
            for (let i = 0; i < len; i++) {
                if (like_list[i].c_id == c_id) {
                    return res.json({
                        err_code: 0,
                        is_liked: true
                    })
                }
            }

            res.json({
                err_code: 0,
                is_liked: false
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
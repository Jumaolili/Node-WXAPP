const request = require('request');
const express = require('express');

//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');




router.post('/check_want', function(req, res) {
    //1. 接收参数 user_id 和 c_id
    //2. 根据c_id查找 Totallists数据库 该项商品 
    //3. 查找该项商品的c_want 列表项中是否有 user_id相同的项
    // 有    true
    // 没有  false
    //4. 返回客户端响应值 is_wanted: 步骤3中的Boolean
    var body = req.body;
    var c_id = body.c_id;
    var user_id = body.user_id;
    //console.log(body);
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
            var c_want = ret.c_want;
            var len = c_want.length;
            //3. 查找该项商品的c_want 列表项中是否有 user_id相同的项
            for (let i = 0; i < len; i++) {
                if (c_want[i] == user_id) {
                    return res.json({
                        err_code: 0,
                        is_wanted: true
                    })
                }
            }
            res.json({
                err_code: 0,
                is_wanted: false
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
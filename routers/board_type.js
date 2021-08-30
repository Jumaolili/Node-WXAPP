const request = require('request');
const express = require('express');

//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');
const Boards = require('../dbTypes/db_boards');

const wx = {
    AppID: 'wx22b51bf41c5c8abb',
    AppSecret: '83ac1047c468f9199568e7683f708db8'
}


router.post('/board_type', function(req, res) {
    var body = req.body;
    var c_type = body.c_type;
    //console.log(c_type)
    var promise = new Promise(function(resolve, reject) {
        Boards.find({
            c_type: c_type
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
            //console.log(ret);
            res.json({
                err_code: 0,
                board_list: ret
            })
        }, function(err) {
            //console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
})




//4.  导出
module.exports = router;
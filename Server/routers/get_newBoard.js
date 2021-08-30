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

router.post('/get_newBoard', function(req, res) {
    var time = parseInt((new Date().getTime() - 86400000));
    Boards.find({
        begin_time: {
            $gt: time
        }
    }, function(err, ret) {
        if (err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        } else {
            res.json({
                err_code: 0,
                hot_list: ret
            })
        }
    }).limit(6)
})



//4.  导出
module.exports = router;
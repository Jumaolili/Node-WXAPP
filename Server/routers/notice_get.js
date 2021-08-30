const request = require('request');
const express = require('express');
const path = require('path');



//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection    
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');


router.post('/notice_get', function(req, res) {
    var body = req.body;
    Notices.find({

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
                notice: ret
            })
        }
    })
})

//4.  导出
module.exports = router;
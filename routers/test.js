const request = require('request');
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false)


//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');

router.get('/test', function(req, res) {
    // var item_record = 'good',
    //     item_time = '2021';
    // Users.findOneAndUpdate({
    //     name: "test"
    // }, {
    //     $push: {
    //         "chat.$[item]": {
    //             "role": 'me',
    //             "item_record": item_record,
    //             "item_time": item_time
    //         }
    //     }

    // }, {
    //     arrayFilters: {
    //         "item.id": '1'
    //     }
    // }, function(err) {
    //     if (err) {
    //         console.log(err)
    //     } else {
    //         res.send('good')
    //     }
    // })
    Users.findOne({
        name: 'test'
    }, function(err, ret) {
        if (err) {
            console.log(err);
        } else {
            console.log(ret);
            res.send(ret);
        }
    })
})

//4.  导出
module.exports = router;
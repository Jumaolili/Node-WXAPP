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


router.post('/cancel_want', function(req, res) {
    var body = req.body;
    var c_id = body.c_id;
    var user_id = body.user_id;

    var promise = new Promise(function(resolve, reject) {
        Totallists.findOneAndUpdate({
            c_id: c_id
        }, {
            $pull: {
                c_want: user_id
            },
            $inc: {
                want_length: -1
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
                is_wanted: false
            });
            return new Promise(function(resolve, reject) {
                Cals.findOne({
                    cal_name: 'cal'
                }, function(err, ret) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(ret);
                    }
                })
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function(ret) {
            var newNum = ret.cal_total--;
            return new Promise(function(resolve, reject) {
                Cals.findOneAndUpdate({
                    cal_name: 'cal'
                }, {
                    $set: {
                        cal_total: newNum
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                })
            })
        }, function(err) {
            console.log(err);
        })
        .then(function(ret) {

        }, function(err) {
            console.log(err);
        })
})







//4.  导出
module.exports = router;
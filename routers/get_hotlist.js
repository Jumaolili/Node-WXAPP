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


router.post('/get_hotlist', function(req, res) {
    var promise = new Promise(function(resolve, reject) {
        Totallists.find({

        }, function(err, ret) {
            if (err) {
                reject(err);
            } else {
                var len = ret.length;
                resolve(len)
            }
        })
    })

    promise
        .then(function(len) {
            return new Promise(function(resolve, reject) {
                Cals.findOne({
                    cal_name: 'cal'
                }, function(err, ret) {
                    if (err) {
                        reject(err);
                    } else {
                        var num = ret.cal_total;
                        var average = Math.floor(num / len);
                        resolve(average);
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
        .then(function(average) {
            //console.log(str);
            //console.log(typeof average == "number")
            Totallists.find({
                want_length: {
                    $gt: average
                }
            }, function(err, ret) {
                //console.log(ret)
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
const request = require('request');
const express = require('express');
const path = require('path');

//需要读写文件（存图片）
const fs = require('fs');


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


router.post('/publish_cancel', function(req, res) {
    var body = req.body;
    var c_id = body.value.c_id;
    var user_id = body.user_id;

    //1. 接受客户端传来的 c_id
    //2. 在Totallists数据库检索 c_id 相同的物品，之后删除
    //3. 在User 数据库检索 找到该用户 旗下的 list 中的 物品 之后删除 
    //4. 删除 商品 c_img 文件
    //5. 返回用户消息

    var promise = new Promise(function(resolve, reject) {
        //2. 在Totallists数据库检索 c_id 相同的物品，之后删除
        Totallists.findOneAndDelete({
            c_id: c_id
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
            return new Promise(function(resolve, reject) {
                //删除 相应图片
                var c_img = ret.c_img;
                if (c_img) {
                    fs.unlink('.' + c_img, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                } else {
                    resolve();
                }
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                //3. 在User 数据库检索 找到该用户 旗下的 list 中的 物品 之后删除 
                Users.findOneAndUpdate({
                    user_id: user_id
                }, {
                    '$pull': {
                        'list': {
                            'c_id': c_id
                        }
                    }
                }, function(err, ret) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(ret);
                    }
                })
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 504,
                msg: 'Fs Remove Error'
            })
        })
        .then(function(ret) {
            //console.log('成功删除物品...');
            //将新的user信息传回去用于渲染
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    user_id: user_id
                }, function(err, uret) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(uret);
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
            res.json({
                err_code: 0,
                user: ret
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
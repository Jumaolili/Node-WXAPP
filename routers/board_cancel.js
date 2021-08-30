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
const Boards = require('../dbTypes/db_boards');

const wx = {
    AppID: 'wx22b51bf41c5c8abb',
    AppSecret: '83ac1047c468f9199568e7683f708db8'
}


router.post('/board_cancel', function(req, res) {
    var body = req.body;
    var c_id = body.c_id;
    var user_id = body.user_id;
    var c_img = body.c_img;
    //return console.log(body);

    //1. 接受 由客户端传来的 参数c_id user_id c_img
    //2. 查找Users 以及 Boards数据库 并且更新用户数据
    //3. 根据 c_img 进行fs 操作 
    //4. 返回客户

    var promise = new Promise(function(resolve, reject) {
        Boards.findOneAndRemove({
            c_id: c_id
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
            return new Promise(function(resolve, reject) {
                Users.findOneAndUpdate({
                    user_id: user_id
                }, {
                    '$pull': {
                        'board': {
                            'c_id': c_id
                        }
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(err);
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
        .then(function() {
            return new Promise(function(resolve, reject) {
                //删除 相应图片
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
            res.json({
                err_code: 0
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 504,
                msg: 'Fs Remove Error'
            })
        })
})



//4.  导出
module.exports = router;
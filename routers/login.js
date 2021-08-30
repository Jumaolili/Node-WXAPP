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




router.post('/login', function(req, res) {
    //1. 接收客户端数据app_token
    //2. 根据app_token查找 Tokens数据库 得到openid
    //3. 根据openid 查找 Users 数据库 得到用户数据
    //4. 发送用户数据 给客户端 完成渲染
    var body = req.body;
    //body.app_token

    var promise = new Promise(function(resolve, reject) {
        //2. 根据app_token查找 Tokens数据库 得到openid
        Tokens.findOne({
            app_token: body.app_token
        }, function(err, ret) {
            if (err) {
                reject(err);
            } else {
                resolve(ret)
            }
        })
    })

    promise
        .then(function(ret) {

            return new Promise(function(resolve, reject) {
                //3. 根据openid 查找 Users 数据库 得到用户数据
                Users.findOne({
                    openid: ret.openid
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
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function(ret) {
            return res.json({
                err_code: 0,
                msg: 'Everything is OK...',
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
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


//1. 请求微信接口服务，得到openid，和session_key
//2. 将得到的openid与Users数据库进行对比
//2.1 true (说明app_token因为某种原因，例如清理缓存没了，那么授予新app_token)
//3. 授予（新）app_token

//2.2 false(说明为新用户)
//3. 返回值说明为新用户，跳转到注册页面
router.post('/check_register', function(req, res) {
    var body = req.body;
    var openid = null;
    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wx.AppID + '&secret=' +
        wx.AppSecret + '&js_code=' + body.code + '&grant_type=authorization_code';

    var promise = new Promise(function(resolve, reject) {
        //服务器请求微信小程序端口
        request(url, (err, response, body) => {
            //将微信端口发过来的JSON数据变为 对象

            //openid  session_key
            var body = JSON.parse(body);
            openid = body.openid;
            if (!body.openid || !body.session_key) {
                reject(err);
            } else {
                resolve(body);
            }

        })
    });

    promise
        .then(function(body) {

            //将得到的openid与Users数据库进行对比
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    'openid': body.openid
                }, function(err, ret) {
                    if (err) {
                        reject(err);
                    } else {
                        if (!ret) {
                            //console.log('unregistered user')
                            return res.json({
                                err_code: 1,
                                msg: 'unregistered user'
                            })
                        } else {
                            resolve(ret)
                        }
                    }
                })
            })
        }, function(err) {
            return res.json({
                err_code: 500,
                msg: 'WX.API Server Error'
            })
        })
        .then(function(ret) {
            //授予新app_token
            var app_token = 'app_token_' + ret.openid + (Math.random()).toString().split('.')[1];
            return new Promise(function(resolve, reject) {
                Tokens.findOneAndUpdate({
                    'openid': ret.openid
                }, {
                    $set: {
                        'app_token': app_token
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(app_token);
                    }
                })
            })
        }, function(err) {
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function(token) {
            //console.log('授予新app_token......');
            return new Promise(function(resolve, reject) {
                Users.findOneAndUpdate({
                    openid: openid
                }, {
                    $set: {
                        app_token: token
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
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function() {

            return new Promise(function(resolve, reject) {
                Users.findOne({
                    openid: openid
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
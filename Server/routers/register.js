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

router.post('/register', function(req, res) {
    var form_body = req.body;
    //1. 请求微信接口得到 openid 和 session_key
    //2. 在user查找是否有openid 相同的用户（可以省略）
    //3.生成newUser ，存入Users数据库
    //4. 返回用户信息（包括app_token）给用户

    var url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + wx.AppID + '&secret=' +
        wx.AppSecret + '&js_code=' + form_body.code + '&grant_type=authorization_code';

    var promise = new Promise(function(resolve, reject) {
        //服务器请求微信小程序端口
        request(url, (err, response, body) => {
            //将微信端口发过来的JSON数据变为 对象

            //openid  session_key
            var body = JSON.parse(body);
            if (!body.openid || !body.session_key) {
                reject(err);
            } else {
                resolve(body);
            }
        })
    });

    promise
        .then(function(body) {
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    openid: body.openid
                }, function(err, ret) {
                    if (err) {
                        reject(err);
                    } else {
                        if (!ret) {
                            resolve(body);
                        } else {
                            return res.json({
                                err_code: 502,
                                msg: 'No repeat register'
                            })
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
        .then(function(body) {
            console.log('准备创建新User信息...');



            return new Promise(function(resolve, reject) {
                var newUser = {
                    openid: body.openid,
                    session_key: body.session_key,
                    app_token: 'app_token_' + body.openid + (Math.random()).toString().split('.')[1],
                    is_developper: false,
                    name: form_body.value.name,
                    user_id: new Date().getTime(),
                    phonenumber: form_body.value.phonenumber,
                    qqnumber: form_body.value.qqnumber,
                    department: form_body.value.department,
                    major: form_body.value.major,
                    list: [],
                    chat: [],
                    like_list: [],
                    browser_record: [],
                    fans: [],
                    subscribe: [],
                    buy_list: [],
                    board: []
                }

                new Users(newUser)
                    .save(function(err) {
                        if (err) {
                            reject(err)
                        } else {
                            console.log('新用户注册成功...')
                            resolve(newUser);
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
        .then(function(newUser) {

            //将授予newUser的app_token存入Tokens数据库
            return new Promise(function(resolve, reject) {
                new Tokens({
                    session_key: newUser.session_key,
                    openid: newUser.openid,
                    app_token: newUser.app_token
                }).save(function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(newUser);
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
        .then(function(newuser) {
            console.log('新用户app_token成功存入数据库...')
            res.json({
                err_code: 0,
                msg: 'Everything is OK...',
                user: newuser
            })
        }, function(err) {
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })


})




//4.  导出
module.exports = router;
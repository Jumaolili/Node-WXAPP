const request = require('request');
const express = require('express');

//创建可模块化，可挂载的路由句柄
const router = express.Router();

//载入数据库内collection
const Users = require('../dbTypes/db_users');
const Notices = require('../dbTypes/db_notices');
const Tokens = require('../dbTypes/db_tokens');
const Totallists = require('../dbTypes/db_totallists');


router.post('/create_talk', function(req, res) {

    var body = req.body;
    var ta_id = body.seller_id;
    var user_id = body.user_id;
    var ta_img = body.seller_img;
    var user_img = body.user_img;

    //return console.log(body);

    //1. 接受客户端传来的参数   ta_id     发起人用户（我）user_id
    //2. 分别在 seller  和  user 两个用户上的chat数组 创建item项
    //2.1  注意：判断chat上是否之前已经有两个用户之间对话的项
    //3. 返回客户端值 使其进入对话页面

    //return console.log(body);


    //在用户（我）user 的chat里创建item项
    //判 断 ！！
    var promise = new Promise(function(resolve, reject) {
        Users.findOne({
            user_id: user_id
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
                var chat = ret.chat;
                var len = chat.length;
                for (let i = 0; i < len; i++) {
                    //找到之前存在会话
                    if (chat[i].ta_id == ta_id) {
                        //直接下一步
                        //console.log('过去曾向ta发起过对话')
                        return resolve();
                    }
                }
                //没找到
                var item = {
                    is_hiden: false,
                    ta_id: ta_id,
                    ta_img: ta_img,
                    me_id: user_id,
                    record: [],
                    char_time: new Date().getTime()
                }
                Users.findOneAndUpdate({
                    user_id: user_id
                }, {
                    $push: {
                        chat: item
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        //console.log('成功添加向ta的对话')
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

            //在ta里添加对话
            return new Promise(function(resolve, reject) {
                Users.findOne({
                    user_id: ta_id
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
            return new Promise(function(resolve, reject) {
                var chat = ret.chat;
                var len = chat.length;
                for (let i = 0; i < len; i++) {
                    //找到之前存在会话
                    if (chat[i].ta_id == user_id) {
                        //直接下一步
                        //console.log('过去你曾与ta发起过对话');
                        return resolve();
                    }
                }
                //没找到
                var item = {
                    is_hiden: false,
                    ta_id: user_id,
                    ta_img: user_img,
                    me_id: ta_id,
                    record: [],
                    char_time: new Date().getTime()
                }
                Users.findOneAndUpdate({
                    user_id: ta_id
                }, {
                    $push: {
                        chat: item
                    }
                }, function(err) {
                    if (err) {
                        reject(err);
                    } else {
                        //console.log('成功在ta添加与你的对话')
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

            //console.log('对话创建完成.................');
            res.json({
                err_code: 0,
                is_ready: true
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
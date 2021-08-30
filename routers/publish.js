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


router.post('/publish', function(req, res) {
    //1. 接受客户端传输的数据
    //other  value  picture_base64 
    //2. 生成一份物品信息
    //3. 将信息存入Totallists数据库 和 Users数据库 用户名下的list
    //4. 返回信息给客户端 



    var body = req.body;
    //console.log(body);
    var c_type = body.other.c_type;
    var usage_degree = body.other.usage_degree;
    var user_id = body.other.user_id;
    var major = body.other.major;
    var c_name = body.value.c_name;
    var c_price = body.value.c_price;
    var c_description = body.value.c_description;
    var picture_base64 = body.picture_base64;

    //预制key
    var c_img = '/user_src/good_img/none.jpg';
    var c_id = user_id + '_' + (Math.random().toString().split('.')[1]);

    //有图片就要存入服务器
    var promise = new Promise(function(resolve, reject) {
        if (picture_base64) {
            //有上传图片
            //过滤data:URL
            var base64Data = picture_base64.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = Buffer.from(base64Data, 'base64');
            var url = './user_src/good_img/' + user_id + '_' + (Math.random().toString().split('.')[1]) + '.jpg';
            fs.writeFile(url, dataBuffer, function(err) {
                if (err) {
                    reject(err);
                } else {
                    //console.log('物品图片上传成功...');
                    resolve(url);
                }
            });

        } else {
            //没有上传
            resolve(null)
        }
    })

    promise
        .then(function(url) {
            if (url) {
                c_img = url.split('.')[1] + '.jpg';
            }
            //整合为一个 new item
            var item = {
                is_sold: false,
                c_type: c_type,
                c_description: c_description,
                c_img: c_img,
                usage_degree: usage_degree,
                c_id: c_id,
                c_name: c_name,
                c_price: parseInt(c_price),
                c_time: parseInt(new Date().getTime()),
                user_id: user_id,
                major: major,
                c_want: [],
                want_length: 0
            };

            //存入Totallists数据库
            return new Promise(function(resolve, reject) {
                new Totallists(item).save(function(err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve(item);
                    }
                })
            })
        }, function(err) {
            console.log(err);
            res.json({
                err_code: 503,
                msg: 'Fs Write Error'
            })
        })
        .then(function(item) {
            //console.log('成功存入Totallists数据库...');
            return new Promise(function(resolve, reject) {
                //更新用户list
                Users.findOneAndUpdate({
                    user_id: user_id
                }, {
                    $push: {
                        list: item
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
            //console.log('成功添加到用户list...');
            res.json({
                err_code: 0,
                msg: 'Everything is OK...'
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
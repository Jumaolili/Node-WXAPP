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


router.post('/publish_update', function(req, res) {
    var body = req.body;
    //console.log(body);
    var c_id = body.c_id;
    var c_type = body.other.c_type;
    var c_img = body.other.c_img;
    var user_id = body.other.user_id;
    var usage_degree = body.other.usage_degree;
    var c_name = body.value.c_name;
    var c_price = parseInt(body.value.c_price);
    var c_description = body.value.c_description;
    var picture_base64 = body.picture_base64;

    //1. 接受客户端传来的参数
    //2. 判断picture_base64是否为 null  
    //null  c_img直接为原来的值
    //有值  删除原来的c_img下的文件 ，转码存入新img,更改c_img
    //3. 更改数据库Totallists下，该商品的数据
    //4. 更改数据库 Users下，该用户名下的 该商品数据
    //5. 返回客户端
    var promise = new Promise(function(resolve, reject) {
        if (!picture_base64) {
            resolve();
        } else {
            //删除原来的图片
            //转码存储新的图片
            //更改c_img的值
            fs.unlink('.' + c_img, function(err) {
                if (err) {
                    reject(err)
                } else {
                    resolve('save');
                }
            })
        }
    })

    promise
        .then(function(token) {
            return new Promise(function(resolve, reject) {
                if (token == 'save') {
                    var base64Data = picture_base64.replace(/^data:image\/\w+;base64,/, "");
                    var dataBuffer = Buffer.from(base64Data, 'base64');
                    var url = './user_src/good_img/' + user_id + '_' + (Math.random().toString().split('.')[1]) + '.jpg';
                    fs.writeFile(url, dataBuffer, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(url);
                        }
                    });
                } else {
                    resolve()
                }
            })

        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 504,
                msg: 'Fs Remove Error'
            })
        })
        .then(function(url) {
            console.log('原物品img已经完成更改...')
            if (url) {
                c_img = url.split('.')[1] + '.jpg';
            }
            //开始对数据库进行操作...
            return new Promise(function(resolve, reject) {
                Totallists.findOneAndUpdate({
                    c_id: c_id
                }, {
                    $set: {
                        c_img: c_img,
                        c_type: c_type,
                        usage_degree: usage_degree,
                        c_name: c_name,
                        c_price: c_price,
                        c_description: c_description
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
                err_code: 503,
                msg: 'Fs Write Error'
            })
        })
        .then(function() {
            return new Promise(function(resolve, reject) {
                Users.findOneAndUpdate({
                    user_id: user_id
                }, {
                    $set: {
                        "list.$[item].c_img": c_img,
                        "list.$[item].c_type": c_type,
                        "list.$[item].usage_degree": usage_degree,
                        "list.$[item].c_name": c_name,
                        "list.$[item].c_price": c_price,
                        "list.$[item].c_description": c_description
                    }
                }, {
                    arrayFilters: [{
                        "item": {
                            $type: "object"
                        },
                        "item.c_id": c_id
                    }],
                    multi: true
                }, function(err) {
                    if (err) {
                        reject(err)
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
            console.log('至此物品编辑完成...');
            res.json({
                err_code: 0
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
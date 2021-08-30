const request = require('request');
const express = require('express');

//加载MD5 模块
const crypto = require('crypto');

//封装加密函数
function cryptoTran(str) {
    var md5 = crypto.createHash('md5');
    return md5.update(str).digest('hex');
}

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

const avoid_words = [];

//科大讯飞 id key
const APPID = '71b15301';
const ApiKey = '39a8b8cf16e2d82ebfad0b0f1d8401ca';

router.post('/search_special', function(req, res) {
    var body = req.body;
    var what = body.what;
    //console.log(what);
    //1. 接受客户端请求信息，要求查询的 字符串（what）
    //2. 请求科大讯飞 关键字 API 获得关键字array
    //3. 根据关键字array 检索Totallists数据库 获得list
    //4. 将list 返回到客户端

    //准备参数
    var X_Appid = APPID;


    var promise = new Promise(function(resolve, reject) {
        var X_CurTime = Math.floor(new Date().getTime() / 1000);

        var str = JSON.stringify({
            'type': 'dependent'
        });

        // create a buffer
        const buff = Buffer.from(str, 'utf-8');

        // encode buffer as Base64
        const base64 = buff.toString('base64');

        var X_CheckSum = cryptoTran(ApiKey + X_CurTime + base64);
        request({
            url: 'https://ltpapi.xfyun.cn/v1/ke',
            method: 'POST',
            json: true,
            headers: {

                'X-Appid': X_Appid,
                'X-CurTime': X_CurTime,
                'X-Param': base64,
                'X-CheckSum': X_CheckSum,

            },
            form: {
                'text': what
            },

        }, function(error, response, body) {

            if (body.code == '0') {
                resolve(body.data.ke);
            } else {
                reject()
            }
        })
    });

    promise
        .then(function(array) {
                var words = []
                    //对关键词进行简单处理
                array.forEach(item => {
                    words.push(item.word);
                })

                var obj = null;
                if (words.length == 1) {
                    obj = {
                        'c_name': {
                            $regex: words[0]
                        }
                    }
                } else if (words.length == 2) {
                    obj = {
                        '$or': [{
                                'c_name': {
                                    $regex: words[0]
                                }
                            },
                            {
                                'c_name': {
                                    $regex: words[1]
                                }
                            }
                        ]
                    }
                } else {
                    obj = {
                        '$or': [{
                                'c_name': {
                                    $regex: words[0]
                                }
                            },
                            {
                                'c_name': {
                                    $regex: words[1]
                                }
                            },
                            {
                                'c_name': {
                                    $regex: words[2]
                                }
                            }
                        ]
                    }
                }

                return new Promise(function(resolve, reject) {
                    Totallists.find(obj, function(err, ret) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(ret);
                        }
                    })
                })


            },
            function() {
                res.json({
                    err_code: 505,
                    msg: 'Ke.API Server Error'
                })
            })
        .then(function(ret) {
            res.json({
                err_code: 0,
                list: ret
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
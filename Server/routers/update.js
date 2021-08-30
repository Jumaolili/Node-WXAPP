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


router.post('/update', function(req, res) {
    var body = req.body;
    //console.log(body);
    //1. 接受客户端数据
    //2. 判断是否上传了 图片  1.上传了，那就要解码，存入服务器，而且还要把原来的的文件删除  2.没有，是null，不用管了
    //3. 根据user_id 找到User   
    //4. 对User 进行值更新 
    //5. 将更新完的 User 信息 发送回 客户端
    // body.form.value
    // body.picture_base64
    // body.origin_path

    var promise = new Promise(function(resolve, reject) {
        if (body.picture_base64) {
            //接收前台POST过来的base64
            var imgData = body.picture_base64;
            //过滤data:URL
            var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
            var dataBuffer = Buffer.from(base64Data, 'base64');
            var url = './user_src/user_img/' + body.form.value.user_id + '_' + (Math.random().toString().split('.')[1]) + '.jpg';
            fs.writeFile(url, dataBuffer, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(url);
                }
            });
        } else {
            resolve(null)
        }
    })

    promise
        .then(function(url) {
            return new Promise(function(resolve, reject) {
                if (url) {
                    // 对User 进行值更新 
                    Users.findOneAndUpdate({
                        user_id: body.form.value.user_id
                    }, {
                        $set: {
                            name: body.form.value.name,
                            phonenumber: body.form.value.phonenumber,
                            qqnumber: body.form.value.qqnumber,
                            department: body.form.value.department,
                            major: body.form.value.major,
                            img_src: url.split('.')[1],
                        }
                    }, function(err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                } else {
                    Users.findOneAndUpdate({
                        user_id: body.form.value.user_id
                    }, {
                        $set: {
                            name: body.form.value.name,
                            phonenumber: body.form.value.phonenumber,
                            qqnumber: body.form.value.qqnumber,
                            department: body.form.value.department,
                            major: body.form.value.major
                        }
                    }, function(err) {
                        if (err) {
                            console.log(err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    })
                }
            })
        }, function(err) {
            console.log(err);
            res.json({
                err_code: 503,
                msg: 'Fs Write Error'
            })
        })
        .then(function() {
            //console.log('数据修改完成...');
            return new Promise(function(resolve, reject) {
                //查找User信息，并且返回
                Users.findOne({
                    user_id: body.form.value.user_id
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
        .then(function(uret) {
            //console.log('查找成功 ...');

            return new Promise(function(resolve, reject) {
                if (body.picture_base64) {
                    //删除原来的图片
                    var remove_url = '.' + body.origin_path + '.jpg';
                    fs.unlink(remove_url, function(err) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(uret)
                        }
                    })
                } else {
                    resolve(uret);
                }
            })
        }, function(err) {
            console.log(err);
            return res.json({
                err_code: 501,
                msg: 'DB Server Error'
            })
        })
        .then(function(uret) {
            //console.log('原头像文件删除成功...');
            res.json(uret);
        }, function(err) {
            return res.json({
                err_code: 504,
                msg: 'Fs Remove Error'
            })
        })

})



//4.  导出
module.exports = router;
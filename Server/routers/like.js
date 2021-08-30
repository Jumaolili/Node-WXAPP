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


router.post('/like', function(req, res) {
    var body = req.body;
    var c_id = body.c_id;
    var c_img = body.c_img;
    var c_name = body.c_name;
    var seller_id = body.seller_id;
    var c_description = body.c_description;
    var c_price = body.c_price;

    var user_id = body.user_id;

    var item = {
        c_id: c_id,
        c_img: c_img,
        c_name: c_name,
        c_price: c_price,
        c_description: c_description,
        seller_id: seller_id
    }

    //console.log(body);
    //1. 接受参数 

    //2. 存入到用户 like_list 里面

    // if(seller_id==user_id){
    //     //不能收藏自己的商品，应该显示已拥有
    //     return res.json({
    //         err_code:3,
    //         msg:'不能收藏自己的商品'
    //     })
    // }

    var promise = new Promise(function(resolve, reject) {
        Users.findOneAndUpdate({
            user_id: user_id
        }, {
            $push: {
                like_list: item
            }
        }, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    });

    promise
        .then(function() {
            //console.log('成功收藏');
            res.json({
                err_code: 0,
                code: 0,
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
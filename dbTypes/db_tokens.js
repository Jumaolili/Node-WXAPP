//引包
const mongoose = require('mongoose');

//调用构造
const Schema = mongoose.Schema;

//连接数据库(后期要改localhost为真实公网ip地址)
mongoose.connect('mongodb://120.77.247.120:27017/wxapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//设计数据结构
const newToken = new Schema({
    openid: {
        type: String,
        require: true
    },
    session_key: {
        type: String,
        require: true
    },
    app_token: {
        type: String,
        require: true
    }
})



//调用model
const Token = mongoose.model('Token', newToken);

var promise = new Promise(function(resolve, reject) {
    Token.find(function(err, ret) {
        if (err) {
            reject(err)
        } else if (ret.length == 0) {
            //插入测试数据
            resolve();
        }
    })
})

promise
    .then(function() {
        //如果没有实例那就插入test实例
        new Promise(function(resolve, reject) {
            new Token({
                openid: 'test',
                session_key: 'test',
                app_token: 'test'
            }).save(function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        })
    }, function(err) {
        console.log(err);
    })
    .then(function() {
        console.log('测试 Token 添加成功');
    }, function(err) {
        console.log(err);
    })



//调出数据模型
module.exports = Token;
//引包
const mongoose = require('mongoose');

//调用构造
const Schema = mongoose.Schema;

//连接数据库(后期要改localhost为真实公网ip地址)
mongoose.connect('mongodb://120.77.247.120:27017/wxapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//设计数据结构
const newNotice = new Schema({
    content: {
        type: String,
        require: true
    },
    time: {
        type: String,
        require: true,
        default: new Date().getTime()
    },
    name: {
        type: String,
        require: true
    }
})



//调用model
const Notice = mongoose.model('Notice', newNotice);

var promise = new Promise(function(resolve, reject) {
    Notice.find(function(err, ret) {
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
            new Notice({
                content: '感谢您的使用，更多功能将会在后续更新（也许）中完善，如有疑问以及bug反馈，请发送至邮箱：601909441@qq.com',
                time: new Date().getTime(),
                name: '开发者'
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
        console.log('测试 notice item 添加成功');
    }, function(err) {
        console.log(err);
    })




//调出数据模型
module.exports = Notice;
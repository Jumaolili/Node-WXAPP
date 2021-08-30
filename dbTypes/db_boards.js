//引包
const mongoose = require('mongoose');

//调用构造
const Schema = mongoose.Schema;

//连接数据库(后期要改localhost为真实公网ip地址)
mongoose.connect('mongodb://120.77.247.120:27017/wxapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//设计数据结构
const newItem = new Schema({
    c_type: {
        type: String,
        require: true
    },
    c_description: {
        type: String,
        require: true
    },
    c_img: {
        type: String,
        require: true
    },
    c_id: {
        type: String,
        require: true
    },
    c_name: {
        type: String,
        require: true
    },
    usage_degree: {
        type: String,
        require: true
    },

    c_price: {
        type: Number,
        require: true,
        default: 0
    },
    begin_time: {
        type: Number,
        require: true,
        default: parseInt(new Date().getTime())
    },

    user_id: {
        type: String,
        require: true
    }

})



//调用model
const Boards = mongoose.model('Board', newItem);

var promise = new Promise(function(resolve, reject) {
    Boards.find({

    }, function(err, ret) {
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
            new Boards({
                c_type: 'test',
                c_description: 'test',
                c_img: '/public/image/users/test.png',
                c_id: 'test',
                c_name: 'test',

                usage_degree: 'test',
                c_price: 0,
                begin_time: parseInt(new Date().getTime()),
                user_id: 'test'

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
        console.log('测试 Board item项 添加成功');
    }, function(err) {
        console.log(err);
    })


//调出数据模型
module.exports = Boards;
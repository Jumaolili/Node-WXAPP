//引包
const mongoose = require('mongoose');

//调用构造
const Schema = mongoose.Schema;

//连接数据库(后期要改localhost为真实公网ip地址)
mongoose.connect('mongodb://120.77.247.120:27017/wxapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

//设计数据结构
const newUser = new Schema({
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
    },
    is_developper: {
        type: Boolean,
        require: true,
        default: false
    },
    name: {
        type: String,
        require: true
    },
    user_id: {
        type: String,
        require: true
    },
    phonenumber: {
        type: String,
        require: false,
        default: '未填写'
    },
    qqnumber: {
        type: String,
        require: false,
        default: '未填写'
    },
    department: {
        type: String,
        require: false,
        default: '未填写'
    },
    major: {
        type: String,
        require: false,
        default: '未填写'
    },
    list: {
        type: Array,
        require: true,
        default: []
    },
    chat: {
        type: Array,
        require: true,
        default: []
    },
    like_list: {
        type: Array,
        require: true,
        default: []
    },
    browser_record: {
        type: Array,
        require: true,
        default: []
    },
    fans: {
        type: Array,
        require: true,
        default: []
    },
    subscribe: {
        type: Array,
        require: true,
        default: []
    },
    buy_list: {
        type: Array,
        require: true,
        default: []
    },
    img_src: {
        type: String,
        require: false,
        default: '/public/image/users/test.png'
    },
    board: {
        type: Array,
        require: true,
        default: []
    }

})


//调用model
const User = mongoose.model('User', newUser);

var promise = new Promise(function(resolve, reject) {
    User.find(function(err, ret) {
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
            new User({
                openid: 'test',
                session_key: 'test',
                app_token: 'test',
                is_developper: false,
                name: 'test',
                user_id: 'test',
                img_src: '/public/image/users/',
                list: [],
                chat: [],
                like_list: [],
                browser_record: [],
                fans: [],
                subscribe: [],
                buy_list: [],
                board: []
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
        console.log('测试 User 添加成功');
    }, function(err) {
        console.log(err);
    })


//调出数据模型
module.exports = User;
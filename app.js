const express = require('express')
const bodyParser = require('body-parser');
const arttemplate = require('art-template');
const path = require('path');
const fs = require('fs');
const request = require('request');

//引入express-ws库
const expressWs = require('express-ws');

//引入websocket库
const WebsocketServer = require('websocket').server;

//引入路由器
const check_register_router = require('./routers/check_register');
const register_router = require('./routers/register');
const login_router = require('./routers/login');
const update_router = require('./routers/update');
const publish_router = require('./routers/publish');
const update_globalData = require('./routers/update_globalData');
const publish_cancel_router = require('./routers/publish_cancel');
const publish_update_router = require('./routers/publish_update');
const publish_get_router = require('./routers/publish_get');
const get_detail_router = require('./routers/get_detail');
const search_type_router = require('./routers/search_type');
const search_special_router = require('./routers/search_special');
const like_router = require('./routers/like');
const check_like_router = require('./routers/check_like');
const cancel_like_router = require('./routers/cancel_like');
const check_want_router = require('./routers/check_want');
const want_router = require('./routers/want');
const cancel_want_router = require('./routers/cancel_want');
const create_talk_router = require('./routers/create_talk');
const send_talk_router = require('./routers/send_talk');
const get_hotlist_router = require('./routers/get_hotlist');
const board_publish_router = require('./routers/board_publish');
const board_cancel_router = require('./routers/board_cancel');
const board_get_router = require('./routers/board_get');
const board_detail_router = require('./routers/board_detail');
const board_type_router = require('./routers/board_type');
const board_special_router = require('./routers/board_special');
const get_newBoard_router = require('./routers/get_newBoard');
const person_card_router = require('./routers/person_card');

const person_subscribe_router = require('./routers/person_subscribe');
const subscribe_check_router = require('./routers/subscribe_check');
const subscribe_cancel_router = require('./routers/subscribe_cancel');

const notice_get_router = require('./routers/notice_get');

const developper_update = require('./routers/developper_update');
const developper_notice = require('./routers/developper_notice');

const test = require('./routers/test');
//开启服务
const app = express();

// //绑定app 与 expressWs
// expressWs(app);


// //开发者wx
// const wx = {
//     appid: 'wx22b51bf41c5c8abb', //开发者appid
//     secret: '83ac1047c468f9199568e7683f708db8' //开发者secret
// }

//配置bodyparser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

//开放静态资源(后期需要用来开放 users和goods图片文件)
app.use('/node_modules', express.static('./node_modules/'));
app.use('/public', express.static('./public'));
app.use('/user_src', express.static('./user_src'));

//挂载路由
app.use(check_register_router);
app.use(register_router);
app.use(login_router);
app.use(update_router);
app.use(publish_router);
app.use(update_globalData);
app.use(publish_cancel_router);
app.use(publish_update_router);
app.use(get_detail_router);
app.use(publish_get_router);
app.use(search_type_router);
app.use(search_special_router);
app.use(like_router);
app.use(check_like_router);
app.use(cancel_like_router);
app.use(check_want_router);
app.use(want_router);
app.use(cancel_want_router);
app.use(create_talk_router);
app.use(send_talk_router);
app.use(get_hotlist_router);
app.use(board_publish_router);
app.use(board_cancel_router);
app.use(board_get_router);
app.use(board_detail_router);
app.use(board_type_router);
app.use(board_special_router);
app.use(get_newBoard_router);
app.use(person_card_router);
app.use(person_subscribe_router);
app.use(subscribe_check_router);
app.use(subscribe_cancel_router);
app.use(notice_get_router);
app.use(developper_update);
app.use(developper_notice);

app.use(test);



// 开启服务器 
app.listen(3000, function() {
    console.log("server is running now ......")
})
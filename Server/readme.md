1.数据库     

项目数据库数据库： dbTypes/
                        /db_users
                        /db_totallists
                        /db_tokens
                        /db_notices
                        /db_boards
-------------------------------------------------------------------------------------------------------------------

2.路由器设计(router design)


|   请求方法      |   请求路径    |   get参数     |    post参数                         |   目的                 |

----------------------注册登录模块------------------------------------------------------------------
1    post                /check_register                 code                           读取app_token缓存失败
                                                                                        检查用户是否曾经注册过？
                                                                                        >注册过  直接登录
                                                                                        >没注册  用户选择是否注册  

2    post                /register                       code                           用户选择注册

3    post                /login                          app_token                      读取app_token缓存成功，登录
4    post                /update             form.value.(...) 和 picture_base64         更改用户信息，上传头像img

----------------------- 业务逻辑 -------------------------------------------------------------------
5    post                /publish            form.value.(...) 和 picture_base64         上传商品信息
6    post                /publish_update                  商品各项数据                    更新商品信息
7    post                /get_detail                    c_id                            获取商品详细信息

8    post                /publish_cancel                 c_id                           下架物品
9    post                /publish_get                                                    抓取全部Totallists数据库商品

10    post                /update_globalData           user_id                      在一些上传操作后更新用户信息

11   post                /search_type                   c_type                          根据种类查询物品  

12   post                /search_special                what(字符串)                    根据输入查询

------------------------ 商品收藏 以及 收藏检测---------------------------------------------------------

13   post                /like                           商品信息                         用户添加商品到 like_list
14   post                /check_like                     c_id user_id              检测用户是否收藏了该商品，用于渲染
15   post                /cancel_like                    c_id user_id                              用户取消收藏

------------------------ 互动消息发送  （采用轮询）-----------------------------------------------------------

16   post                /create_talk                  user_id , seller_id              创建对话
17   post                /send_talk                        item_record                  发送消息

------------------------想要 --------------------------------------------------------------------------------

18   post                /want                        c_id user_id                   加入物品c_want （推荐权重）
19   post                /cancel_want                 c_id user_id                   取消c_want 
20   post                /check_want                  c_id user_id                   检查是否想要

------------------------热门商品------------------------------------------------------------------------------
21   post                /get_hotlist                                             抓取热门商品

------------------------记录浏览记录---------------------------------------------------------------------------

22(废弃)   post                /browser_record              c_id,user_id                  将浏览记录写入用户下 


--------------------------求购--------------------------------------------------------------------------------
23   post                /board_publish                  相关                           发布用户求购
24   post                /board_cancel                  user_id,c_id                    取消用户求购
25   post                /board_get                                                抓取全部Boards数据库商品
26   post                /board_detail                   c_id                           获取求购帖子详细信息

27   post                /board_type                     c_type                         获取特定类型的求购贴
28   post                /board_special                     what                        获取想要的求购贴
29   post                /get_newBoard                                                  获取最新的求购帖子

--------------------------用户关系，关注，粉丝和个人信息---------------------------------------------------------
30   post                /person_subscribe               ta_id,user_id                    关注他人
31   post                /person_getFans                  user_id                       获取自己的粉丝
32   post                /person_card                      ta_id                         获取他人主页

33   post                /subscribe_check               ta_id , user_id                     检查关注
34   post                /subscribe_cancel              ta_id , user_id                     取消关注


---------------------------【开发者】------------------------------------------------------------

35   post                /developper_notice                                             对所有用户发送通知    
36   post                /developper_update                secret_token                 将用户权限更改为开发者


-----------------------------【通知】-------------------------------------------------------------
37   post                /notice_get                                                    获取通知


-----------------------------【补充】-----------------------------------------------------------




3.服务器websocket设计(废弃)

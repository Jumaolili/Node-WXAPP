// pages/mychat/mychat.js
var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    //聊天列表
    chat:[],

    //最新通知
    content:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //1. 获取用户 chat 列表
    //2. 渲染页面

    //开启轮询
    
    if(app.globalData.user==null){
      return wx.reLaunch({
        url: '/pages/me/me',
        success:function(res){
          wx.showToast({
            title: '您还没有注册',
            icon:'none'
          })
        }
      })
    }


    wx.showLoading({
      title: '刷新页面ing',
      mask:true
    })
    
    var that=this;
    var user_id=app.globalData.user.user_id;
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/update_globalData',
        method:'POST',
        dataType:'json',
        data:{
          user_id:user_id
        },
        success:function(res){
          resolve(res);
        },
        fail:function(err){
          reject(err);
        }
      })
    });

    promise 
      .then(function(res){  
        //获取res.data.user
        app.globalData.user=res.data.user;
        
        that.setData({
          chat:res.data.user.chat
        })
        console.log(res.data.user.chat)
        //获取notice
        return new Promise(function(resolve,reject){
          wx.request({
            url: 'https://jumaolili.icu:443/notice_get',
            method:'POST',
            dataType:'json',
            data:{

            },
            success:function(res){
              resolve(res);
            },
            fail:function(err){
              reject(err);
            }
          })
        })
       
      },function(err){
        console.log(err); 
      })
      .then(function(res){
        var notice=res.data.notice;
        that.setData({
          content:notice[notice.length-1].content
        })
        wx.hideLoading({
          success: (res) => {
            wx.show;
          },
        })
      },function(err){
        console.log(err);
      })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  //自定义函数
  goTochat:function(e){
    
    //console.log(e.target.dataset.ta_id)
    //1. 获取 ta_id user_id 
    //2. 跳转到chat_room
    //3. 请求服务器

    wx.reLaunch({
      url: '/pages/chat_room/chat_room?ta_id='+e.target.dataset.ta_id
    })

  },

  get_notice:function(e){
    wx.reLaunch({
      url: '/pages/notice/notice',
    })
  },

  hide_talk:function(e){
    //console.log(e.target.dataset.ta_id)
    var user_id=app.globalData.user.user_id;
    var ta_id=e.target.dataset.ta_id;

    wx.showModal({
      title:'删除对话',
      content:'是否删除与该用户的对话',
      cancelColor: 'red',
      cancelText:'取消',
      confirmColor:'green',
      confirmText:'确认',
      success:function(res){
        if(res.cancel){
          return wx.showToast({
            title: '取消',
            icon:'none'
          })
        }else if(res.confirm){
          wx.showLoading({
            title: '正在移除',
            mask:true
          })
          //开始向服务器发送请求
          //修改完后跳转
          var promise=new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/hide_talk',
              method:"POST",
              dataType:'json',
              data:{
                user_id:user_id,
                ta_id:ta_id
              },
              success:function(res){
                //res.data.is_remove
                if(res.data.is_remove){
                  resolve();
                }
              },
              fail:function(err){
                reject(err);
              }
            })
          });

          promise.then(function(){
            wx.reLaunch({
              url: '/pages/me/me',
              success:function(){
                setTimeout(function(){
                  wx.reLaunch({
                    url: '/pages/mychat/mychat',
                    success:function(){
                      wx.hideLoading({
                        success: (res) => {
                          wx.show
                        },
                      })
                    }
                  })
                },500)
              }
            })
          },function(err){
            console.log(err);
          })
        }
      }
    })
  }

  
})
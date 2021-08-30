// pages/person_card/person_card.js

var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: { 
    //他人的c_id
    ta_id:null,
    //他人信息
    ta:null,
    c_id:null,

    //返回页面类型
    return_type:null,
    //是否关注了
    is_subscribed:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.ta_id)
    var ta_id=options.ta_id;
    var c_id=options.c_id;
    var return_type=options.return_type;

    var user_id=app.globalData.user.user_id;
    var that=this;
    that.setData({
      ta_id:ta_id,
      c_id:c_id,
      return_type:return_type
    })

    //1. 请求服务器返回 用户ID为 ta_id的 用户信息
    //2. 渲染界面

    var promise = new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/person_card',
        method:'POST',
        dataType:'json',
        data:{
          ta_id:ta_id,
        },
        success:function(res){
          resolve(res);
        },
        fail:function(err){
          reject(err);
        }
      })
    })

    promise
      .then(function(res){
        that.setData({
          ta:res.data.ta
        })
        //console.log(that.data.ta)
        return new Promise(function(resolve,reject){
          wx.request({
            url: 'https://jumaolili.icu:443/subscribe_check',
            method:'POST',
            dataType:'json',
            data:{
              ta_id:ta_id,
              user_id:user_id
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
        if(res.data.err_code==0){
          that.setData({
            is_subscribed:res.data.is_subscribed
          })
        }
        //console.log(that.data.is_subscribed)
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
  return:function(e){
    var c_id=this.data.c_id;
    var url='';

    if(this.data.return_type=='none'){
      //直接回到
      return wx.reLaunch({
        url: '/pages/me_subscribe/me_subscribe',
      })
    }

    if(this.data.return_type=='good'){
      url='/pages/good_detail/good_detail?c_id='+c_id;
    }else if(this.data.return_type=='board'){
      url='/pages/board_detail/board_detail?c_id='+c_id;
    }
    wx.reLaunch({
      url: url,
    })
  },

  talkTota:function(e){
    var ta_id=this.data.ta_id;
    if(ta_id==app.globalData.user.user_id){
      return wx.showToast({
        title: '无法与自己对话',
        icon:'none'
      })
    }
    wx.reLaunch({
      url: '/pages/chat_room/chat_room?ta_id='+ta_id,
    })
  },

  subscribe:function(e){
    //1. 检查id 是否为自己
    //2. 发送 ta_id 以及user_id  到服务器
    //3. 得到相应信息
    //4. 更改data

    var ta_id=this.data.ta_id;
    var user_id=app.globalData.user.user_id;
    var that=this;
    if(ta_id==user_id){
      return wx.showToast({
        title: '无法关注自己',
        icon:'none'
      })
    }

    wx.showLoading({
      title:'执行操作',
      mask:true
    })

    var url='';
    if(that.data.is_subscribed==true){
      //取消关注
      url='https://jumaolili.icu:443/subscribe_cancel';
    }else{
      //关注
      url='https://jumaolili.icu:443/person_subscribe';
    }

    var promise = new Promise(function(resolve,reject){
      wx.request({
        url: url,
        method:'POST',
        dataType:'json',
        data:{
          ta_id:ta_id,
          user_id:user_id,
          img_src:app.globalData.user.img_src,
          name:app.globalData.user.name
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
        that.setData({
          is_subscribed:res.data.is_subscribed
        })
        wx.hideLoading({
          success: (res) => {
            wx.show;
            if(that.data.is_subscribed){
              wx.showToast({
                title: '成功关注',
              })
            }else{
              wx.showToast({
                title: '取消关注',
              })
            }
          },
        })
      },function(err){
        console.log(err);
      })

  },

  Ta_publish:function(e){
    var url='/pages/ta_publish/ta_publish?ta_id='+this.data.ta_id+'&c_id='+this.data.c_id+'&return_type='+this.data.return_type;
    wx.reLaunch({
      url: url
    })
  },

  Ta_board:function(e){
    var url='/pages/ta_publish_board/ta_publish_board?ta_id='+this.data.ta_id+'&c_id='+this.data.c_id+'&return_type='+this.data.return_type;
    wx.reLaunch({
      url: url
    })
  }
})
// pages/me/me.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //用户私匙
    app_token:null,
    //储存用户信息
    user:null,
    
    //商品列表
    publish_list:[],
    sold_list:[],
    buy_list:[],

    //求购列表
    board_list:[],
    //检查是否注册
    is_register:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //console.log(app.globalData.user)
    //获得全局变量
    this.setData({
      app_token:app.globalData.app_token,
      user:app.globalData.user,
      publish_list:app.globalData.publish_list,
      sold_list:app.globalData.sold_list,
      buy_list:app.globalData.buy_list,
      is_register:app.globalData.is_register,

    })

    //请求
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/update_globalData',
        method:'POST',
        dataType:'json',
        data:{
          user_id:app.globalData.user.user_id
        },
        success:function(res){
          resolve(res)
        },
        fail:function(err){
          reject(err);
        }
      })
    })

    promise
      .then(function(res){
          app.globalData.user=res.data.user;
          //console.log(res.data.user.list)     
          //重新赋值
          //设置publish_list为后续渲染做准备
          app.globalData.publish_list=res.data.user.list.filter(item=>{
            return item.is_sold==false
          });
          app.globalData.sold_list=res.data.user.list.filter(item=>{
            return item.is_sold==true
          })
          app.globalData.buy_list=res.data.user.buy_list;
          that.setData({
            publish_list:app.globalData.publish_list
          });
          that.setData({
            sold_list:app.globalData.sold_list
          });
          that.setData({
            buy_list:app.globalData.buy_list
          });

          app.globalData.board_list=res.data.user.board
          that.setData({
            board_list:app.globalData.board_list
          })
        
          //console.log(that.data.board_list)

      },function(err){
          //console.log('未知错误')
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
  register:function(e){
    wx.reLaunch({
      url: '/pages/register/register'
    })
  },
  change_me:function(e){
    wx.reLaunch({
      url: '/pages/repair/repair'
    })
  },
  me_publish:function(e){
    wx.reLaunch({
      url: '../me_publish/me_publish',
    })
  },

  me_board:function(e){
    wx.reLaunch({
      url: '../me_publish_board/me_publish_board',
    })
  },

  //top 上方 功能栏
  show_like_list:function(e){
    wx.reLaunch({
      url: '/pages/me_like/me_like',
    })
  },

  show_subscribe_list:function(e){
    wx.reLaunch({
      url: '/pages/me_subscribe/me_subscribe',
    })
  },

  developper_update:function(e){
   if(!app.globalData.user){
     return wx.showToast({
       title: '还未注册',
       icon:'none'
     })
   };

   wx.reLaunch({
     url: '/pages/developper_update/developper_update',
   })
  },

  developper_notice:function(e){
    if(app.globalData.user.is_developper==false){
      return wx.showToast({
        title: '您不是开发者',
        icon:'none'
      })
    }

    wx.reLaunch({
      url: '/pages/developper_notice/developper_notice',
    })
  },
  hideTopub:function(e){
    wx.reLaunch({
      url: '/pages/publish/publish',
    })
  }
    
})
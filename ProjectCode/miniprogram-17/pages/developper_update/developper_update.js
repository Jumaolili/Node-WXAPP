// pages/developper_update/developper_update.js

var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  // 自定义函数
  return:function(e){
    wx.reLaunch({
      url: '/pages/me/me',
    })
  },

  submit:function(e){
    var key=e.detail.value.key;
    if(key.trim()==''){
      return wx.showToast({
        title: '输入不能为空',
        icon:'none'
      })
    }

    wx.showLoading({
      title: '正在提交',
      mask:true
    })
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/developper_update',
        method:'POST',
        dataType:'json',
        data:{
          key:key,
          user_id:app.globalData.user.user_id
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
        if(res.data.err_code==0){
          if(res.data.isDevelopper==true){
            wx.reLaunch({
              url: '/pages/me/me',
              success:function(){
                wx.hideLoading({
                  success: (res) => {
                    wx.show;
                  },
                })
                wx.showToast({
                  title: '变更为开发者',
                })
              }
            })
          }else{
            wx.hideLoading({
              success: (res) => {
                wx.show
              },
            })
            wx.showToast({
              title: '密匙错误',
              icon:'none'
            })
          }
        }
      },function(err){
        console.log(err);
      })
  }
})
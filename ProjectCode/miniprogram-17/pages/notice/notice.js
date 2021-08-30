// pages/notice/notice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    notice_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var promise=new Promise(function(resolve,reject){
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
    });

    promise
      .then(function(res){
        that.setData({
          notice_list:res.data.notice
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

  backTomychat:function(){
    wx.reLaunch({
      url: '/pages/mychat/mychat',
    })
  },
})
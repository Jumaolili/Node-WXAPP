// pages/ta_publish_board/ta_publish_board.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    board_list:[],
    ta_id:null,
    c_id:null,
    return_type:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var c_id=options.c_id;
    var ta_id=options.ta_id;
    var return_type=options.return_type;
    this.setData({
      ta_id:ta_id,
      c_id:c_id,
      return_type:return_type
    });

    //再次获取ta的信息
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/person_card',
        method:'POST',
        dataType:'json',
        data:{
          ta_id:ta_id
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
        console.log(res.data.ta)
        that.setData({
          board_list:res.data.ta.board,
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

  backTota:function(e){
    wx.reLaunch({
      url: '/pages/person_card/person_card?ta_id='+this.data.ta_id+'&c_id='+this.data.c_id+'&return_type='+this.data.return_type,
    })
  }
})
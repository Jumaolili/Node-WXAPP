// pages/me_subscribe/me_subscribe.js

var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    subscribe_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      subscribe_list:app.globalData.user.subscribe,
    })
    //console.log(this.data.subscribe_list);
    
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
    wx.reLaunch({
      url: '/pages/me/me',
    })
  },

  subscribe_cancel:function(e){
    var user_id=app.globalData.user.user_id;
    var ta_id=e.target.dataset.ta_id;

    wx.showModal({
      title:'确定要取消关注',
      cancelColor: 'green',
      cancelText:'我再想想',
      confirmColor:'red',
      confirmText:'取消关注',
      success:function(res){
        if(res.confirm){
          wx.showLoading({
            title: '正在取关',
            mask:true
          })
          var promise = new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/subscribe_cancel',
              method:'POST',
              dataType:'json',
              data:{
                user_id:user_id,
                ta_id:ta_id
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
                wx.reLaunch({
                  url: '/pages/me/me',
                  success:function(res){
                    resolve();
                  }
                })
              }
            },function(err){
              console.log(err);
            })
            .then(function(res){
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/me_subscribe/me_subscribe',
                  success:function(res){
                    wx.hideLoading({
                      success: (res) => {
                        wx.show;
                        wx.showToast({
                          title: '取关成功',
                          icon:'success',
                          duration:800
                        })
                      },
                    })
                  }
                })
              }, 500);
            })
        }else if(res.cancel){
          wx.showToast({
            title: '我在想想',
            icon:'none'
          })
        }
      },
      fail:function(err){
        console.log(err);
      }
    })
    
  },

  goTota:function(e){
    var ta_id=e.target.dataset.ta_id;
    var c_id='';
    var return_type='none';
    wx.reLaunch({
      url: '/pages/person_card/person_card?ta_id='+ta_id+'&c_id='+c_id+'&return_type='+return_type,
    })
  },
})
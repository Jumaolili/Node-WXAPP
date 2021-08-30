// pages/board_detail/board_detail.js

var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    good:null,
    seller:null,
    user:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var c_id=options.c_id;
    this.setData({
      user:app.globalData.user
    })
    //1. 获取商品信息
    //2. 获取用户信息
    //^^^^^以上可通过get_detail路由全部获取
    //3. 发送c_id到 服务器 check_like
    //4. 渲染页面
    var promise = new Promise(function(resolve,reject){
      wx.showLoading({
        title: '正在加载详情',
        mask:true
      })
      wx.request({
        url: 'https://jumaolili.icu:443/board_detail',
        method:"POST",
        dataType:'json',
        data:{
          c_id:c_id
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
        //console.log(res);
        //设置data
        that.setData({
          seller:res.data.seller,
          good:res.data.good
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

  backToindex:function(e){
    wx.reLaunch({
      url: '/pages/board/board',
    })
  },

  talkToseller:function(e){
    //console.log(this.data.seller.user_id);
    //1. 将自己的id 和 对方的id 输送到服务器
    //2.  更新globalData 的 user
    
    var seller_id=this.data.seller.user_id;
    var user_id=this.data.user.user_id;
    var seller_img=this.data.seller.img_src;
    var user_img=this.data.user.img_src;


    var promise =new Promise(function(resolve,reject){
      if(seller_id==user_id){
        return wx.showToast({
          title: '无法与自己对话',
          icon:'none',
          duration:1000
        })
      }
      wx.showLoading({
        title:'正在创建',
        mask:true
      })

      //开始发起请求
      var promise =new Promise(function(resolve,reject){
        wx.request({
          url: 'https://jumaolili.icu:443/create_talk',
          method:'POST',
          dataType:'json',
          data:{
            user_id:user_id,
            seller_id:seller_id,
            user_img:user_img,
            seller_img:seller_img
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
          console.log(res.data.is_ready);
          //1. 接受服务器 参数
          //2. 携带seller_id 页面跳转至chat_room
          //3. hideloading
          if(res.data.is_ready){
            wx.reLaunch({
              url: '/pages/chat_room/chat_room?ta_id='+seller_id,
              success:function(res){
                wx.hideLoading({
                  success: (res) => {
                    wx.show;
                  },
                })
              },
              fail:function(err){
                wx.hideLoading({
                  success: (res) => {
                    wx.show;
                  },
                })
              }
            })
          }
        },function(err){
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '创建失败',
                icon:'none',
                duration:800
              })
            },
          })
          console.log(err);
        })
    })
    
  },

  findTa:function(e){
    var ta_id=e.target.dataset.ta_id;
    var c_id=e.target.dataset.c_id;
    var return_type='board';
    wx.reLaunch({
      url: '/pages/person_card/person_card?ta_id='+ta_id+'&c_id='+c_id+'&return_type='+return_type,
    })
  },
})
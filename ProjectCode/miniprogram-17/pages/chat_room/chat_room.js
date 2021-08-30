// pages/chat_room/chat_room.js

var app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chat_detail:[],
    record:[],
    ta_id:null,
    user:null,
    item_record:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //console.log(options);

    //设置轮询
    setInterval(function(){
      
      that.setData({
        ta_id:options.ta_id
      })
  
      //请求服务器
      var promise=new Promise(function(resolve,reject){
        wx.request({
          url: 'https://jumaolili.icu:443/update_globalData',
          method:'POST',
          dataType:'json',
          data:{
            user_id:app.globalData.user.user_id
          },
          success:function(res){
            resolve(res);
          },
          fail:function(err){
            rejecct(err);
          }
        })
      });
  
      promise
        .then(function(res){
          //console.log(res);
          app.globalData.user=res.data.user;
          that.setData({
            user:res.data.user
          })
          var chat=res.data.user.chat;
          var len=chat.length;
          for(let i=0;i<len;i++){
            if(chat[i].ta_id==that.data.ta_id){
              that.setData({
                chat_detail:chat[i],
                record:chat[i].record,
              });
              break;
            }
          }
          //console.log(that.data.chat_detail);
        },function(err){
          console.log(err);
        })
    },5000);


    this.setData({
      ta_id:options.ta_id
    })
    //https://jumaolili.icu
    //请求服务器
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/update_globalData',
        method:'POST',
        dataType:'json',
        data:{
          user_id:app.globalData.user.user_id
        },
        success:function(res){
          resolve(res);
        },
        fail:function(err){
          rejecct(err);
        }
      })
    });

    promise
      .then(function(res){
        //console.log(res.data.user);
        app.globalData.user=res.data.user;
        that.setData({
          user:res.data.user
        })
        var chat=res.data.user.chat;
        var len=chat.length;
        for(let i=0;i<len;i++){
          if(chat[i].ta_id==that.data.ta_id){
            that.setData({
              chat_detail:chat[i],
              record:chat[i].record,
            });
            break;
          }
        }
        //console.log(that.data.chat_detail);
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


  //自定义fn
  send:function(e){
    if(e.detail.value.item_record.trim()==''){
      return wx.showToast({
        title: '您还没有输入',
        icon:'none',
        duration:900
      })
    }
    wx.showLoading({
      title: '正在上传',
      mask:true
    })

    var that=this;
    //console.log(e.detail);
    var item_record=e.detail.value.item_record;
    this.setData({
      item_record:''
    });
    
    //1.  将数据传到服务器
    //2.  服务器传回更新后的数据
    //3.  更新data里的 chat_record 和 record
    var promise= new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu/send_talk',
        method:'POST',
        dataType:'json',
        data:{
          user_id:that.data.user.user_id,
          ta_id:that.data.ta_id,
          item_record:item_record
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
        //app.globalData.user=res.data.user;
        //更新data
        var chat=res.data.user.chat;
        var len=chat.length;
        for(let i=0;i<len;i++){
          if(chat[i].ta_id==that.data.ta_id){
            that.setData({
              chat_detail:chat[i],
              record:chat[i].record
            })
          }
        }
        wx.hideLoading({
          success: (res) => {
            wx.show;
            wx.showToast({
              title: '发送成功',
              icon:'success'
            })
          },
        })
      },function(err){
        console.log(err);
      })
  },

  backTomychat:function(){
    wx.reLaunch({
      url: '/pages/mychat/mychat',
    })
  },
})
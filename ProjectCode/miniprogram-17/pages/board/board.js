// pages/board/board.js
var app=getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    type_list:[
      "书籍",
      "文具",
      "日用品",
      "卡劵",
      "数码产品",
      "衣服",
      "其他"],

    //控制组件my-swiper样式
    isHide:false,

     //热门商品
    hot_list:[],

    //显示的求购帖子
    board_list:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    var promise=new Promise(function(resolve,reject){
      //避免因为网络而产生交互问题
      wx.showLoading({
        title: '加载中..',
        mask:true
      });
      wx.request({
        url: 'https://jumaolili.icu:443/board_get',
        method:'POST',
        success:function(res){
          resolve(res);
        },
        fail:function(err){
          reject(err)
        }
      })
    })

    promise 
      .then(function(res){
        if(res.data.err_code==0){
          that.setData({
            board_list:res.data.board_list
          })
          //console.log(that.data.all_list)
          return new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/get_newBoard',
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
          
        }
      },function(err){
        console.log(err);
      })
      .then(function(res){
        that.setData({
          hot_list:res.data.hot_list
        })
        //console.log(res.data.hot_list)
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {
              wx.show
            },
          })
        },500)
      },function(err){
        console.log(err);
        setTimeout(function(){
          wx.hideLoading({
            success: (res) => {
              wx.show
            },
          })
        },500)
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

  change_isHide:function(e){
    this.setData({
      isHide:false
    })
  },

  goTopage:function(e){
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
    //console.log(e.target.dataset)
    //将其添加到用户的浏览记录中
    var promise=new Promise(function(resolve,reject){
      
    })
    var url='/pages/board_detail/board_detail?c_id='+e.target.dataset.c_id;
    wx.reLaunch({
      url: url
    })
  },

  search_type:function(e){
    var that=this;
    //console.log(e.detail);
    //{value:'',type:''}
    //1. 将e.detial.value传到服务器
    //2. 服务器查找，返回数组
    //3. 将数组赋予 this.data.part_list
    //4. 页面渲染
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/board_type',
        method:'POST',
        dataType:'json',
        data:{
          c_type:e.detail.value,
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
        //console.log(res);
        that.setData({
          board_list:res.data.board_list,
        })
      },function(err){
        console.log(err);
      })
  },

  search_input:function(e){
    var that=this;
    this.setData({
      isHide:true
    })
     //避免因为网络而产生交互问题
     wx.showLoading({
      title: '搜寻中..',
      mask:true
    });
    //console.log(e.detail.value);
    var promise=new Promise(function(resolve,reject){
      //对字符串进行预处理
      var what=e.detail.value.what.trim();
      

      if(what==''){
        wx.request({
          url: 'https://jumaolili.icu:443/board_get',
          method:'POST',
          success:function(res){
            resolve(res);
          },
          fail:function(err){
            reject(err)
          }
        })
      }else{
        //需要数据库 特殊检索
        wx.request({
          url: 'https://jumaolili.icu:443/board_special',
          method:'POST',
          dataType:'json',
          data:{
            what:what
          },
          success:function(res){
            resolve(res);
          },
          fail:function(err){
            reject(err)
          }
        })
      }
    })

    promise 
      .then(function(res){
        setTimeout(function(){
          wx.hideLoading({
            success: () => {
              wx.show;
              that.setData({
                board_list:res.data.board_list
              })
            },
          })
    },500)
      },function(err){
        console.log(err);
      })
  },
})
// pages/good_detail/good_detail.js

var app=getApp(); 

Page({

  /**
   * 页面的初始数据
   */
  data: {
    good:null,
    seller:null,
    user:null,
    //该商品是否已经收藏了
    is_liked:false,
    //该商品是否想要
    is_wanted:false,
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
        url: 'https://jumaolili.icu:443/get_detail',
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
    })

    promise 
      .then(function(res){
        //console.log(res);
        //设置data
        that.setData({
          seller:res.data.seller,
          good:res.data.good
        })

        return new Promise(function(resolve,reject){
          //发送得到服务器 check_like
          wx.request({
            url: 'https://jumaolili.icu:443/check_like',
            method:'POST',
            dataType:'json',
            data:{
              c_id:c_id,
              user_id:app.globalData.user.user_id
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
        //console.log(res.data);
        that.setData({
         is_liked:res.data.is_liked
       })
        //发送得到服务器 check_like
       return new Promise(function(resolve,reject){
         wx.request({
           url: 'https://jumaolili.icu:443/check_want',
           method:'POST',
           dataType:'json',
           data:{
            c_id:c_id,
            user_id:app.globalData.user.user_id
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
       //根据res 设置data 中is_wanted的值
       //console.log(res);
       that.setData({
         is_wanted:res.data.is_wanted
       });
      setTimeout(function(){
        wx.hideLoading({
          success: (res) => {
            wx.show;
            wx.showToast({
              title: '成功加载',
              icon:'success',
              duration:500
            })
            //console.log(that.data.seller,that.data.user);
          },
          fail:(res)=>{
            wx.show;
            wx.showToast({
              title: '加载失败',
              icon:'none',
              duration:500
            })
          }
        })
      },500)
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
  like:function(e){
    //1. 检查data里的 is_liked 选择不同的 服务器 接口
    //2. 在得到返回之后 修改 data 里的 is_liked
    //3. 结束 loading

    var that=this;
    wx.showLoading({
      title: '正在执行操作',
      mask:true
    })

    var url='https://jumaolili.icu:443';
    var is_liked=this.data.is_liked;
    var c_id=this.data.good.c_id;
    var c_img=this.data.good.c_img;
    var c_name=this.data.good.c_name;
    var c_price=this.data.good.c_price;
    var c_description=this.data.good.c_description;
    var seller_id=this.data.user.user_id;
    var user_id=app.globalData.user.user_id;
    switch(is_liked){
      case true:
            //调用 cancel_like
            url+='/cancel_like';
            break;
      case false:
            //调用 like
            url+='/like'
            break;
    }

    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: url,
        method:'POST',
        dataType:'json',
        data:{
          c_price:c_price,
          c_description:c_description,
          c_id:c_id,
          c_img:c_img,
          c_name:c_name,
          seller_id:seller_id,
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

    promise
      .then(function(res){
        if(res.data.err_code==0&&res.data.code==0){
          that.setData({
            is_liked:true 
          })
          wx.hideLoading({
            success: (res) => {
              wx.show;
              wx.showToast({
                title: '成功收藏',
                icon:'success',
                duration:800
              })
            },
          })
        }else if(res.data.err_code==0&&res.data.code==1){
          that.setData({
            is_liked:false
          })
          wx.hideLoading({
            success: (res) => {
              wx.show;
              wx.showToast({
                title: '取消收藏',
                icon:'none',
                duration:800
              })
            },
          })
        }

        return new Promise(function(resolve,reject){
          wx.showLoading({
            title: '正在更新',
            mask:true
          })
          //更新全局变量 user
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
              reject(err);
            }
          })
        })
      },function(err){
        console.log(err);
      })
      .then(function(res){
        //重新更新全局变量
        app.globalData.user=res.data.user;
        wx.hideLoading({
          success: (res) => {
            wx.show;
            wx.showToast({
              title: '更新完成',
              icon:'success',
              duration:500
            })
          },
        })
      },function(err){
        console.log(err);
      })
  },

  change_want:function(e){
    //1. 检查data里的 is_liked 选择不同的 服务器 接口
    //2. 在得到返回之后 修改 data 里的 is_liked
    //3. 结束 loading

    var that=this;
    wx.showLoading({
      title: '正在执行',
      mask:true
    })

    var c_id=this.data.good.c_id;
    var user_id=app.globalData.user.user_id;
    var url='https://jumaolili.icu:443';
    var is_wanted=this.data.is_wanted;
    //console.log(this.data.is_wanted);
    //根据is_wanted的值选择接入不同的路由接口
    switch(is_wanted){
      case true:
        url+='/cancel_want';
        break;
      case false:
        url+='/want';
        break;
    }

    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: url,
        method:'POST',
        dataType:'json',
        data:{
          user_id:user_id,
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
        //根据返回值设置is_wanted
        //console.log(res.data);
        if(res.data.err_code==0){
          that.setData({
            is_wanted:res.data.is_wanted
          })
        }
        wx.hideLoading({
          success: (res) => {
            wx.show;
            if(that.data.is_wanted==true){
              wx.showToast({
                title: '添加到想要',
                icon:'success',
                duration:800
              })
            }else{
              wx.showToast({
                title: '成功移除',
                icon:'none',
                duration:800
              })
            }
          },
        })
      },function(err){
        console.log(err);
      })
  },

  backToindex:function(e){
    wx.reLaunch({
      url: '/pages/index/index',
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
    var return_type='good';
    wx.reLaunch({
      url: '/pages/person_card/person_card?ta_id='+ta_id+'&c_id='+c_id+'&return_type='+return_type,
    })
  },
})
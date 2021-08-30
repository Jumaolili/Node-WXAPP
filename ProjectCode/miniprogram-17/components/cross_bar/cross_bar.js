// components/cross_bar/cross_bar.js

var app=getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list:{
      type:Array
    },
    btn_type:{
      type:String
    },

    cid_type:{
      type:String
    },
  },

  /*
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {
    edit:function(e){
      var that=this;
      var myEvent = {
        c_id:e.target.dataset.c_id,
        type:e.target.dataset.type,
      };
      
      //根据type 确定请求的url
      var url='https://jumaolili.icu:443';
      if(myEvent.type=='remove'){
        url+='/publish_cancel';
      }else{
        return wx.reLaunch({
          url: '/pages/publish_update/publish_update'+'?c_id='+myEvent.c_id
        })
      }

      var promise=new Promise(function(resolve,reject){
        wx.showModal({
          cancelColor: 'green',
          cancelText:'取消',
          confirmColor:'red',
          confirmText:'删除',
          title:'下架确认',
          content:'是否下架该物品?',
          success:function(res){
            if(res.confirm){
              resolve();
            }else{
              wx.showToast({
                title: '取消下架',
                duration:1000,
                icon:'none'
              })
            }
          },
          fail:function(err){
            reject(err);
          }
        })
      })

      promise
        .then(function(){
          return new Promise(function(resolve,reject){
            //请求接口
          wx.request({
            url: url,
            method:'POST',
            dataType:'json',
            data:{
              value:myEvent,
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
        },function(){
          wx.showToast({
            title: '未知错误',
            duration:1000
          })
        })
        .then(function(res){
          //console.log(res);
          //更新全局data 中的user
          //res.data.user
          app.globalData.user=res.data.user;
          //修改组件对外值list
          
          wx.reLaunch({
            url: '/pages/me/me',
            success:function(){
              wx.showLoading({
                title: '正在下架..',
                mask:true
              });
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/me_publish/me_publish',
                })
                wx.hideLoading({
                  success: (res) => {
                    wx.show
                  },
                })
              },1000)
            }
          })

          
        },function(err){
          console.log(err);
        })
      
    },
    
    remove_like:function(e){
      //console.log(e.target.dataset.c_id);
      //1. 获取c_id user_id发给服务器
      //2. 获取返回值 页面重新定位
      wx.showLoading({
        title: '正在取消收藏',
        icon
      })
      var c_id=e.target.dataset.c_id;
      var user_id=app.globalData.user.user_id;
      //return console.log(c_id,user_id);
      var promise=new Promise(function(resolve,reject){
        wx.request({
          url: 'httpsss://xuhao.mynatapp.cc/cancel_like',
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
      })

      promise
        .then(function(res){

        },function(err){
          console.log(err);
        })
    },

    remove_board:function(e){
      //1. 向客户端发送c_id
      //2. 接受参数
      //3. 页面跳转
      //console.log(e.target.dataset.c_id);
      

      var c_id=e.target.dataset.c_id;
      var user_id=app.globalData.user.user_id;
      var c_img=e.target.dataset.c_img;

      var promise=new Promise(function(resolve,reject){
        wx.showModal({
          cancelColor: 'green',
          cancelText:'取消',
          confirmColor:'red',
          confirmText:'删除',
          title:'下架确认',
          content:'是否下架该物品?',
          success:function(res){
            if(res.confirm){
              resolve();
            }else{
              wx.showToast({
                title: '取消下架',
                duration:1000,
                icon:'none'
              })
            }
          },
          fail:function(err){
            reject(err);
          }
        })
        
      });

      promise
        .then(function(){
          wx.showLoading({
            title: '正在下架',
            mask:true
          })
          return new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/board_cancel',
              method:'POST',
              dataType:'json',
              data:{
                c_id:c_id,
                user_id:user_id,
                c_img:c_img
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
          wx.hideLoading({
            success: (res) => {
              wx.showToast({
                title: '成功下架',
                icon:'success',
              })
              wx.show;
            },
          });

          wx.reLaunch({
            url: '/pages/me/me',
            success:function(){
              setTimeout(function(){
                wx.reLaunch({
                  url: '/pages/me_publish_board/me_publish_board',
                })
              },800)
            }
          })
        }
        


      },function(err){
        console.log(err);
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '下架失败',
              icon:'none',
            })
            wx.show;
          },
        })
      })
    },

    goTodetail:function(e){
      wx.showLoading({
        title: '前往详情',
        mask:true
      });
      var cid_type=e.target.dataset.cid_type;
      var c_id=e.target.dataset.c_id;
      var promise=new Promise(function(resolve,reject){
        if(cid_type=='board'){
          var url='/pages/board_detail/board_detail?c_id='
        }else{
          var url='/pages/good_detail/good_detail?c_id='
        }
        
        wx.reLaunch({
          url: url+c_id,
          success:function(){
            wx.hideLoading({
              success: (res) => {
                wx.show;
              },
            })
          }
        })

      })
    },
  }
})

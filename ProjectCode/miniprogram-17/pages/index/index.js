// index.js
// 获取应用实例
const app = getApp()

Page({
  data: {
    type_list:[
      "书籍",
      "文具",
      "日用品",
      "卡劵",
      "数码产品",
      "衣服",
      "其他"],
    app_token:null,
    user:null,

    //控制组件my-swiper样式
    isHide:false,
    //正常显示的商品
    all_list:[],

    //热门商品
    hot_list:[],
    
  },
  
  
  onLoad() {
    var that=this;
    //从缓存或者全局获得app_token
    if(app.globalData.app_token){
      this.setData({
        app_token:app.globalData.app_token
      })
    }else{
      wx.getStorage({
        key: 'app_token',
        success:res=>{
          //console.log(res.data)
          this.setData({
            app_token:res.data
          })
        }
      })
    }
    
    var promise=new Promise(function(resolve,reject){
      //避免因为网络而产生交互问题
      wx.showLoading({
        title: '加载中..',
        mask:true
      });
      wx.request({
        url: 'https://jumaolili.icu:443/publish_get',
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
            all_list:res.data.list
          })
          //console.log(that.data.all_list)
          return new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/get_hotlist',
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
        //console.log(res.data.hot_list)
        that.setData({
          hot_list:res.data.hot_list
        })
        //console.log(that.data.hot_list)
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

  // 事件处理函数
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
        url: 'https://jumaolili.icu:443/search_type',
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
          all_list:res.data.part_list,
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
          url: 'https://jumaolili.icu:443/publish_get',
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
          url: 'https://jumaolili.icu:443/search_special',
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
                all_list:res.data.list
              })
            },
          })
    },500)
      },function(err){
        console.log(err);
      })
  },

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
    var url='/pages/good_detail/good_detail?c_id='+e.target.dataset.c_id;
    wx.reLaunch({
      url: url
    })
  }
})

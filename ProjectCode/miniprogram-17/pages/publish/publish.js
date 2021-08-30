// pages/publish/publish.js
const app=getApp();

//文件读取操作控制
var FSM = wx.getFileSystemManager();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //发布类型
    publish_type:"good",

    //传入 my-swiper最贱的参数
    type_list:[
      "书籍",
      "文具",
      "日用品",
      "卡劵",
      "数码产品",
      "衣服",
      "其他"],
    usage_list:
    [
      "全新",
      "几乎全新",
      "轻微痕迹",
      "明显痕迹",
      "成色一般",
      "成色较差",
      "成色很差"],

    //需要和提交表单一起上交的参数
    c_type:null,
    usage_degree:null,
    img_list:[],

    //canvas压缩上传图片
    cWidth:0,
    cHeight:0,

    //上传图片
    change_path:null,
    picture_base64:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  myevent:function(e){
    if(e.detail.type=='类别'){
      this.setData({
        c_type:e.detail.value
      })
    }
    if(e.detail.type=='新旧'){
      this.setData({
        usage_degree:e.detail.value
      })
    }
  },

  submit_form:function(e){
    var that=this;
    //表单检查
    //1.商品名称  2.商品价格
    if(e.detail.value.c_name.trim()==''){
      return wx.showToast({
        title: '请输入物品名称',
        icon:'none',
        duration:1000
      })
    };
    if(e.detail.value.c_price.trim()==''){
      return wx.showToast({
        title: '请输入物品价格',
        icon:'none',
        duration:1000
      })
    }

    //提交表单
    //console.log(e.detail);
    wx.showLoading({
      title: '正在上传',
      mask:true
    })
    var url='';
    if(that.data.publish_type=='good'){
      url="https://jumaolili.icu:443/publish";
    }else{
      url="https://jumaolili.icu:443/board_publish"
    }

    var promise=new Promise(function(resolve,rejecct){
   
      wx.request({
        url: url,
        method:'POST',
        dataType:'json',
        data:{
          other:{
            c_type:that.data.c_type,
            user_id:app.globalData.user.user_id,
            major:app.globalData.user.major,
            usage_degree:that.data.usage_degree
          },
          value:e.detail.value,
          picture_base64:that.data.picture_base64,
        },
        success:function(res){
          resolve(res);
        },
        fail:function(err){
          rejecct(err);
        }
      })
    })

    promise.then(function(res){
      console.log(res)
      
      if(res.data.err_code==0){
          //说明上传成功
          //1.更新全局变量user   2.跳转页面
          return new Promise(function(resolve,reject){
            wx.request({
              url: 'https://jumaolili.icu:443/update_globalData',
              method:'POST',
              dataType:'json',
              data:{
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
      }
    },function(err){
      console.log(err);
    })
    
    .then(function(res){
      app.globalData.user=res.data.user;
      //设置publish_list为后续渲染做准备
      app.globalData.publish_list=app.globalData.user.list.filter(item=>{
        return item.is_sold==false
      })
      //设置sold_list为后续渲染做准备
      app.globalData.publish_list=app.globalData.user.list.filter(item=>{
        return item.is_sold==true
      })
      //设置bug_list为后续渲染做准备
      app.globalData.buy_list=app.globalData.user.buy_list
      wx.showToast({
        title: '请求发布...',
        icon:'success',
        duration:1500
      })
      return new Promise(function(resolve,reject){
        wx.reLaunch({
          url: '/pages/me/me',
          success:function(){
            wx.showLoading({
              title: '正在处理发布...',
              mask:true
            })
            setTimeout(function(){
              wx.hideLoading({
                success: (res) => {
                  wx.show;
                  if(that.data.publish_type=='good'){
                    var toUrl='/pages/me_publish/me_publish';
                  }else{
                    var toUrl='/pages/me_publish_board/me_publish_board'
                  }

                  wx.reLaunch({
                    url: toUrl,
                    success:function(){
                      resolve();
                    }
                  })
                },
              })
              
            },1000 )
          }
        })
      })  
    },function(err){
      console.log(err);
    })
    .then(function(){
      wx.hideLoading({
        success: (res) => {
          wx.show;
          wx.showToast({
            title: '成功发布',
            icon:'success'
          })
        },
      })
    })
  },

  cancel_form:function(e){
    wx.reLaunch({
      url: '../index/index',
    })
  },

  choose_img:function(e){
    var that=this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success:(res)=> {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0];
        //console.log(res);
        // 1. 通过 wx.chooseImage 接口选择相机图片
        // 2. 通过 wx.getImageInfo 接口获取图片信息（长宽，类型）
        // 3. 计算压缩比例和最终图片的长宽
        // 4. 创建 canvas 绘图上下文，绘制最终图片
        // 5. 通过 wx.canvasToTempFilePath 接口将画布内容导出为图片并获取图片路径
        //-----返回选定照片的本地文件路径列表，获取照片信息-----------
        wx.getImageInfo({
          src: tempFilePaths,
          success:function(res){
            //console.log(res);
            //---------利用canvas压缩图片--------------
            var ratio = 2;
            var canvasWidth = res.width ;//图片原始长宽
            var canvasHeight = res.height;
            while (canvasWidth > 1920 || canvasHeight > 1080){// 保证宽高在180以内
              canvasWidth = Math.floor(res.width / ratio)
              canvasHeight = Math.floor(res.height / ratio)
              ratio++;
            };
            that.setData({
              cWidth: canvasWidth,
              cHeight: canvasHeight
            });
 

            //----------绘制图形并取出图片路径--------------
            var ctx = wx.createCanvasContext('canvas')
            ctx.drawImage(res.path, 0, 0, canvasWidth, canvasHeight)
            ctx.draw(false, setTimeout(function(){
                 wx.canvasToTempFilePath({
                     canvasId: 'canvas',
                     destWidth: canvasWidth,
                     destHeight: canvasHeight,
                     success: function (res) {
                         //console.log(res.tempFilePath)//最终图片路径
                         FSM.readFile({
                          filePath: res.tempFilePath, //选择图片返回的相对路径
                          encoding: 'base64', //编码格式
                          success: function(res){
                            //console.log('data:image/png;base64,' + res.data)  //成功的回调
                            console.log('成功选择图片...并且完成压缩...');
                            //实时更新img
                            that.setData({
                              change_path:tempFilePaths,
                              picture_base64:res.data
                            })
                            wx.showToast({
                              title: '成功选择图片',
                              icon:'success',
                              duration:1000
                            })
                          }
                         })
                     },
                     fail: function (res) {
                         console.log(res.errMsg)
                    }
                })
            },100))    //留一定的时间绘制canvas
          }
        })

      },
      fail: function(res){
        console.log(res.errMsg)
      },
    })
  },

  switch_type:function(e){
    if(this.data.publish_type=='good'){
      this.setData({
        publish_type:'board'
      });
      wx.showToast({
        title: '发布求购',
      })
    }else{
      this.setData({
        publish_type:'good'
      });
      wx.showToast({
        title: '发布二手物品',
      })
    }
  },
})
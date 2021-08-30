// pages/repair/repair.js

const app=getApp();

//文件读取操作控制
var FSM = wx.getFileSystemManager();


Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:null,
    sold_list:[],
    is_register:false,
    alldepartments:[
      '化工与制药学院',
      '机电工程学院',
      '电气信息学院',
      '土木工程与建筑学院',
      '材料科学与工程学院',
      '管理学院',
      '计算机科学与工程学院',
      '法商学院',
      '化学与环境工程学院',
      '光电信息与能源工程学院',
      '数理学院',
      '外语学院',
      '艺术设计学院',
      '环境生态与生物工程学院',
      '资源与安全工程学院',
       '人工智能学院'] ,
    allmajors:[
      '工程力学',
    '机器人工程',
    '机械工程',
    '通信工程',
    '测控技术与仪器',
    '自动化',
    '电气工程及其自动化',
    '电子信息工程',
    '信息工程',
    '城乡规划',
    '建筑学',
    '土木工程',
    '工程管理',
    '材料类',
    '材料化学',
    '高分子材料与工程',
    '无机非金属材料工程',
    '材料化学',
    '工商管理',
    '公共事业管理',
    '行政管理',
    '电子商务',
    '信息管理与信息系统',
    '财务管理',
    '会计学',
    '市场营销',
    '计算机科学与技术',
    '软件工程',
    '物联网工程',
    '数字媒体技术',
    '智能科学与技术',
    '法学',
    '国际经济与贸易',
    '法学',
    '经济学',
    '知识产权',
    '应用化学',
    '环境工程',
    '光电信息科学与工程',
    '能源与动力工程',
    '信息与计算科学',
    '数据科学与大数据技术',
    '汉语国际教育',
    '英语',
    '工业设计',
    '产品设计',
    '环境设',
    '视觉传达设计',
    '动画',
    '广告学',
    '环境科学',
    '生物工程',
    '生物技术',
    '食品科学与工程',
    '采矿工程',
    '矿物加工工程',
    '安全工程',
    '资源循环科学与工程',
    '人工智能',
    '智能科学与技术'],
     //下拉列表
     show_department:true,
     show_major:true,
     department:"",
     major:"",

     //上传图片
     origin_path:null,
     picture_base64:null,
     //canvas压缩上传图片
     cWidth:0,
     cHeight:0,

     //表单data
     name:'',
     phonenumber:'',
     qqnumber:'',
     department:'',
     major:''
  },

  /*
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获得全局变量
    this.setData({
      app_token:app.globalData.app_token,
      user:app.globalData.user,
      sold_list:app.globalData.sold_list,
      is_register:app.globalData.is_register, name:'',
      origin_path:app.globalData.user.img_src,
      name:app.globalData.user.name,
      phonenumber:app.globalData.user.phonenumber,
      qqnumber:app.globalData.user.qqnumber,
      department:app.globalData.user.department,
      major:app.globalData.user.major
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

  department_list:function(e){
    this.setData({
      show_department:false
    })
  },
  major_list:function(e){
    this.setData({
      show_major:false
    })
  },
  close_list:function(e){
    if(e.target.id!='department'){
      this.setData({
        show_department:true
      })
    }
    if(e.target.id!='major'){
      this.setData({
        show_major:true
      })
    }
  },

  cancel_change:function(e){
    this.setData({
      change_path:null
    })
    wx.reLaunch({
      url: '../me/me',
    })
  },
  submit_change:function(e){
    //1. 将 form 和 picture_base64 图片二进制字符串 发送到服务器
    //2. 重新获得服务端 更新完的user数据
    //3. 修改globalData
    //4. 页面跳转到 me 
    
    var that=this;
    if(e.detail.value.name.trim()==''){
      return wx.showToast({
        title: '请填写用户名',
        icon:'none',
        duration:1000
      })
    };
    wx.showLoading({
      title: '正在更改...',
      mask:true
    })
    var promise=new Promise(function(resolve,reject){
      wx.request({
        url: 'https://jumaolili.icu:443/update',
        method:'POST',
        dataType:'json',
        data:{
          form:e.detail,
          picture_base64:that.data.picture_base64,
          origin_path:that.data.origin_path
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
        // 重新获得服务端 更新完的user数据
        // 修改globalData
        //跳转到 me
        
        app.globalData.user=res.data;
        
        
        //console.log(res.data);
        return new Promise(function(resolve,reject){
          setTimeout(function(){
            resolve();
          },1000)
        })
      },function(err){
        console.log(err);
      })
      .then(function(){
        wx.reLaunch({
          url: '../me/me',
        })
        wx.hideLoading({
          success: (res) => {
            wx.showToast({
              title: '修改成功',
              icon:'success',
              duration:1000
            })
          },
        })
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

  change_user_id:function(e){
    wx.showToast({
      title: '用户ID无法被修改',
      icon:'none',
      duration:1000
    })
  },


  //组件监听---------------------------------------------
  myevent:function(e){ 
    //e.detail.value
    if(e.detail.type=='department'){
      this.setData({
        department:e.detail.value
      })
    }else{
      this.setData({
        major:e.detail.value
      })
    }
  }
})
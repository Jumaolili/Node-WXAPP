// pages/register/register.js

const app=getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phonenumber:"",
    qqnumber:"",
    department:"",
    major:"",

    //下拉列表
    show_department:true,
    show_major:true,

    //列表
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
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //自定义函数--------------------------------------------------
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
  submit:function(e){
    //检查user_name是否填写
    //初步过滤数据
    //e.detail.value
    //wx.login()获得code
    //将code传给服务器
    if(e.detail.value.name.trim()==''){
      return wx.showToast({
        title: '请填写用户名',
        icon:'none',
        duration:1000
      })
    };

    wx.showLoading({
      title: '注册ing..',
      mask:true
    })
    wx.login({
      success:function(res){
        wx.request({
          url: 'https://jumaolili.icu:443/register',
          method:'POST',
          data:{
            code:res.code,
            value:e.detail.value
          },
          success:function(res){
            //1. 接受返回值res
            //2. 将res中的app_token写入到缓存中
            //3. 将app_token写入到GlobaData中
            //4. 页面跳转到 index.wxml (首页)
            var message=res;
            if(res.data.err_code===0){
              wx.setStorage({
                data: message.data.user.app_token,
                key: 'app_token',
                success:function(){
                  app.globalData.user=message.data.user;
                  app.globalData.is_register=true;
                  setTimeout(() => {
                    wx.reLaunch({
                      url: '../index/index',
                    })
                  }, 1000);
                  wx.hideLoading({
                    success: (res) => {
                      wx.show
                    },
                  })
                },
                fail:err=>{
                  wx.hideLoading({
                    success: (res) => {
                      wx.show
                    },
                  })
                  console.log(err)
                }
              })
            }
            wx.reLaunch({
              url: '/pages/index/index'
            })
          },
          fail:function(res){
            wx.hideLoading({
              success: (res) => {
                wx.show
              },
            })
            wx.showToast({
              title: '注册失败，请重试',
              icon:'fail',
              duration:1000
            })
          }
        })
      },
      fail:function(){
        wx.hideLoading({
          success: (res) => {
            wx.show
          },
        })
        wx.showToast({
          title: '请求失败，请重试',
          icon:'fail',
          duration:1000
        })
      }
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
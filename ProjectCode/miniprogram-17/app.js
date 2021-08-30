// app.js
App({
  onLaunch() {
    
    //检查登录
    wx.getStorage({
      key: 'app_token',
      success:res=>{
        //登录
        //true 发送app_token
        //接受User渲染数据
        //console.log(res.data);
        //console.log(res);
        wx.request({
          url: 'https://jumaolili.icu:443/login',
          method:'POST',
          data:{
            app_token:res.data
          },
          dataType:'json',
          success:res=>{
            //console.log(res.data.user);
            //获取到数据后渲染页面
            //更新data的 user

              this.globalData.user=res.data.user;
              this.globalData.is_register=true;
              //设置publish_list为后续渲染做准备
              this.globalData.publish_list=this.globalData.user.list.filter(item=>{
                return item.is_sold==false;
              })
              //设置sold_list为后续渲染做准备
              this.globalData.sold_list=this.globalData.user.list.filter(item=>{
                return item.is_sold==true;
              })
              //设置bug_list为后续渲染做准备
              this.globalData.buy_list=this.globalData.user.buy_list;
          },
          fail:res=>{
            //console.log(res);
            wx.showToast({
              title: '遇到未知问题',
              icon:'none',
              duration:1000
            })
          }
        })
      },
      fail:res=>{
        //false  wx.login()得到code，发给服务器
        wx.login({
          success:res=>{
            //console.log('login code:'+res.code);
            //得到code，发给服务器
            wx.request({
              url: 'https://jumaolili.icu:443/check_register',
              method:'POST',
              data:{
                code:res.code,
              },
              success:res=>{
                //console.log(res)
                //新用户
                if(res.data.err_code==1){
                    this.globalData.user=null;
                    this.globalData.is_register=false;
                    //console.log('未注册')
                }
                //老用户
                if(res.data.err_code==0){
                    wx.setStorage({
                      data: res.data.user.app_token,
                      key: 'app_token',
                    })
                    this.globalData.user=res.data.user;
                    this.globalData.is_register=true;
                  
                }
              },
              fail:res=>{
                //console.log(res.data);
              }
            })
          }
        })
      }
    })
    
  },
  globalData: {
    app_token:null,
    user:null,
    publish_list:[],
    sold_list:[],
    buy_list:[],
    board_list:[],
    is_register:false
  }
})

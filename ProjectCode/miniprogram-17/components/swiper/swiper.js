// components/swiper/swiper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    list: {
      type:Array
    },
    type: {
      type:String
    },
    isHide:{
      type:Boolean
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    chosen:null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    choose_item:function(e){
      this.setData({
        chosen:e.target.dataset.content
      })

      // detail对象，提供给事件监听函数
      var myEventDetail = {
        value:e.currentTarget.dataset.content,
        type:this.data.type
      } 
      // 触发事件的选项
      var myEventOption = {} 
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    },

  }
})

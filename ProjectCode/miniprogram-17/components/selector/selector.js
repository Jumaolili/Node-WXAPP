// components/selector/selector.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    array:{
      type:Array
    },
    type:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    
  },

  /**
   * 组件的方法列表
   */
  methods: {  
    choose:function(e){
      // detail对象，提供给事件监听函数
      var myEventDetail = {
        value:e.currentTarget.dataset.id,
        type:e.currentTarget.dataset.type
      } 
      // 触发事件的选项
      var myEventOption = {} 
      this.triggerEvent('myevent', myEventDetail, myEventOption)
    }
  }
})

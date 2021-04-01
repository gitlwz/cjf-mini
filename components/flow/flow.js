// components/flow/flow.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    item:Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    item:{},
    contentH: ''
  },
  attached: function () {
    this.setData({
      item:this.properties.item,
      contentH: getApp().globalData.contentHeight
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onBack() {
      wx.navigateBack({
      })
    },
    onRedirect(e){
      const type =e.currentTarget.dataset.type
      console.log(type)
      if(type==="top"){
        wx.redirectTo({
          url: this.data.item.stepOneUrl,
        })
      }else{
        wx.redirectTo({
          url: this.data.item.stepTwoUrl,
        })
      }
      
    }
  }
})

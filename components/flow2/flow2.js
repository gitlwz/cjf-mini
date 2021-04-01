// components/flow2/flow2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: Object
  },

  /**
   * 组件的初始数据
   */
  data: {
    contentH: '',
    items:{}
  },
  attached: function () {
    this.setData({
      contentH: getApp().globalData.contentHeight -4,
      items: this.properties.items
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onBack(){
      wx.navigateBack({
      })
    },
    onRedirect(e) {
      const type = e.currentTarget.dataset.type
      console.log(type)
      if (type === "left") {
        wx.redirectTo({
          url: this.data.items.adressLeft,
        })
      } else if (this.data.items.adressRight === ''){
        wx.navigateBack({
          delta: getCurrentPages().length - 2
        })
      }else{
        wx.redirectTo({
          url: this.data.items.adressRight,
        })
      }
    }
  }
})

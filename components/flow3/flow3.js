// components/flow2/flow2.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    items: Object,
    adress: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    contentH: '',
    items: {}
  },
  attached: function () {
    this.setData({
      contentH: getApp().globalData.contentHeight -10,
      items: this.properties.items,
      adress: this.properties.adress
    });
  },
  /**
   * 组件的方法列表
   */
  methods: {
  }
})

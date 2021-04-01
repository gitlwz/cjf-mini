// pages/delivery/deliveryItem/deliveryItem.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object,
      observer: function (newVal, oldVal) {
        this.setData({
          data: newVal
        })
      }
    },
    itemType:{
      type: null
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {},
    type:''
  },
  lifetimes: {
    attached: function () {
      this.setData({
        data: this.properties.itemData,
        type: this.properties.itemType
      })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})

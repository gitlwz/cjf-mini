// template/recycle-view-list/item/item.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData:{
      type:Object,
      observer: function (newVal, oldVal){
        this.setData({
          data: newVal
        })
      }
    },
    itemType:null
  },

  /**
   * 组件的初始数据
   */
  data: {
    data: {}
  },
  lifetimes: {
    attached: function () {
      this.setData({
        data: this.properties.itemData
      })
    }
  },
  
  /**
   * 组件的方法列表
   */
  methods: {
  }
})

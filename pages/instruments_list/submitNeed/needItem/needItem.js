import { deleteself,needInfo } from '../../../../api/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object
    },
    itemType: null
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
    onDelete(e){
      console.log("delete")
      const that = this
      const param={
        id: e.currentTarget.dataset.id
      }
      deleteself(param).then(function(){
        console.log("删除成功")
        wx.showToast({
          title: '删除成功'
        })
        that.triggerEvent('reload', {}, {})
      }).catch(function(){
        console.log("删除失败")
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        })
      })
    }
  }
})

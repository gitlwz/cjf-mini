// pages/instruments_list/eggFusion/fusionItem/fusionItem.js
import { HTTP_DOMIN } from '../../../../utils/network/config.js'
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
    url: `${HTTP_DOMIN}/root/1/eggback.png`
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onTap() {
      console.log(1, this.properties.itemData)
    }
  }
})

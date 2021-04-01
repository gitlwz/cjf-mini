
import {
  formatDate
} from '../../../../utils/util.js'

Component({
  properties: {
    startDate: {            // 属性名
      type: String,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: formatDate(-180)    // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    endDate: {
      type: String,
      value: formatDate(0)     // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    limitStartDate: {
      type: String,
      value: ''
    },
  
    limitEndDate: {
      type: String,
      value: ''
    },
    isLandScape: {
      type: Boolean,
      value: false
    },
    differentDays: {
      type: Number,
      value: 0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    today: formatDate(0)
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /*
    * 内部私有方法建议以下划线开头
    * triggerEvent 用于触发事件
    */
    handleDateChange(e) {
      this.setData({
        startDate: e.detail.value
      })
      this.triggerEvent("handleDateChange", e)
    },
  }
})

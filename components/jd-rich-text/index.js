import wxParse from '../../wxParse/wxParse.js';

const app = getApp();


Component({
  properties: {
    notice: {            // 属性名
      type: Boolean,     // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: false    // 属性初始值（可选），如果未指定则会根据类型选择一个
    },
    articleInfo: {
      type: Object,
      value: {},
      observer: function (newVal, oldVal) {
        if (newVal !== oldVal && newVal.publishContent) {
          this.initNotice()
        }
      }
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    notice: false
  },
  attached: function() {
    const self = this;
  },

  /**
   * 组件的方法列表
   */
  methods: {
    initNotice() {
      wxParse.wxParse('content', 'html', this.properties.articleInfo.publishContent, this, 10);
      this.setData({
        notice: this.properties.articleInfo.publishVideo || this.properties.articleInfo.publishImage
      })
    },
  }
})

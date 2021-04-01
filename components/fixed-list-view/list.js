Component({
  recycleViewContext: {},
  properties: {
    // 是否是刷新页面
    isRefreshing: {
      type: Boolean,
      value: true,
      observer: function () {
        if (this.properties.isRefreshing) {
           this.loadData(false)
        }
      }
    },
    showFooter: {
      type: Boolean,
      value: false,
    },
    // 列表数据
    listData: {
      type: Array,
      value: []
    },
    isLoadFailed: {
      type: Boolean,
      value: false
    },
    _id:null
  },
  lifetimes: {
    attached: function () {
      this.setData({
        _id: this.dataset.id
      })
      // 初始加载数据
      if (this.properties.isRefreshing) {
        this.loadData()
      }
    }
  },
  methods: {
    loadData: function() {
      this.triggerEvent('loadData', {}, {})
    }
  }
})
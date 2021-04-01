let app = getApp();

Component({
  // 指定外部样式
  externalClasses: ['list-class'],
  options: {
    // 指定所有 _ 开头的数据字段为纯数据字段,纯数据字段不会参与渲染，提升性能
    pureDataPattern: /^_/
  },
  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持
  },
  properties: {
    vissable: {
      type: Boolean,
      value: true,
    },
    listHeight: {
      type: Number,
      value: 512
    },
    // 是否是刷新页面，如果页面attach时不需要自动加载给初始值为false
    isRefreshing: {
      type: Boolean,
      value: true,
      observer: function () {
        if (this.properties.isRefreshing) {
           this.setData({
             _pageNum: 1
           })
           this.loadData(false)
        }
      }
    },
    // 页面是否加载中（包括刷新中和加载更多）
    isLoading: {
      type: Boolean,
      value: false,
    },
    // 列表数据
    listData: {
      type: Array,
      value: []
    }
    ,
    // 是否显示底部加载Footer
    showLoadingFooter: {
      type: Boolean,
      value: true
    },
    // 分页size
    _pageSize: {
      type: Number,
      value: 10,
    },
    // 页码数
    _pageNum: {
      type: Number,
      value: 1,
    },
    // 总页数
    _pageCount:{
      type: Number,
      value: Number.MAX_VALUE
    },
    // 是否还有更多数据
    hasMore: {
      type: Boolean,
      value: true
    },
    _id: null
  },
  lifetimes: {
    attached: function() {
     
      this.setData({
        _id: this.dataset.id
      })
      // 初始加载数据
      if (this.properties.isRefreshing) {
        this.loadData(false)
      }
    }
  },
  methods: {
    /**
     * 触发加载事件
     */
    loadData: function(isLoadMore=false) {
      const lastPageSize = this.properties._pageSize
      const lastPageNum = this.properties._pageNum
      var eventDetail = {
        isLoadMore: isLoadMore,
        page: {
          pageSize: lastPageSize,
          pageNum: lastPageNum
        }
      } // detail对象，提供给事件监听函数
      var eventOption = {} // 触发事件的选项
      this.triggerEvent('loadData', eventDetail, eventOption)
    },
    // 滚动到底部
    scrolltolower: function() {
      console.log('滚动到底部')
      if (!this.properties.isLoading && this.properties.hasMore) {
        console.log(3)
        const nextPageNum = this.properties._pageNum + 1
        this.setData({
          isLoading: true,
          _pageNum: nextPageNum
        })
        this.loadData(true)
      }
    }
  }
})
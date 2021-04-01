// pages/instruments_list/eggFusion/eggFusion.js
import { eggFusion } from '../../../api/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    listData:[],
    listHeight: '',
    isRefreshing: true,
    isLoading: true,
    pageCount: 1,
    hasMore: true
  },
  lifetimes:{
    attached: function () {
      // 初始加载数据
      this.setData({
        listHeight: getApp().globalData.contentHeight
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    //获取列表
    getList(page = { pageSize: 5, pageNum: 1 }, isLoadMore) {
      var list = []
      const that = this

      eggFusion(page).then(function (e) {
        // const pageCount = e.totalPage
        const result = e.result;
        const pageCount = e.totalPage
        for (let i = 0; i < result.length; i++) {
          list.push(result[i])
        }
        let newListData = list
        if (isLoadMore) {
          newListData = that.data.listData.concat(list);
        }
        setTimeout(function () {
          that.setData({
            pageCount: pageCount,
            isRefreshing: false,
            isLoading: false,
            hasMore: page.pageNum < pageCount,
            listData: newListData
          }, function () {
            if (!isLoadMore) {
              wx.stopPullDownRefresh()
            }
          })
        }, 500)
      }).catch(function () {
        console.log(8888)
      })
    },
    loadData(e) {
      console.log(2332)
      const { page, isLoadMore, hasMore } = e.detail
      this.getList(page, isLoadMore)
    }
  }
})

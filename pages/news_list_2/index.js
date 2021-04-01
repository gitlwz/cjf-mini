var appinit = getApp();

Page({
  //页面的初始数据
  data: {
    isRefreshing: true,
    isLoading: true,
    listData: [],
    pageCount: 1,
    hasMore: true,
    navdata: {
      title: '资讯',
      navbar: '1'
    },
    navH: ''
  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
      }
    )
  },
  //获取列表
  getList(page = { pageSize: 20, pageNum: 1 }, isLoadMore) {
    console.log('加载数据，页数：' + page.pageNum + "size=" + page.pageSize)
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        title: '我是数据' + i
      })
    }
    let newListData = list
    if (isLoadMore) {
      newListData = this.data.listData.concat(list);
    }
    const that = this
    setTimeout(function () {
      that.setData({
        pageCount: 3,
        isRefreshing: false,
        isLoading: false,
        hasMore: page.pageNum < 3,
        listData: newListData
      }, function () {
        if (!isLoadMore) {
          wx.stopPullDownRefresh()
        }
      })
    }, 500)

  },
  loadData(e) {
    const { page, isLoadMore, hasMore} = e.detail
    this.getList(page, isLoadMore)
  },
  onLoad(){
    this.setData({
      navH: getApp().globalData.navHeight
    });
  }
})
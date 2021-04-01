import {
  getBignamePointNews,
  getEggPriceViewNews,
  getEggNews,
  getBignamePointCover,
  getEggPriceViewNewCover,
  getEggNewCover
} from '../../api/api.js'

var appGloableData = getApp().globalData

const tabId = {
  POINTS: 0,
  VIEWS: 1,
  NEWS: 2,
}

Page({
  //页面的初始数据
  data: {
    listHeight: appGloableData.screenWidth / 750 * 1024,
    navList: [{
      title: '大咖观点',
      id: tabId.POINTS
    }, {
      title: '蛋价视点',
      id: tabId.VIEWS
    }, {
      title: '蛋业新闻',
      id: tabId.NEWS
    }],
    navCoverDatas: [{
      url: '/images/test_banner.png',
      title: '',
      id: -1
    }, {
      url: '/images/test_banner.png',
      title: '',
      id: -1
    }, {
      url: '/images/test_banner.png',
      title: '',
      id: -1
    }],
    navRefreshingState: [true, false, false],
    navLoadingState: [true, true, true],
    navPageCounts: [1, 1, 1],
    navHasMoreState: [true, true, true],
    navListdatas: [
      [],
      [],
      []
    ],
    active: 0,
    navdata: {
      title: '资讯',
      navbar: '1'
    },
    navH: ''
  },
  onLoad: function(options) {
    var query = wx.createSelectorQuery()
    var that = this;
    query.select('.nav').boundingClientRect(function(rect) {
      const height = appGloableData.screenHeight - rect.height - appGloableData.navHeight/2
      that.setData({
        listHeight: height
      })
    }).exec()
    this.setData({
      navH: getApp().globalData.navHeight
    });
  },
  onPullDownRefresh: function() {
    const activeTab = this.data.active
    if (activeTab === tabId.POINTS) {

      this.setData({
        'navRefreshingState[0]': true
      })
    } else if (activeTab === tabId.VIEWS) {

      this.setData({
        'navRefreshingState[1]': true
      })
    } else if (activeTab === tabId.NEWS) {

      this.setData({
        'navRefreshingState[2]': true
      })
    }
  },
  tabSelect(e) {
    const id = e.currentTarget.dataset.id
    const datalist = this.data.navListdatas[id]
    if (id === tabId.POINTS) {
      this.setData({
        'navRefreshingState[0]': true,
        active: id,
      })
    } else if (id === tabId.VIEWS) {
      this.setData({
        'navRefreshingState[1]': true,
        active: id,
      })
    } else if (id === tabId.NEWS) {
      this.setData({
        'navRefreshingState[2]': true,
        active: id,
      })
    }
    // this.getList(id)
  },
  //获取列表
  getList(id = tabId.POINTS, page = {
    pageSize: 10,
    pageNum: 1
  }, isLoadMore) {
    const that = this
    if (id === tabId.POINTS) {
      getBignamePointCover().then(function(result) {
        if (result) {
          that.setData({
            'navCoverDatas[0].url': result['publishImage'],
            'navCoverDatas[0].title': result['title'],
            'navCoverDatas[0].id': result['id']
          })
        }
      })
      getBignamePointNews(page).then(function(result) {
        let oldListData = that.data.navListdatas[id]
        let newListData = result.result
        if (isLoadMore) {
          newListData = oldListData.concat(newListData)
        }
        const pageCount = result.totalPage
        that.setData({
          'navPageCounts[0]': pageCount,
          'navRefreshingState[0]': false,
          'navLoadingState[0]': false,
          'navHasMoreState[0]': page.pageNum < pageCount,
          'navListdatas[0]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })
      }).catch(function() {
        if (isLoadMore) {
          that.setData({
            'navRefreshingState[0]': false,
            'navLoadingState[0]': false
          })
        } else {
          that.setData({
            'navRefreshingState[0]': false,
            'navLoadingState[0]': false,
            'navListdatas[0]': []
          }, function() {
            wx.stopPullDownRefresh()
          })
        }
      })

    } else if (id === tabId.VIEWS) {
      getEggPriceViewNewCover().then(function(result) {
        if (result) {
          that.setData({
            'navCoverDatas[1].url': result['publishImage'],
            'navCoverDatas[1].title': result['title'],
            'navCoverDatas[1].id': result['id']
          })
        }
      })
      getEggPriceViewNews(page).then(function(result) {
        let oldListData = that.data.navListdatas[id]
        let newListData = result.result
        if (isLoadMore) {
          newListData = oldListData.concat(newListData);
        }
        const pageCount = result.totalPage
        that.setData({
          'navPageCounts[1]': pageCount,
          'navRefreshingState[1]': false,
          'navLoadingState[1]': false,
          'navHasMoreState[1]': page.pageNum < pageCount,
          'navListdatas[1]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })
      }).catch(function() {
        if (isLoadMore) {
          that.setData({
            'navRefreshingState[1]': false,
            'navLoadingState[1]': false
          })
        } else {
          that.setData({
            'navRefreshingState[1]': false,
            'navLoadingState[1]': false,
            'navListdatas[1]': []
          }, function() {
            wx.stopPullDownRefresh()
          })
        }
      })
    } else if (id === tabId.NEWS) {
      getEggNewCover().then(function(result) {
        if (result) {
          that.setData({
            'navCoverDatas[2].url': result['publishImage'],
            'navCoverDatas[2].title': result['title'],
            'navCoverDatas[2].id': result['id']
          })
        }
      })
      getEggNews(page).then(function(result) {
        let oldListData = that.data.navListdatas[id]
        let newListData = result.result
        if (isLoadMore) {
          newListData = oldListData.concat(newListData);
        }
        const pageCount = result.totalPage
        that.setData({
          'navPageCounts[2]': pageCount,
          'navRefreshingState[2]': false,
          'navLoadingState[2]': false,
          'navHasMoreState[2]': page.pageNum < pageCount,
          'navListdatas[2]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })
      }).catch(function() {
        if (isLoadMore) {
          that.setData({
            'navRefreshingState[2]': false,
            'navLoadingState[2]': false
          })
        } else {
          that.setData({
            'navRefreshingState[2]': false,
            'navLoadingState[2]': false,
            'navListdatas[2]': []
          }, function() {
            wx.stopPullDownRefresh()
          })
        }
      })
    }
  },
  //获取列表
  getList2(id = tabId.POINTS, page = {
    pageSize: 10,
    pageNum: 1
  }, isLoadMore) {
    console.log('加载数据，页数：' + page.pageNum + "size=" + page.pageSize)
    let pageCount = 1
    let name = '资讯'
    if (id === tabId.POINTS) {
      pageCount = 3
      name = '观点'
    } else if (id === tabId.VIEWS) {
      pageCount = 4
      name = '视点'
    } else if (id === tabId.NEWS) {
      name = '新闻'
      pageCount = 2
    }

    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        title: '我是数据' + name
      })
    }
    let oldListData = this.data.navListdatas[id]
    let newListData = list
    if (isLoadMore) {
      newListData = oldListData.concat(list);
    }
    const that = this

    setTimeout(function() {
      if (id === tabId.POINTS) {
        that.setData({
          'navPageCounts[0]': pageCount,
          'navRefreshingState[0]': false,
          'navLoadingState[0]': false,
          'navHasMoreState[0]': page.pageNum < pageCount,
          'navListdatas[0]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })

      } else if (id === tabId.VIEWS) {
        that.setData({
          'navPageCounts[1]': pageCount,
          'navRefreshingState[1]': false,
          'navLoadingState[1]': false,
          'navHasMoreState[1]': page.pageNum < pageCount,
          'navListdatas[1]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })

      } else if (id === tabId.NEWS) {
        that.setData({
          'navPageCounts[2]': pageCount,
          'navRefreshingState[2]': false,
          'navLoadingState[2]': false,
          'navHasMoreState[2]': page.pageNum < pageCount,
          'navListdatas[2]': newListData
        }, function() {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })
      }
    }, 500)
  },
  loadData(e) {
    const {
      page,
      isLoadMore,
      hasMore
    } = e.detail
    this.getList(e.currentTarget.dataset.id, page, isLoadMore)
  }
})

module.export = {
  tabId
}
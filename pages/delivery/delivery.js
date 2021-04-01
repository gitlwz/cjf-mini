// pages/delivery/delivery.js
import { deliverystore, deliveryknowledge, deliveryflow} from '../../api/api.js'
import { HTTP_DOMIN } from '../..//utils/network/config.js'
const tabId = {
  STORE: 0,
  KNOWLEDGE: 1,
  FLOW: 2,
  IMITATE:3
}
var appGloableData = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    http: HTTP_DOMIN,
    navdata: {
      title: '交割知识',
      navbar: '2'
    },
    navH: '',
    navList: [{
      title: '交割库',
      id: tabId.STORE
    }, {
        title: '交割知识',
      id: tabId.KNOWLEDGE
    }, {
        title: '交割流程',
      id: tabId.FLOW
      }, {
        title: '模拟交割流程',
        id: tabId.IMITATE
      }],
    navRefreshingState: [true, false, false, false],
    navLoadingState: [true, true, true, true],
    navPageCounts: [1, 1, 1],
    navHasMoreState: [true, true, true, true],
    navListdatas: [
      [],
      []
    ],
    listHeight: appGloableData.screenWidth / 750 * 1024,
    active: 0,
    flowContent: ''
  },
  count:0,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var query = wx.createSelectorQuery()
    var that = this;
    query.select('.nav').boundingClientRect(function (rect) {
      const height = appGloableData.screenHeight - rect.height- 18
      that.setData({
        listHeight: height
      })

    }).exec()
    this.setData({
      navH: getApp().globalData.navHeight
    });
  },
  onPullDownRefresh: function () {
    const activeTab = this.data.active
    if (activeTab === tabId.STORE) {

      this.setData({
        'navRefreshingState[0]': true
      })
    } else if (activeTab === tabId.KNOWLEDGE) {

      this.setData({
        'navRefreshingState[1]': true
      })
    } else if (activeTab === tabId.FLOW) {

      this.setData({
        'navRefreshingState[2]': true
      })
    } else if (activeTab === tabId.IMITATE) {

      this.setData({
        'navRefreshingState[2]': true
      })
    }
  },
  tabSelect(e) {
    const id = e.currentTarget.dataset.id
    const page={
      pageSize: 13,
      pageNum:1
    }
    const datalist = this.data.navListdatas[id]
    if (id === tabId.STORE) {
      this.setData({
        'navRefreshingState[0]': datalist.length === 0 ? true : false,
        active: id,
      })
      this.getList(id, page, false)
    } else if (id === tabId.KNOWLEDGE) {
      this.setData({
        'navRefreshingState[1]': datalist.length === 0 ? true : false,
        active: id,
      })
      if (this.count > 0) {
        this.getList(id, page, false)
      }
      this.count++
    } else if (id === tabId.FLOW) {
      const that = this
      this.setData({
        active: id
      })
      deliveryflow().then(function (result) {
        that.setData({
          'flowContent.title': result['title'],
          'flowContent.source': result['source'],
          'flowContent.publishTime': result['publishTime'],
          'flowContent.publishImage': result['publishImage'],
          'flowContent.publishContent': result['publishContent'],
          'flowContent.publishVideo': result['publishVideo']
        })
      }).catch(function () {
      })
    } else if (id === tabId.IMITATE) {
      console.log(3)
      this.setData({
        active: id,
      })
    }
  },
  //获取列表
  getList(id = tabId.STORE, page, isLoadMore) {
    const that = this
    if (id === tabId.STORE) {
      deliverystore(page).then(function (result) {
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
        }, function () {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }
        })
      }).catch(function () {
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
          }, function () {
            wx.stopPullDownRefresh()
          })
        }
      })
    } else if (id === tabId.KNOWLEDGE) {
      deliveryknowledge(page).then(function (result) {
        let oldListData = that.data.navListdatas[id]
        let newListData = result.result
        if (isLoadMore) {
          newListData = oldListData.concat(newListData)
        }
        const pageCount = result.totalPage
        that.setData({
          'navPageCounts[1]': pageCount,
          'navRefreshingState[1]': false,
          'navLoadingState[1]': false,
          'navHasMoreState[1]': page.pageNum < pageCount,
          'navListdatas[1]': newListData
        }, function () {
          if (!isLoadMore) {
            wx.stopPullDownRefresh()
          }

        })
      }).catch(function () {
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
          }, function () {
            wx.stopPullDownRefresh()
          })
        }
      })
    } else if (id === tabId.FLOW) {
      console.log(33)

    }
  },
  loadData(e) {
    console.log(33)
    const {
      page,
      isLoadMore,
      hasMore
    } = e.detail
    this.getList(e.currentTarget.dataset.id, page, isLoadMore)
  }
})

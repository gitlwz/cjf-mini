import {
  getIndexBanner,
  getIndexNotices,
  getBignamePointNew,
  getEggPriceViewNew,
  getEggNew,
  companyhome
} from '../../api/api.js'

const appGlobalData = getApp().globalData

const tabId = {
  POINTS: 0,
  VIEWS: 1,
  NEWS: 2,
}

Page({
  data: {
    indexItem:0,
    navdata: {
      title: '首页',
      navbar: '1'
    },
    navH: '',
    imgUrls: [],
    notices: [],
    companyList:[],
    hotInstruments: [{
      info: '我是热点行情1'
    },
    {
      info: '我是热点行情2'
    },
    {
      info: '我是热点行情3'
    }
    ],
    navList: [{
      title: '大咖观点',
      id: tabId.POINTS
    },
    {
      title: '蛋价视点',
      id: tabId.VIEWS
    },
    {
      title: '蛋业新闻',
      id: tabId.NEWS
    }
    ],
    active: tabId.POINTS,
    navListdatas: [
      [],
      [],
      []
    ],
    navRefreshingState: [true, false, false],
    navListFailedState: [false, false, false]
  },
  onLoad: function () {
    if (__wxConfig.envVersion === 'trial') {
      wx.showModal({
        title: '重要提示',
        content: '体验版请点击屏幕右上角的按钮打开菜单选择「开发调试->打开调试」以访问网络',
        showCancel: false
      })
    }
    this.initData()
    this.setData({
      navH: getApp().globalData.navHeight
    });
    const that = this
    //获取交易所类型列表info
    companyhome().then(function (e) {
      that.setData({
        companyList: e
      })
    }).catch(function () { })
  },
  initData: function () {
    this.getBanner()
    this.getNotices()
  },
  getBanner: function () {
    const that = this
    getIndexBanner().then(function (e) {
      that.setData({
        imgUrls: e
      })
    }).catch(function () { })
  },
  onShow:function(){
    // this.onLoad()
  },
  getNotices: function () {
    const that = this
    getIndexNotices().then(function (e) {
      that.setData({
        notices: e
      })
    }).catch(function () { })
  },
  // tab切换
  tabSelect(e) {
    const activeId = e.currentTarget.dataset.id
    const datalist = this.data.navListdatas[activeId]
    const listIsFailed = this.data.navListFailedState[activeId]
    if (activeId === tabId.POINTS) {
      appGlobalData.pageInfo.newList.active = 0
      this.setData({
        'navRefreshingState[0]': datalist.length === 0 && !listIsFailed ? true : false,
        active: activeId,
      })
    } else if (activeId === tabId.VIEWS) {
      appGlobalData.pageInfo.newList.active = 1
      this.setData({
        'navRefreshingState[1]': datalist.length === 0 && !listIsFailed ? true : false,
        active: activeId,
      })
    } else if (activeId === tabId.NEWS) {
      appGlobalData.pageInfo.newList.active = 2
      this.setData({
        'navRefreshingState[2]': datalist.length === 0 && !listIsFailed ? true : false,
        active: activeId,
      })
    }
  },
  //获取列表
  getMockList() {
    const that = this
    const activeId = that.data.active
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        title: '我是数据' + i
      })
    }
    let newListData = list;
    setTimeout(function () {
      if (activeId === tabId.POINTS) {

        that.setData({
          'navRefreshingState[0]': false,
          'navListdatas[0]': newListData,
        }, function () {
          wx.stopPullDownRefresh()
        })
      } else if (activeId === tabId.VIEWS) {

        that.setData({
          'navRefreshingState[1]': false,
          'navListdatas[1]': newListData,
        }, function () {
          wx.stopPullDownRefresh()
        })
      } else if (activeId === tabId.NEWS) {

        that.setData({
          'navRefreshingState[2]': false,
          'navListdatas[2]': [],
        }, function () {
          wx.stopPullDownRefresh()
        })
      }
    }, 3000)

  },
  //获取列表
  getList() {
    const that = this
    const activeId = that.data.active
    let data = that.data
    if (activeId === tabId.POINTS) {
      getBignamePointNew().then(function (result) {
        data = {
          'navRefreshingState[0]': false,
          'navListdatas[0]': result,
          'navListFailedState[0]': false
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      }).catch(function () {
        data = {
          'navRefreshingState[0]': false,
          'navListdatas[0]': [],
          'navListFailedState[0]': true
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      })
    } else if (activeId === tabId.VIEWS) {
      getEggPriceViewNew().then(function (result) {
        data = {
          'navRefreshingState[1]': false,
          'navListdatas[1]': result,
          'navListFailedState[1]': false
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      }).catch(function () {
        data = {
          'navRefreshingState[1]': false,
          'navListdatas[1]': [],
          'navListFailedState[1]': true
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      })

    } else if (activeId === tabId.NEWS) {
      getEggNew().then(function (result) {
        data = {
          'navRefreshingState[2]': false,
          'navListdatas[2]': result,
          'navListFailedState[2]': false
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      }).catch(function () {
        data = {
          'navRefreshingState[2]': false,
          'navListdatas[2]': [],
          'navListFailedState[2]': true
        }
        that.setData(data, function () {
          wx.stopPullDownRefresh()
        })
      })
    }
  },
  loadData(e) {
    this.getList()
  },
  catchTouchMove: function (res) {
    return false
  },
  onPullDownRefresh: function () {
    console.log("下拉刷新")
    //获取交易所类型列表info
    companyhome().then(function (e) {
      that.setData({
        companyList: e
      })
      console.log("刷新成功")
    }).catch(function () { })
    const that = this
    this.initData()
    const activeId = this.data.active
    if (activeId === tabId.POINTS) {
      that.setData({
        'navRefreshingState[0]': true
      })
    } else if (activeId === tabId.VIEWS) {
      that.setData({
        'navRefreshingState[1]': true
      })
    } else if (activeId === tabId.NEWS) {
      that.setData({
        'navRefreshingState[2]': true
      })
    }
  },
  toMarket(){
    getApp().globalData.param ='蛋价宝,tabTwo'
    wx.switchTab({
      url: '/pages/instruments_list/index'
    })
  },
  toSmartEgg(){
    getApp().globalData.param = '智慧蛋,tabOne'
    wx.switchTab({
      url: '/pages/instruments_list/index'
    })
  },
  scrollUp(e){
    console.log(e.detail.scrollLeft)
    if (e.detail.scrollLeft <= 180){
      this.setData({
        indexItem: 0
      })
    } else if (e.detail.scrollLeft > 180 && e.detail.scrollLeft <= 360 ) {
  
      this.setData({
        indexItem: 1
      })
    } else if(e.detail.scrollLeft > 360){
      this.setData({
        indexItem: 2
      })
    }
  }
})

import router from './utils/routeHelper'

//整个小程序只有一个 App 实例，是全部页面共享的 getApp 方法获取到全局唯一的 App 示例，获取App上的数据或调用开发者注册在 App 上的函数
App({
  // 配置全局数据
  globalData: {
    router: router,
    navHeight: 0,
    statusHeight: 0,
    screenHeight: 0,
    screenWidth: 0,
    contentHeight: 0,
    tabBarHeight: 44,
    codeToken: '',
    platform:'',
    titleHeight: 0,
    userInfo: {},
    pageInfo: {
      // 资讯列表默认激活tab
      newList: { active: 0 }
    },
    param: '',
    login: wx.getStorageSync('token') ? true : false 
  },
  // 小程序初始化完成时触发，全局只触发一次
  onLaunch: function (option) {
    console.log()
    var that = this;
    // 获取导航高度；
    wx.getSystemInfo({
      success: res => {
        // 顶部导航栏高度
        let navigationHeight = 44
        // 状态栏高度
        let statusHeight = res.statusBarHeight
        // 整个屏幕高度
        let screentHeight = res.screenHeight
        // 除去状态栏，顶部导航栏，底部tabBar高度的中间可视区域高度
        this.globalData.screenWidth = res.windowWidth
        if (res.brand.search('HUAWEI') !== -1) {
          wx.showToast({
            title: '检测到您是华为手机',
          })
          // 华为手机减去底部虚拟导航高度
          this.globalData.screenHeight = res.windowHeight - 30
          this.globalData.contentHeight = screentHeight - statusHeight - navigationHeight - 30
        } else {
          // 除去状态栏，顶部导航栏的中间内容高度
          this.globalData.contentHeight = screentHeight - statusHeight - navigationHeight
          this.globalData.screenHeight = res.windowHeight
        }
        //导航高度
        this.globalData.navHeight = res.statusBarHeight * (750 / res.windowWidth) + 97;
        this.globalData.titleHeight = this.globalData.navHeight - statusHeight;
        this.globalData.platform = res.platform
      }, fail(err) { }
    })
  },

  watch: function (method) {
    var obj = this.globalData;
    Object.defineProperty(obj, "token", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        console.log(value,2222222222222)
        method(value);
      },
      get: function () {
        console.log("监听函数的get方法")
        // 可以在这里打印一些东西，然后在其他界面调用getApp().globalData.name的时候，这里就会执行。
        // return this._name
      }
    })
  }
})

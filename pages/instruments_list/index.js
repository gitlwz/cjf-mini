var appinit = getApp();

Page({
  //页面的初始数据
  data: {
    isLoading: true,
    listData: [],
    navdata: {
      title: '蛋价宝',
      navbar: '0'
    },
    navH: '',
    tabContent: {
      tabOne: '提交需求',
      tabTwo: '市场报价',
      tabThree: '保费计算器'
    },
    activityIndex:0,
    currentTab:'tabTwo',
    showTab: true,
    isFirstTabSelectIn: true,
    toBottom: '',
    reflesh: false
  },
  //获取列表
  getList(page = {
    pageSize: 20,
    pageNum: 1
  }) {
    const list = []
    for (let i = 0; i < 10; i++) {
      list.push({
        title: '我是数据' + i
      })
    }
    const newListData = this.data.listData.concat(list);
    const that = this
    setTimeout(function () {
      that.setData({
        isLoading: false,
        listData: newListData
      })
    }, 2000)

  },
  onPageScroll(object){
    if (this.data.navdata.title === '蛋融通') return
    this.setData({
      showTab : object.scrollTop < 80
    })
  },
  onTabItemTap(item) {
    if (getApp().globalData.param !== '') {
      getApp().globalData.param = ''
      return
    } else {
      this.setData({
        currentTab: 'tabTwo'
      })
    }
    console.log(item.index)
    this.setData({
      showTab: true,
      activityIndex: 1,
      navdata: {
        title: '蛋价宝',
        navbar: '0'
      },
      tabContent: {
        tabOne: '提交需求',
        tabTwo: '市场报价',
        tabThree: '期权计算器'
      }
    })
  },
  loadData(e) {
    const {
      page
    } = e.detail
    this.getList(page)
  },
  reset(event){
    const title = "navdata.title"
    this.setData({
      [title]: event.detail
    })
    switch (event.detail){
      case '蛋价宝':
        this.setData({
          tabContent: {
            tabOne: '提交需求',
            tabTwo: '市场报价',
            tabThree: '期权计算器'
          },
          currentTab: 'tabOne',
          activityIndex: 1,
          showTab: true
        });
        break;
      case '蛋融通':
        this.setData({
          currentTab: 'tabOne',
          activityIndex: 2,
          showTab: false
        });
        break;
      case '智慧蛋':
        this.setData({
          tabContent: {
            tabOne: '产销',
            tabTwo: '价格',
            tabThree: '期现'
          },
          currentTab: 'tabOne',
          activityIndex: 3,
          showTab: true
        });
        break;
      default: break;
    }
  },
  onLoad(){
    this.setData({
      navH: getApp().globalData.navHeight - 2
    });
  },
  onReachBottom: function () {
    var timestamp = new Date().getTime()
    this.setData({
      toBottom:timestamp
    })
  },
  count: 1,
  onShow:function(){
  // iOS手机上面会走一次onTabItemTap方法 android手机不会走,所以通过switch跳转的 在onshow里面跳转,在onTabItemTap将值清空

    if (getApp().globalData.param !== '') {
      const parametersArray = getApp().globalData.param.split(",")
      this.reset({ detail: parametersArray[0] })
      this.setData({
        currentTab: parametersArray[1]
      })
      if (getApp().globalData.platform.toLocaleLowerCase() == 'android'){
         getApp().globalData.param = ''
      }
    }
      if(this.count >= 2){
      this.setData({
        reflesh: !this.data.reflesh
      })
      // this.onLoad()
    }
    this.count++;
  },
  onChange(event) {
    let index = event.currentTarget.dataset.id
    let dict = { tabOne: '0', tabTwo: '1', tabThree: '2' }
    // console.log(dict[index])
    this.setData({
      currentTab: index
    });
  }
})

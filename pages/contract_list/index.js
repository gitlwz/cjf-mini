import { contractState } from '../../constant.js'
import { contractlist } from '../../api/api.js'

var app = getApp();

Page({
  //页面的初始数据
  data: {
    contractStateList: [{ text: '全部'}, { text: '已完成', key: contractState.COMPLETE }, { text: '未完成', key: contractState.NOT_COMPLETE }],
    showPop: false,
    listHeight: 0,
    isRefreshing: true,
    isLoading: true,
    listData: [],
    pageCount: 1,
    hasMore: true,
    navdata: {
      title: '合同管理',
      navbar: '2'
    },
    navH: '',
    timeUp: '',
    moneyUp: '',
    contractIndex:null,
    login: true
  },
  onLoad: function (options) {
    var query = wx.createSelectorQuery()
    var that = this;
    query.select('.filter-header').boundingClientRect(function (rect) {
      const height = app.globalData.contentHeight - rect.height
      that.setData({
        listHeight: height
      })
    }).exec()
    this.setData({
      navH: getApp().globalData.navHeight
    });
   
  },
  onTime(){
    if (this.data.timeUp === '' || !this.data.timeUp){
      this.setData({
        timeUp: true,
        moneyUp: ''
      })
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy: "signDate",
        orderWay:"asc",
        contractStatus:this.data.contractIndex
      }
      this.getList(page, this.data.isLoadMore)
    }else{
      this.setData({
        timeUp: !this.data.timeUp
      })
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy: "signDate",
        orderWay: "desc",
        contractStatus: this.data.contractIndex
      }
      this.getList(page, this.data.isLoadMore)
    }
    
  },
  onMoney() {
    if (this.data.moneyUp === '' || !this.data.moneyUp) {
      this.setData({
        moneyUp: true,
        timeUp: ''
      })
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy: "quoteUnit",
        orderWay: "asc",
        contractStatus: this.data.contractIndex
      }
      this.getList(page, this.data.isLoadMore)
    } else {
      this.setData({
        moneyUp: !this.data.moneyUp
      })
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy: "quoteUnit",
        orderWay: "desc",
        contractStatus: this.data.contractIndex
      }
      this.getList(page, this.data.isLoadMore)
    }

  },
  onPullDownRefresh: function () {
    this.setData({
      isRefreshing: true
    }
    )
  },
  switchContractType (e) {
    const type = e.currentTarget.dataset.type
    if(type === 'contract'){
      this.setData({
        showPop: !this.data.showPop
      })
    } else if(type === 'time'){
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy:"signDate"
      }
      this.getList(page, this.data.isLoadMore)
    }else{
      const page = {
        pageSize: 10,
        pageNum: 1,
        orderBy: "quoteUnit"
      }
      this.getList(page, this.data.isLoadMore)
    }
    
  },
  //获取列表
  getList(page = { pageSize: 10, pageNum: 1 }, isLoadMore) {
    var list = []
    const that = this
    contractlist(page).then(function (e) { 
      // const pageCount = e.totalPage
      const result = e.result;
      const pageCount = e.totalPage
      for (let i = 0; i < result.length; i++) {
        const contractStatus = that.data.contractStateList.find((status) => {
          return status.key === result[i].contractStatus
        })
        list.push({
          id: result[i].id,
          contractId: result[i].contractId,
          contractStatus: contractStatus.text,
          quoteUnit: result[i].quoteUnit,
          contractVolume: result[i].contractVolume,
          signDate: result[i].signDate
        })
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
      that.setData({
        login: false
      })
    })
  },
  loadData(e) {
    const { page, isLoadMore, hasMore } = e.detail
    this.getList(page, isLoadMore)
  },
  onContractStatus(e){
    const index = e.currentTarget.dataset.index
    this.setData({
      showPop: !this.data.showPop,
      contractIndex: index,
      timeUp: '',
      moneyUp:''
    })
    const page = {
      pageSize: 10,
      pageNum: 1,
      contractStatus: index
    }
    this.getList(page, this.data.isLoadMore)
  }
})
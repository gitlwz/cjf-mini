// pages/instruments_list/eggPrice/eggPrice.js
import {
  submitNeed,
  needInfo
} from '../../../api/api.js'
import {
  insureDirection
} from '../../../constant.js'
// var time = require('../../../utils/util.js');
const moment = require('../../../utils/moment.min.js');
moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm:ss",
  }
});
var appGloableData = getApp().globalData
Component({
  /**
   * 组件的属性列表
   */

  properties: {
    bottom: {
      type: String,
      observer: function(newVal, oldVal) {
        if (this.data.hasMore && this.data.login) {
          console.log("触底请求")
          const page = {
            pageSize: 10,
            pageNum: this.data.pageNum
          }
          this.getList(page)
        }
      }
    },
    reflesh: {
      type: Boolean,
      observer: function(newVal, oldVal) {
        console.log("提交需求监听到刷新")
        this.reload()
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    disabled: true,
    hasNeed: false,
    objectList: [{
      text: '买方',
      key: insureDirection.BUY
    }, {
      text: '卖方',
      key: insureDirection.SELL
    }],
    list: ['买方', '卖方'],
    objectValue: '买方',
    price: '',
    amount: '',
    time: '30',
    contact: '',
    listData: [],
    listHeight: 0,
    // isRefreshing: true,
    isLoading: true,
    pageNum: 1,
    hasMore: true,
    toBottom: '',
    login: false,
    canVerify: false,
    priceVerify: false
  },
  attached: function() {
    const that = this
    this.reload()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onInput(event) {
      const type = event.target.dataset.type
      const value = event.detail.value
      if (type === 'price') {
        this.setData({
          price: value,
          priceVerify: /^[1-9](\d){0,7}$/.test(value)
        })
      } else if (type === 'amount') {
        this.setData({
          amount: value
        })
      } else if (type === 'time') {
        this.setData({
          time: value,
        })
      } else if (type === 'contact') {
        this.setData({
          contact: event.detail.value
        })
      }
      if (this.data.contact !== '' && this.data.time !== '' && this.data.amount !== '' && this.data.price !== '' && this.data.objectValue !== '' && this.data.priceVerify) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
    },
    onBlur(event) {
       const type = event.target.dataset.type
       if (type === 'price') {
         if (!this.data.priceVerify) {
           wx.showToast({
             title: '请输入8位以内的正整数',
             icon: 'none'
           })
         }
       }
    },
    bindObjectChange(e) {
      this.setData({
        objectValue: this.data.list[e.detail.value]
      })
      if (this.data.contact !== '' && this.data.time !== '' && this.data.amount !== '' && this.data.price !== '' && this.data.objectValue !== '' && this.data.priceVerify) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
    },
    onSubmit() {
      const that = this
      if (!(/^[1-9](\d){0,7}$/.test(this.data.amount))){
        wx.showToast({
          title: '报价数量为正整数',
          icon: 'none'
        })
        return ;
      }
      if (this.data.time < 30) {
        wx.showToast({
          title: '天数需大于等于30',
          icon: 'none'
        })
      } else {
        var value = wx.getStorageSync('token')
        if (value) {
          const insureDirection = that.data.objectList.find((status) => {
            return status.text === this.data.objectValue
          })
          const param = {
            insureDirection: insureDirection.key,
            insurePrice: this.data.price,
            insureVolume: this.data.amount,
            insureDays: this.data.time,
            contactWay: this.data.contact
          }
          submitNeed(param).then(function(e) {
            wx.showModal({
              showCancel: false,
              content: '您的保价需求已经提交，我们会尽快为您制定保价方案，并及时通知您。'
            })
            that.setData({
              objectValue: '买方',
              price: '',
              amount: '',
              contact: '',
              disabled: true
            })
            that.reload()
          }).catch(function(res) {
          })
        }
        else {
          wx.showModal({
            content: '您未登录,是否跳转到登录界面?',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: "/pages/login/login"
                })
              } else if (res.cancel) {}
            }
          })
        }
      }
    },
    //获取列表
    getList(page, isfresh) {
      var list = []
      const that = this
      needInfo(page).then(function(e) {
        // const pageCount = e.totalPage
        console.log('加载需求列表成功')
        const result = e.result;
        const height = result.length * 730
        const pageCount = e.totalPage
        for (let i = 0; i < result.length; i++) {
          const insureDirection = that.data.objectList.find((status) => {
            return status.key === result[i].insureDirection
          })
          list.push({
            contactWay: result[i].contactWay,
            createTime: moment(result[i].commitTime).format('l'),
            insurePrice: result[i].insurePrice,
            insureDays: result[i].insureDays,
            insureVolume: result[i].insureVolume,
            insureDirection: insureDirection.text,
            premium: result[i].premium,
            recommendCompany: result[i].recommendCompany,
            insurePrice: result[i].insurePrice,
            insureId: result[i].insureId,
            totalPremium: result[i].totalPremium,
            planStatus: result[i].planStatus,
            id: result[i].id
          })
        }
        let newListData = list
        if (isfresh) {
          newListData = list
          that.setData({
            pageCount: pageCount,
            // isRefreshing: false,
            pageNum: 2,
            isLoading: false,
            hasMore: page.pageNum < pageCount,
            listData: newListData,
            listHeight: height
          }, function() {})
        } else {
          newListData = that.data.listData.concat(list);
          that.setData({
            pageCount: pageCount,
            // isRefreshing: false,
            pageNum: that.data.pageNum + 1,
            isLoading: false,
            hasMore: page.pageNum < pageCount,
            listData: newListData,
            listHeight: height
          })
        }
      }).catch(function(res) {
        if(res.errorCode === 401){
          that.setData({
            login: false
          })
        }
      })
    },
    reload: function() {
      const that = this
      try {
        var value = wx.getStorageSync('token')
        if (value) {
          that.setData({
            login: true,
            isLoading: true
          })
          const param = {
            pageSize: 10,
            pageNum: 1
          }
          console.log("reload请求")
          that.getList(param, true)
        } else {
          that.setData({
            login: false
          })
        }
      } catch (e) {
        that.setData({
          login: false
        })
      }
    }
  }
})

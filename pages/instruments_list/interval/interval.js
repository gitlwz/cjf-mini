// pages/instruments_list/interval/interval.js
import { instrumentprice, calculateoption, calculaterate } from '../../../api/api.js'
import {
  formatDate
} from '../../../utils/util.js'
const moment = require('../../../utils/moment.min.js');
moment.locale('en', {
  longDateFormat: {
    l: "YYYY-MM-DD",
    L: "YYYY-MM-DD HH:mm:ss",
  }
});
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
    disabled: true,
    dateOne: formatDate(0),
    dateTwo: formatDate(30),
    maxSelectDateOne: formatDate(0),
    startCalculateDate: formatDate(30),
    contractList: [],
    contractValue: '',
    instrumentPrice: '',
    executionPrice: '',
    noRisk: '3',
    yearSurge: '',
    typeList: ['欧式看涨', '欧式看跌'],
    typeValue: {
      value: '欧式看涨',
      key: '0'
    },
    showResult: false,
    royalty: '',
    nominalPrincipal: '',
    totalRoyalty: '',
    minAmount: '',
    noRiskShow: true,
    yearSurgeShow:true,
    amount: '',
    priceVerify: true,
    dateOneDefault: '',
    dateTwoDefault: ''
  },
  lifetimes: {
    attached: function () {
      this.calculaterate()
      const that = this
      instrumentprice().then(function (e) {
        that.setData({
          instrumentPrice: e.instrumentPrice,
          executionPrice: e.instrumentPrice,
          contractValue: e.instrumentId
        }, function () {
          that.canSubmit()
        })
      }).catch(function () {
      })
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    calculaterate : function (e) {
      const self = this;
      calculaterate({ startDate: self.data.dateOne }).then(function (result) {
        self.setData({
          yearSurge: result.riskFreeRate || ''
        }, function() {
          this.canSubmit()
        })
      }).catch(function () {
      })

    },
    bindDateOneChange: function (e) {
      this.calculaterate();
      this.setData({
        dateOne: e.detail.value,
        startCalculateDate: formatDate(30, new Date(e.detail.value))
      }, function () {
        this.canSubmit()
      }
      )
    },
    bindDateTwoChange: function (e) {
      this.setData({
        dateTwo: e.detail.value,
        maxSelectDateOne: formatDate(-30, new Date(e.detail.value)),
      }, function () {
        this.canSubmit()
      })
    },
    onInput(e) {
      const type = e.target.dataset.type
      if (type === 'executionPrice') {
        console.log(/^[1-9]\d{0,7}$/.test(e.detail.value), e.detail.value)
        this.setData({
          executionPrice: e.detail.value,
          priceVerify: /^[1-9]\d{0,7}$/.test(e.detail.value)
        })
      } else if (type === 'noRisk') {
        this.setData({
          noRisk: Number(e.detail.value),
          noRiskShow: /^[1-9]\d{0,3}$/.test(e.detail.value)
        })
      } else {
        this.setData({
          yearSurge: e.detail.value,
          yearSurgeShow: /^[1-9]\d{0,3}$/.test(e.detail.value)
        })
      }
      this.canSubmit()
    },
    bindTypeChange(e) {
      this.setData({
        typeValue: {
          value: this.data.typeList[e.detail.value],
          key: e.detail.value
        }
      }, function () {
        this.canSubmit()
      })
    },
    // 判断按钮是否可用的方法
    canSubmit() {
        if (this.data.contractValue !== '' && this.data.instrumentPrice !== '' && this.data.executionPrice !== '' && this.data.dateOne !== '' && this.data.dateTwo !== '' && this.data.typeValue.value !== '' && this.data.noRisk !== '' && this.data.yearSurge !== '' && this.data.priceVerify && this.data.noRiskShow && this.data.yearSurgeShow) {
        this.setData({
          disabled: false
        })
      } else {
        this.setData({
          disabled: true
        })
      }
      // if (dateOne !== '' && dateTwo !== '' &&dateOne === dateTwo){
      //   wx:wx.showToast({
      //     title: '到期日期需晚于计算日期',
      //     icon: 'none',
      //   })
      // }
    },
    onBlur(event) {
      const type = event.target.dataset.type
      if (type === 'executionPrice' && !this.data.priceVerify) {
        wx.showToast({
          title: '请输入8位以内的正整数',
          icon: 'none'
        })
      } else if (type === 'noRisk' && !this.data.noRiskShow) {
        wx.showToast({
          title: '请输入4位以内的正整数',
          icon: 'none'
        })
      } else if (type === 'yearSurge' && !this.data.yearSurgeShow) {
        wx.showToast({
          title: '请输入4位以内的正整数',
          icon: 'none'
        })
      }
    },
    onSubmit() {
      this.setData({
        amount: '',
        nominalPrincipal: '',
        totalRoyalty: ''
      })
      const that = this
      const params = {
        instrumentPrice: this.data.instrumentPrice,
        exercisePrice: this.data.executionPrice,
        startDate: this.data.dateOne,
        endDate: this.data.dateTwo,
        instrumentType: this.data.typeValue.key,
        riskFreeRate: this.data.noRisk/100,
        annualVolatility: Number(this.data.yearSurge)/100
      }
      calculateoption(params).then(function (e) {
        wx.showToast({
          title: '计算成功'
        })
        that.setData({
          // contractValue: '请选择',
          // instrumentPrice: '',
          // executionPrice: '',
          // dateOne: '',
          // dateTwo: '',
          // typeValue: {
          //   value: '欧式看涨',
          //   key: '0'
          // },
          // noRiskShow:'',
          // yearSurgeShow: '',
          showResult: true,
          royalty: e.optionPrice,
          minAmount: Math.ceil(2000000 / that.data.instrumentPrice)
        }, function () {
          wx.pageScrollTo({
            scrollTop: 1500,
            duration: 200,
            success: function () {
            },
            fail: function () {
            },
            complete: function () {
            }
          })
        })

      }).catch(function () {
        wx.showToast({
          title: '计算失败',
          icon: 'none'
        })
      })
    },
    onAmount(e) {

      const value = e.detail.value
      this.setData({
        amount: value
      })
      if (this.data.amount >= this.data.minAmount) {
        this.setData({
          nominalPrincipal: this.getLastTwoNumber(this.data.instrumentPrice * this.data.amount),
          totalRoyalty: this.getLastTwoNumber(this.data.royalty * this.data.amount)
        })
      } else {
        this.setData({
          nominalPrincipal: '',
          totalRoyalty: ''
        })
      }
    },
    getLastTwoNumber(num) {
      var result = ''
      var numStr = num.toString()
      var index = numStr.indexOf('.')
      if (index === -1) {
        result = numStr + '.00'
      } else {
        var str = numStr + '0'
        result = Number(numStr.slice(0, index + 3))
      }
      return result
    }
  }
})

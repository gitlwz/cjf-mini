import {
  feedindexdataChart,
  congestindexdataChart
} from '../../../api/api.js'
import {
  formatDate
} from '../../../utils/util.js'
import { FEED_ADDRESS, JAM_ADDRESS, NO_DATA_TYPE } from '../../instruments_list/smart_egg/data/instrumentData.js'

let chart2 = null
const appGlobalData = getApp().globalData

function initJamChart(canvas, width, height, F2) {
  const data2 = []

  chart2 = new F2.Chart({
    el: canvas,
    width,
    animate: false,
    height
  })

  chart2.source(data2, {
    congestIndex: {
      tickCount: 5,
      min: 90,
      max: 110
    },
    congestDate: {
      type: 'timeCat',
      tickCount: 4
    }

  })

  chart2.axis('congestDate', {
    label: function label(text, index, total) {
      const textCfg = {}
      if (index === 0) {
        textCfg.textAlign = 'left'
      } else if (index === total - 1) {
        textCfg.textAlign = 'right'
      }
      return textCfg
    }
  })

  chart2.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    // layout: 'vertical',
    showCrosshairs: true,
    onShow: function onShow(ev) {
      const items = ev.items
      items[0].name = `拥堵指数`
      return (ev.items = ev.items.splice(1))
    }
  })
  chart2.area()
         .position('congestDate*congestIndex')
         .color('l(90) 0:#EA5B28 0.5:#EA5B28 1:#03C389').style({
    fillOpacity: 0.4
  });
  chart2.line().position('congestDate*congestIndex').color('#D0A16C')
  chart2.legend(false)
  chart2.render()
  return chart2
}

Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0){
      this.setData({
        jamParameters: param,
        jamAddressIndex: param.jamAddressIndex || 1,
      }, function () {
        this.initJamChartData()
      })
    } else {
      this.initJamChartData()
    }
  },
  onUnload: function () {
    chart2 = null
    // 在组件实例被从页面节点树移除时执行
  },

  onShow: function () {
    this.setData({
      isFistPushPage: getCurrentPages().length === 2
    })
  },

  /**
   * 组件的初始数据
   */
  data: {
    isFistPushPage: true,
    isPortrait: true,
    jamOpts: {
      onInit: initJamChart // 延迟加载组件
    },
    jamParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: 'shi_men',
      addressName: '石门'
    },
    jamAddressArray: JAM_ADDRESS,
    jamAddressIndex: 1,
    jamRequesting: true,
    jamNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA
  },

  initJamChartData: function () {
    const self = this
    wx.showLoading({
      title: '加载中'
    })
    this.data.jamRequesting = true
    congestindexdataChart(self.data.jamParameters).then(function (result) {
      self.data.jamRequesting = false
      let data2 = result.congestIndexDataModelList;
      const jamDataStatus = (!data2 || data2.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
      self.setData({
        jamNoData: jamDataStatus
      })
      var chart2UpdateName
      var chart2Update = function () {
        if (chart2 != null) {
          chart2.changeData(data2)
          clearInterval(chart2UpdateName)
        }
        wx.hideLoading()
      }
      chart2UpdateName = setInterval(chart2Update, 100)
    }).catch(function () {
      self.setData({
        jamNoData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      self.data.jamRequesting = false
      wx.hideLoading()
      console.error('接口异常')
      wx.showToast({
        title: '接口异常',
        icon: 'none'
      })
    })
  },
  bindPickerChange: function (e) {
    const valueIndex = Number(e.detail.value)
    const addressDic = this.data.jamAddressArray[valueIndex]
    this.setData({
      jamAddressIndex: valueIndex,
      jamParameters: {
        ...this.data.jamParameters,
        address: addressDic.value,
        addressName: addressDic.name
      }
    })
    this.initJamChartData()
  },
  handDateChange(event) {
    const datePickName = event.detail.currentTarget.dataset.pickname
    if (datePickName === 'startDate') {
      this.setData({
        jamParameters: {
          ...this.data.jamParameters,
          startDate: event.detail.detail.value
        }
      })
    } else if (datePickName === 'endDate') {
      this.setData({
        jamParameters: {
          ...this.data.jamParameters,
          endDate: event.detail.detail.value
        }
      })
    }
    this.initJamChartData()
  },
  preLineClicked() {
    wx.navigateBack()
  },
  nextLineClicked() {
    wx.navigateTo({
      url: "/pages/landscape_line/feed/feed"
    })
  },
  closeLineClicked() {
    wx.navigateBack()
  }
})

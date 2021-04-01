
import {
  priceconstancy,
} from '../../../api/api.js'
import { SPOT_ADDRESS, NO_DATA_TYPE } from '../../instruments_list/smart_egg/data/instrumentData.js'
import {
  formatDate
} from '../../../utils/util.js'

let chart = null;

function initStableChart(canvas, width, height, F2) {
  const data = [];
  chart = new F2.Chart({
    el: canvas,
    width,
    animate: false,
    height
  });
  chart.source(data, {
    spotDate: {
      range: [0, 1],
      tickCount: 4
    },
    price: {
      tickCount: 5,
      formatter(val) {
        return val.toFixed(1);
      }
    }
  });
  chart.axis('spotDate', {
    line: null,
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === 0) {
        textCfg.textAlign = 'left';
      } else if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });

  chart.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    layout: 'vertical'
  });
  chart.line({
    connectNulls: true, // 将空数据连接
  }).position('spotDate*price').color('type', val => {
    if (val === '价格稳定性') {
      return '#5AD8A6';
    } else {
      return '#5B8FF9';
    }
  });
  chart.legend(false)
  chart.render();
  return chart;
}

Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0) {
      this.setData({
        stableParameters: param,
        stableAddressIndex: param.stableAddressIndex || 1
      }, function () {
        this.requestStableChartData()
      })
    } else {
      this.requestStableChartData()
    }
  },
  onUnload: function () {
    chart = null;
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
    priceLegend: [{ name: '石门', fill: '#5B8FF9' }, { name: '价格稳定性', fill: '#5AD8A6' }],
    stableOpts: {
      onInit: initStableChart
    },
    stableParameters: { startDate: formatDate(-90), endDate: formatDate(0), address: "shi_men", addressName: '石门' },
    addressArray: SPOT_ADDRESS,
    stableAddressIndex: 1,
    stableRequesting: true,
    stableNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
  },

  requestStableChartData: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    this.data.stableRequesting = true;
    priceconstancy(self.data.stableParameters).then(function (result) {
      let data = result.stablePriceList.concat(result.addressPriceList);
      self.setData({
        stableNoData: (!data || data.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
      })
      var chartUpdateName;
      var chartUpdate = function () {
        if (chart != null) {
          chart.changeData(data)
          clearInterval(chartUpdateName)
        }
        self.data.stableRequesting = false;
        wx.hideLoading();
      }
      chartUpdateName = setInterval(chartUpdate, 100);
    }).catch(function () {
      self.setData({
        stableNoData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      self.data.stableRequesting = false;
      wx.hideLoading();
      console.error('接口异常')
      wx.showToast({
        title: '接口异常',
        icon: 'none',
      })
    })
  },
  bindPickerChange: function (e) {
    const valueIndex = Number(e.detail.value)
    if (e.currentTarget.dataset.pickname === 'stableAddress') {
      const addressDic = this.data.addressArray[valueIndex];
      let realPriceLegend = this.data.priceLegend.slice();
      realPriceLegend[0].name = addressDic.name;
      this.setData({
        stableAddressIndex: valueIndex,
        priceLegend: realPriceLegend,
        stableParameters: {
          ...this.data.stableParameters,
          address: addressDic.value,
          addressName: addressDic.name
        }
      })
      this.requestStableChartData();
    }
  },
  handDateChange(event) {
    const datePickName = event.detail.currentTarget.dataset.pickname
    if (event.currentTarget.id === 'group-date-stable') {
      if (datePickName === 'startDate') {
        this.setData({
          stableParameters: {
            ...this.data.stableParameters,
            startDate: event.detail.detail.value
          }
        })
      } else if (datePickName === 'endDate') {
        this.setData({
          stableParameters: {
            ...this.data.stableParameters,
            endDate: event.detail.detail.value
          }
        })
      }
      this.requestStableChartData()
    }
  },
  preLineClicked() {
    wx.navigateBack()
  },
  nextLineClicked() {
    wx.navigateTo({
      url: "/pages/landscape_line/season/season"
    })
  },
  closeLineClicked() {
    wx.navigateBack({
      delta: 100
    })
  }
})

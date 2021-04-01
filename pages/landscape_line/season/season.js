
import {
  futurespotprice
} from '../../../api/api.js'
import { SPOT_ADDRESS, DELIVERY_MONTH, NO_DATA_TYPE } from '../../instruments_list/smart_egg/data/instrumentData.js'
import {
  formatDate
} from '../../../utils/util.js'
let chart2 = null;
const monthLegency = ['#E8684A', '#F6BD16', '#5D7092', '#5B8FF9', '#5AD8A6']

function initSeasonChart(canvas, width, height, F2) {
  const data2 = [];
  chart2 = new F2.Chart({
    el: canvas,
    width: width,
    animate: false,
    height: height
  });

  chart2.source(data2, {
    day: {
      type: 'cat',
      tickCount: 12,
      formatter: function formatter(ivalue) {
        return ivalue.substring(0, 2);
      },
      range: [0, 1]
    },
    price: {
      tickCount: 6,
      min: 0,
      formatter: function formatter(ivalue) {
        return ivalue + '元';
      }
    }
  });

  chart2.axis('day', {
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
  chart2.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    showCrosshairs: true,
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].title = `近几年${items[0].origin.day}日价格`;
    }
  });
  chart2.legend(false)
  chart2.line({
    connectNulls: true, // 将空数据连接
  }).position('day*price').color('year', monthLegency);
  chart2.render();
  return chart2;
}
Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0) {
      this.setData({
        seasonParameters: param,
        seasonAddressIndex: param.seasonAddressIndex || 1,
        deliveryMonthIndex: param.deliveryMonthIndex || 1,
        chartTypeIndex: param.chartTypeIndex || 0
      }, function () {
        this.requestSeasonChartData()
      })
    } else {
      this.requestSeasonChartData()
    }
  },
  onUnload: function () {
    chart2 = null;
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
    monthLegend: monthLegency,
    seasonOpts: {
      onInit: initSeasonChart
    },
    seasonParameters: { type: '0', address: 'shi_men', addressName: '石门' },
    spotTableData: [],
    addressArray: SPOT_ADDRESS,
    deliveryMonth: DELIVERY_MONTH,
    chartTypeArray: [{ value: '0', name: "现货" }, { value: '1', name: "期货" }],
    seasonAddressIndex: 1,
    deliveryMonthIndex: 1,
    chartTypeIndex: 0,
    seasonRequesting: true,
    seasonNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA
  },
  requestSeasonChartData: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    this.data.seasonRequesting = true;
    futurespotprice(self.data.seasonParameters).then(function (result) {
      // self.data.seasonRequesting = false;
      let data2 = result;
      self.setData({
        seasonNoData: (!data2 || data2.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
      })
      var chart2UpdateName;
      var chart2Update = function () {
        if (chart2 != null) {
          chart2.changeData(data2)
          clearInterval(chart2UpdateName)
        }
        self.data.seasonRequesting = false;
        wx.hideLoading()

      }
      chart2UpdateName = setInterval(chart2Update, 100);
    }).catch(function () {
      self.setData({
        seasonNoData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      self.data.seasonRequesting = false;
      wx.hideLoading()
      console.error('接口异常')
      wx.showToast({
        title: '接口异常',
        icon: 'none',
      })
    })
  },
  bindPickerChange: function (e) {
    const valueIndex = Number(e.detail.value)
    if (e.currentTarget.dataset.pickname === 'seasonAddress') {
      const addressDic = this.data.addressArray[valueIndex];
      this.setData({
        seasonAddressIndex: valueIndex,
        seasonParameters: { type: this.data.chartTypeIndex.toString(), address: addressDic.value, addressName: addressDic.name }
      })
      this.requestSeasonChartData()
    } else if (e.currentTarget.dataset.pickname === 'deliverMonth') {
      const addressDic = this.data.deliveryMonth[valueIndex];
      this.setData({
        deliveryMonthIndex: valueIndex,
        seasonParameters: {
          type: this.data.chartTypeIndex.toString(),
          deliveryMonth: addressDic.value
        }
      })
      this.requestSeasonChartData()
    } else if (e.currentTarget.dataset.pickname === 'chartType') {
      const addressDic = this.data.chartTypeArray[valueIndex];
      // seasonParameters: ,
      const jamParameters = { type: valueIndex.toString() }
      if (valueIndex === 0) { //现货
        const addressDic = this.data.addressArray[this.data.seasonAddressIndex];
        jamParameters.address = addressDic.value;
        jamParameters.addressName = addressDic.name;
      } else {
        jamParameters.deliveryMonth = this.data.deliveryMonth[this.data.deliveryMonthIndex].value;
      }
      this.setData({
        chartTypeIndex: valueIndex,
        seasonParameters: jamParameters
      })
      this.requestSeasonChartData()
    }
  },
  preLineClicked() {
    wx.navigateBack()
  },
  nextLineClicked() {
    wx.navigateTo({
      url: "/pages/landscape_line/basic/basic"
    })
  },
  closeLineClicked() {
    wx.navigateBack({
      delta: 100
    })
  }
})

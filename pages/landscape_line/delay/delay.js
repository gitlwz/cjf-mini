import {
  futuredataCorrelation
} from '../../../api/api.js'
import {
  formatDate
} from '../../../utils/util.js'
import {
  SPOT_ADDRESS,
  DELIVERY_MONTH,
  DELAY_DAYS_ARRAY,
  NO_DATA_TYPE
} from '../../instruments_list/smart_egg/data/instrumentData.js'
let chart2 = null;

function initDelayChart(canvas, width, height, F2) {
  const data2 = []
  chart2 = new F2.Chart({
    el: canvas,
    animate: false,
    width,
    height
  });
  chart2.source(data2, {
    spotPrice: {
      min: 0,
      max: 6,
      nice: true,
      alias: "现货"
    },
    futurePrice: {
      min: 0,
      nice: true,
      max: 6,
      alias: "期货"
    },
    basisPrice: {
      min: -1,
      max: 1,
      nice: true,
      alias: "相关系数"

    },
    date: {
      type: 'timeCat',
      tickCount: 3,
      range: [0, 1]
    }

  });

  chart2.axis('date', {
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
    // layout: 'vertical',
    showCrosshairs: true,
    // onShow: function onShow(ev) {
    //   const items = ev.items;
    //   items[0].name = `拥堵指数`;
    //   return (ev.items = ev.items.splice(1));
    // },
  });

  // chart2.line()
  //   .position('date*price').color('type', type => {
  //     if (type === '相关系数') {
  //       return '#5D7092';
  //     } else if (type === '现货') {
  //       return '#5AD8A6';
  //     } else if (type === '期货') {
  //       return '#5B8FF9';
  //     }
  //   });
  chart2.line().position('date*spotPrice').color('#5AD8A6');
  chart2.line().position('date*futurePrice').color('#5B8FF9');
  chart2.line().position('date*basisPrice').color('#5D7092');

  chart2.legend(false)
  chart2.render();
  return chart2;
}


Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0) {
      this.setData({
        delayParameters: param,
        delayAddressIndex: param.delayAddressIndex || 1,
        delayDaysIndex: param.delayDaysIndex || 5,
      }, function () {
        this.requestDelayChartData()
      })
    } else {
      this.requestDelayChartData()
    }
  },
  onUnload: function() {
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
    delayOpts: {
      onInit: initDelayChart
    },
    delayParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: 'shi_men',
      addressName: '石门',
      deliveryMonth: "index_price",
      layDays: 42
    },
    addressArray: SPOT_ADDRESS,
    deliveryMonthArray: DELIVERY_MONTH,
    delayDaysArray: DELAY_DAYS_ARRAY,
    delayAddressIndex: 1,
    delayDaysIndex: 5,
    delayRequesting: true,
    delayNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA
  },

  /**
   * 组件的方法列表
   */
  requestDelayChartData: function() {
    this.data.delayRequesting = true;
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    futuredataCorrelation(self.data.delayParameters).then(function(result) {
      let data2 = result.basisList;
      self.setData({
        delayNoData: (!data2 || data2.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
      })
      wx.setStorage({
        key: 'minMaxValue',
        data: result.minAndMaxPrice
      })
      var chart2UpdateName;
      var chart2Update = function() {
        if (chart2 != null) {
          chart2.changeData(data2)
          chart2.repaint()
          clearInterval(chart2UpdateName)
        }
        self.data.delayRequesting = false;
        wx.hideLoading()
      }
      chart2UpdateName = setInterval(chart2Update, 100);
    }).catch(function() {
      self.setData({
        delayNoData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      self.data.delayRequesting = false;
      wx.hideLoading()
      console.error('接口异常')
      wx.showToast({
        title: '接口异常',
        icon: 'none',
      })
    })
  },
  bindPickerChange: function(e) {
    const valueIndex = Number(e.detail.value)
    if (e.currentTarget.dataset.pickname === 'delayAddress') {
      const addressDic = this.data.addressArray[valueIndex];
      this.setData({
        delayAddressIndex: valueIndex,
        delayParameters: {
          ...this.data.delayParameters,
          address: addressDic.value,
          addressName: addressDic.name
        }
      })
      this.requestDelayChartData()
    } else if (e.currentTarget.dataset.pickname === 'delayDays') {
      this.setData({
        delayDaysIndex: valueIndex,
        delayParameters: {
          ...this.data.delayParameters,
          layDays: this.data.delayDaysArray[valueIndex]
        }
      })
      this.requestDelayChartData()
    }
  },
  handDateChange(event) {
    const datePickName = event.detail.currentTarget.dataset.pickname
    if (event.currentTarget.id === 'group-date-delay') {
      if (datePickName === 'startDate') {
        this.setData({
          delayParameters: { ...this.data.delayParameters,
            startDate: event.detail.detail.value
          }
        })
      } else if (datePickName === 'endDate') {
        this.setData({
          delayParameters: { ...this.data.delayParameters,
            endDate: event.detail.detail.value
          }
        })
      }
      this.requestDelayChartData();
    }
  },
  preLineClicked() {
    wx.navigateBack()
  },
  closeLineClicked() {
    wx.navigateBack({
      delta: 100
    })
  }
})
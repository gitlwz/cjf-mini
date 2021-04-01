import {
  futuredataBasis
} from '../../../api/api.js'
import {
  formatDate
} from '../../../utils/util.js'
import { SPOT_ADDRESS, DELIVERY_MONTH, NO_DATA_TYPE } from '../../instruments_list/smart_egg/data/instrumentData.js'
let chart = null;

function initBasicChart(canvas, width, height, F2) {
  const data = [];
  chart = new F2.Chart({
    el: canvas,
    animate: false,
    width,
    height
  });

  chart.source(data, {
    // basisPrice: {
    //   nice: false,
    //   min: -1,
    //   max: 1,
    //   tickCount: 4
    // },
    price: {
      nice: false,
      tickCount: 4
    },
    date: {
      tickCount: 4
    }
  });
  chart.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    onShow: function onShow(ev) {
      const items = ev.items;
      return (ev.items = ev.items.splice(0,2));
    },
  });

  chart.axis('date', {
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

  chart.area().position('date*price').color('type', type => {
    if (type !== '基差') {
      return '#ffffff';
    } else {
      return '#5D7092'
    }
  }).style({
    fillOpacity: 1
  });

  chart.line().position('date*price').color('type', type => {
    if (type === '现货') {
      return '#5AD8A6';
    } else if (type === '期货') {
      return '#5B8FF9';
    } else if (type === '基差') {
      return '#5D7092';
    }
  }).size('type', type => {
    if (type === '期货' || type == '现货') {
      return 3;
    } else {
      return 0;
    }
  });
//   chart.area().position('date*price').color('#5D7092').style('type', {
//     fill: '#5D7092',
//     fillOpacity: function fillOpacity(val) {
//       if (val === '期货' || val === '现货') {
//     return 0;
//   } else {
//     return 1;
//   }
// },
//   });
  chart.legend(false)
  chart.render();
  return chart;
}


Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0) {
      this.setData({
        basicParameters: param,
        deliveryMonthIndex: param.deliveryMonthIndex || 0,
        basicAddressIndex: param.basicAddressIndex || 1
      }, function () {
        this.requestBasicChartData()
      })
    } else {
      this.requestBasicChartData()
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
    priceLegend: [{
      name: '基差',
      fill: '#5D7092'
    }, {
      name: '现货',
      fill: '#5AD8A6'
    }, {
      name: '期货',
      fill: '#5B8FF9'
    }],
    basicOpts: {
      onInit: initBasicChart
    },
    basicParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      deliveryMonth: "index_price",
      address: "shi_men",
      addressName: '石门'
    },
    addressArray: SPOT_ADDRESS,
    deliveryMonthArray: DELIVERY_MONTH,
    basicAddressIndex: 1,
    deliveryMonthIndex: 0,
    basicRequesting: true,
    basicNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
  },

    requestBasicChartData: function () {
      this.data.basicRequesting = true;
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      futuredataBasis(self.data.basicParameters).then(function (result) {
        let data = result.futureList.concat(result.spotList).concat(result.basisList);
        self.setData({
          basicNoData: (!data || data.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
        })
        var chartUpdateName;
        var chartUpdate = function () {
          if (chart != null) {
            chart.changeData(data)
            clearInterval(chartUpdateName)
          }
          self.data.basicRequesting = false;
          wx.hideLoading();
        }
        chartUpdateName = setInterval(chartUpdate, 100);
      }).catch(function () {
        self.setData({
          basicNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.basicRequesting = false;
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
      if (e.currentTarget.dataset.pickname === 'basicAddress') {
        const addressDic = this.data.addressArray[valueIndex];
        this.setData({
          basicAddressIndex: valueIndex,
          basicParameters: {
            ...this.data.basicParameters,
            address: addressDic.value,
            addressName: addressDic.name
          }
        })
        this.requestBasicChartData();
      } else if (e.currentTarget.dataset.pickname === 'deliverMonth') {
        const addressDic = this.data.deliveryMonthArray[valueIndex];
        this.setData({
          deliveryMonthIndex: valueIndex,
          basicParameters: {
            ...this.data.basicParameters,
            deliveryMonth: addressDic.value
          }
        })
        this.requestBasicChartData()
      }
    },
    handDateChange(event) {
      const datePickName = event.detail.currentTarget.dataset.pickname
      if (event.currentTarget.id === 'group-date-basic') {
        if (datePickName === 'startDate') {
          this.setData({
            basicParameters: { ...this.data.basicParameters,
              startDate: event.detail.detail.value
            }
          })
        } else if (datePickName === 'endDate') {
          this.setData({
            basicParameters: { ...this.data.basicParameters,
              endDate: event.detail.detail.value
            }
          })
        }
        this.requestBasicChartData()
      }
  },
  preLineClicked() {
    wx.navigateBack()
  },
  nextLineClicked() {
    wx.navigateTo({
      url: "/pages/landscape_line/delay/delay"
    })
  },
  closeLineClicked() {
    wx.navigateBack({
      delta: 100
    })
  }
})

import {
  futuredataBasis,
  futuredataCorrelation
} from '../../../../api/api.js'
import {
  formatDate, parseParams
} from '../../../../utils/util.js'
import { SPOT_ADDRESS, DELIVERY_MONTH, DELAY_DAYS_ARRAY, NO_DATA_TYPE } from '../data/instrumentData.js'
let chart = null;
let chart2 = null;

function initBasicChart(canvas, width, height, F2) {
  const data = [];
  chart = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
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
      return (ev.items = ev.items.splice(0,3));
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
      return 'rgba(255,255,255,0)';
    } else {
      return 'l(90) 0:#5D7092 1:#133965';
    }

  }).style({
    fillOpacity: 0.6
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

function initDelayChart(canvas, width, height, F2) {
  const data2 = []
  chart2 = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
  });
  chart2.source(data2, {
    spotPrice:{
      min: 0,
      max: 6,
      nice: true,
      alias:"现货"
    },
    futurePrice:{
      min: 0,
      nice: true,
      max: 6,
      alias: "期货"
    },
    basisPrice: {
      min: -1,
      max: 1,
      nice: true,
      alias:"相关系数"

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


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached: function() {
    const self = this;
    this.requestBasicChartData()
    this.requestDelayChartData()
  },
  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    detached: function() {
      chart = null;
      chart2 = null;
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
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
    delayLegend: [{
      name: '相关系数',
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
    delayOpts: {
      onInit: initDelayChart
    },
    basicParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      deliveryMonth: "index_price",
      address: "shi_men",
      addressName: '石门'
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
    basicAddressIndex: 1,
    deliveryMonthIndex: 0,
    delayAddressIndex: 1,
    delayDaysIndex: 5,
    basicRequesting: true,
    delayRequesting: true,
    basicNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
    delayNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA
  },

  /**
   * 组件的方法列表
   */
  methods: {
    requestBasicChartData: function () {
      this.data.basicRequesting = true;
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      futuredataBasis(self.data.basicParameters).then(function (result) {
        // let basicList = []
        // for (let i = 0, count = result.basisList.length; i < count; i++) {
        //   const item = result.basisList[i]
        //   basicList.push({ date: item.data, basicType: item.type, price: item.price })
        // }
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
          self.hideLoadingView();
        }
        chartUpdateName = setInterval(chartUpdate, 100);
      }).catch(function () {
        self.setData({
          basicNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.basicRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    requestDelayChartData: function () {
      this.data.delayRequesting = true;
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      futuredataCorrelation(self.data.delayParameters).then(function (result) {
        let data2 = result.basisList;
        self.setData({
          delayNoData: (!data2 || data2.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
        })
        wx.setStorage({key: 'minMaxValue', data:result.minAndMaxPrice})
        // let data2 = [{date: "2019-09-19", price: 0.22, price2: 5.2, price3:3.5},
        //   {date: "2019-09-20", price: 0.17, price2: 4.5, price3:3.7},
        //   {date: "2019-09-21", price: 0.19, price2: 3.2, price3:3.8},
        //   {date: "2019-09-22", price: 0.15, price2: 3.4, price3:3.9},
        //   {date: "2019-09-23", price: 0.13, price2: 3.6, price3:3.8},
        //   {date: "2019-09-24", price: 0.14, price2: 3.8, price3:4.1},
        //   {date: "2019-09-25", price: 0.13, price2: 4.2, price3:4.5},
        //   {date: "2019-09-26", price: 0.12, price2: 4.5, price3:4.6},
        //   {date: "2019-09-27", price: 0.11, price2: 4.8, price3:4.9},
        //   {date: "2019-09-28", price: 0.14, price2: 4.9, price3:5.5},
        //   {date: "2019-09-29", price: 0.13, price2: 5.0, price3:5.0}]
        var chart2UpdateName;
        var chart2Update = function () {
          if (chart2 != null) {
            chart2.changeData(data2)
            chart2.repaint()
            clearInterval(chart2UpdateName)
          }
          self.data.delayRequesting = false;
          self.hideLoadingView();
        }
        chart2UpdateName = setInterval(chart2Update, 100);
      }).catch(function () {
        self.setData({
          delayNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.delayRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    hideLoadingView: function () {
      if (!this.data.basicRequesting && !this.data.delayRequesting) {
        wx.hideLoading()
      }
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
      } else if (e.currentTarget.dataset.pickname === 'delayAddress') {
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
      } else if (event.currentTarget.id === 'group-date-delay') {
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
    changeDirection(event) {
      const jumpUrl = event.currentTarget.dataset.landscape
      const url = `/pages/landscape_line/${jumpUrl}/${jumpUrl}`
      let parameters = {}
      if (jumpUrl === 'basic') {
        parameters = this.data.basicParameters
        parameters.basicAddressIndex = this.data.basicAddressIndex
        parameters.deliveryMonthIndex = this.data.deliveryMonthIndex
      } else {
        parameters = this.data.delayParameters
        parameters.delayAddressIndex = this.data.delayAddressIndex
        parameters.delayDaysIndex = this.data.delayDaysIndex
      }
      let totalUrl = parseParams(url, parameters)
      wx.navigateTo({
        url: totalUrl
      })
    }
  }
})

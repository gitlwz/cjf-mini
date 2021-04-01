
import {
  futurespotchg,
  priceconstancy,
  futurespotprice
} from '../../../../api/api.js'
import { SPOT_ADDRESS, DELIVERY_MONTH, NO_DATA_TYPE } from '../data/instrumentData.js'
import {
  formatDate, parseParams
} from '../../../../utils/util.js'

let chart = null;
let chart2 = null;

const monthLegency = ['#E8684A', '#F6BD16', '#5D7092', '#5B8FF9', '#5AD8A6']

function initStableChart(canvas, width, height, F2) {
  const data = [];
  chart = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
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
    showCrosshairs: true,
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].value = (items[0].value/10).toFixed(2)
    }
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

function initSeasonChart(canvas, width, height, F2) {
  const data2 = [];
  chart2 = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
  });

  chart2.source(data2, {
    day: {
      type: 'cat',
      tickCount: 12,
      formatter: function formatter(ivalue) {
        return ivalue.substring(0,2);
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

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached: function () {
    const self = this;
    this.requestStableChartData();
    this.requestSeasonChartData();
  },
 lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    detached: function () {
      chart = null;
      chart2 = null;
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    priceLegend: [{ name: '石门', fill: '#5B8FF9' }, { name: '价格稳定性', fill: '#5AD8A6' }],
    monthLegend: monthLegency,
    monthDicLegend: {},
    tableHeader:['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'],
    stableOpts: {
      onInit: initStableChart
    },
    seasonOpts: {
      onInit: initSeasonChart
    },
    stableParameters: { startDate: formatDate(-90), endDate: formatDate(0), address: "shi_men", addressName: '石门' },
    seasonParameters: { type: '0', address: 'shi_men', addressName: '石门' },
    spotTableData: [],
    addressArray: SPOT_ADDRESS,
    deliveryMonth: DELIVERY_MONTH,
    chartTypeArray: [{ value: '0', name: "现货" }, { value: '1', name: "期货" }],
    stableAddressIndex: 1,
    seasonAddressIndex: 1,
    deliveryMonthIndex: 1,
    chartTypeIndex: 0,
    stableRequesting: true,
    seasonRequesting: true,
    stableNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
    seasonNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA
  },

  /**
   * 组件的方法列表
   */
  methods: {
    requestStableChartData: function () {
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      this.data.stableRequesting = true;
      priceconstancy(self.data.stableParameters).then(function (result) {
        let data = result.stablePriceList.concat(result.addressPriceList);
        self.setData({
          stableNoData: (!data || data.length === 0)  ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
        })
        var chartUpdateName;
        var chartUpdate = function () {
          if (chart != null) {
            chart.changeData(data)
            clearInterval(chartUpdateName)
          }
          self.data.stableRequesting = false;
          self.hideLoadingView();
        }
        chartUpdateName = setInterval(chartUpdate, 100);
      }).catch(function () {
        self.setData({
          stableNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.stableRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
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
          seasonNoData: (!data2 || data2.length === 0)  ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
        })
        var chart2UpdateName;
        var chart2Update = function () {
          if (chart2 != null) {
            chart2.changeData(data2)
            clearInterval(chart2UpdateName)
          }
        }
        chart2UpdateName = setInterval(chart2Update, 100);
        self.requestTableData();
      }).catch(function () {
        self.setData({
          seasonNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.requestTableData();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    requestTableData: function() {
      const self = this;
      futurespotchg(this.data.seasonParameters).then(function (result) {
        self.data.seasonRequesting = false;
        self.setData({
          spotTableData: result,
        }, function () {
        })

        let firstYear = 2015
        if (result && result.length > 0) {
          firstYear = parseInt(result[0].year)
        }
        let colorDic = {}
        for(let i = 0, count = result.length; i < count; i++) {
          colorDic[(firstYear + i).toString()] = monthLegency[i]
        }
        self.setData({
          monthDicLegend: colorDic,
        }, function () {
        })


        self.hideLoadingView();
      }).catch(function () {
        self.data.seasonRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    hideLoadingView: function () {
      if (!this.data.seasonRequesting && !this.data.stableRequesting) {
        wx.hideLoading()
      }
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
      } else if (e.currentTarget.dataset.pickname === 'seasonAddress') {
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
    changeDirection(event) {
      const jumpUrl = event.currentTarget.dataset.landscape
      const url = `/pages/landscape_line/${jumpUrl}/${jumpUrl}`
      let parameters = {}
      if (jumpUrl === 'stable') {
        parameters = this.data.stableParameters
        parameters.stableAddressIndex = this.data.stableAddressIndex
      } else {
        parameters = this.data.seasonParameters
        parameters.chartTypeIndex = this.data.chartTypeIndex
        parameters.deliveryMonthIndex = this.data.deliveryMonthIndex
        parameters.seasonAddressIndex = this.data.seasonAddressIndex
      }
      let totalUrl = parseParams(url, parameters)
      wx.navigateTo({
        url: totalUrl
      })
    }
  }
})

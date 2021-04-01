import { clientcontractChart } from '../../api/api.js'
import { SPOT_ADDRESS, NO_DATA_TYPE } from '../instruments_list/smart_egg/data/instrumentData.js'
import {
  formatDate, parseParams
} from '../../utils/util.js'
let chart = null;

function initTestChart (canvas, width, height, F2) {
  const data = []
  chart = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
  });

  chart.source(data, {
    year: {
      range: [0, 1],
      ticks: [1997, 1999, 2001, 2003, 2005, 2007, 2009, 2011, 2013, 2015, 2017]
    },
    value: {
      tickCount: 10,
      formatter(val) {
        return val.toFixed(1) + '%';
      }
    }
  });

  chart.tooltip({
    custom: true, // 自定义 tooltip 内容框
    showXTip: true,
    onChange(obj) {
      const legend = chart.get('legendController').legends.top[0];
      const tooltipItems = obj.items;
      const legendItems = legend.items;
      const map = {};
      legendItems.map(item => {
        map[item.name] = Object.assign({}, item);
      });
      tooltipItems.map(item => {
        const { name, value } = item;
        if (map[name]) {
          map[name].value = value;
        }
      });
      legend.setItems(Object.values(map));
    },
    onHide() {
      const legend = chart.get('legendController').legends.top[0];
      legend.setItems(chart.getLegendItems().country);
    }
  });

  chart.guide().rect({
    start: [2011, 'max'],
    end: ['max', 'min'],
    style: {
      fill: '#CCD6EC',
      opacity: 0.3
    }
  });
  chart.guide().text({
    position: [2014, 'max'],
    content: 'Scott administratio\n(2011 to present)',
    style: {
      fontSize: 10,
      textBaseline: 'top'
    }
  });
  chart.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    layout: 'vertical'
  });




  chart.line().position('year*value').color('type', val => {
    if (val === 'United States') {
      return '#ccc';
    }
  });
  chart.render();
  return chart;
}

function initContractChart(canvas, width, height, F2) {
  const data = [];

  chart = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
  });

  chart.source(data, {
    date: {
      range: [0, 1],
      tickCount: 4,
    },
    price: {
      tickCount: 10,
      min:0,
      formatter: function formatter(val) {
        return val.toFixed(2);
      }
    }
  });
  chart.legend('type', {
    position: 'bottom',
    align:'center'
  });
 chart.tooltip({
    offsetY: 50, // y 方向的偏移
    showTitle: true, // 展示  tooltip 的标题
    layout: 'vertical'
  });
  chart.axis('date', {
    label: function label(text, index, total) {
      const textCfg = {};
      if (index === total - 1) {
        textCfg.textAlign = 'right';
      }
      return textCfg;
    }
  });

  chart.line().position('date*price').color('type', val => {
    if (val.indexOf('合同价格') !== -1) {
      return '#5AD8A6';
    } else {
      return '#5B8FF9';
    }
  });
  chart.render();
  return chart;
}

Page({
  data: {
    navdata: {
      title: '历史合同价格',
      navbar: '2'
    },
    navH: getApp().globalData.navHeight - 2,
    opts: {
      onInit: initContractChart // 延迟加载组件
    },
    contractRequesting:false,
    contractChartParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: 'shi_men',
      addressName: '石门'
    },
    addressArray: SPOT_ADDRESS,
    noData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
    addressIndex: 1
  },
  onLoad: function (options) {
    // Do some initialize when page load.
    this.requestContractChartData();
  },
  onUnload: function () {
    // Do something when page close.
    chart.clear()
    chart = null;
  },
  requestContractChartData: function () {
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    this.data.contractRequesting = true;
    clientcontractChart(self.data.contractChartParameters).then(function (result) {
      let data = result.basisList.concat(result.contractList);
      const noDataStatus = (!data || data.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA

      self.setData({
        noData: noDataStatus
      })
      var chartUpdateName;
      var chartUpdate = function () {
        if (chart != null) {
          chart.changeData(data)
          clearInterval(chartUpdateName)
        }
        self.data.stableRequesting = false;
        wx.hideLoading()
      }
      chartUpdateName = setInterval(chartUpdate, 100);
    }).catch(function () {
      self.setData({
        noData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      // const data = [{ "year": 1997, "type": "United States", "value": 4.9 }, { "year": 1997, "type": "Florida", "value": 4.8 }, { "year": 1998, "type": "United States", "value": 4.5 }, { "year": 1998, "type": "Florida", "value": 4.3 }, { "year": 1999, "type": "United States", "value": 4.2 }, { "year": 1999, "type": "Florida", "value": 3.9 }, { "year": 2000, "type": "United States", "value": 4 }, { "year": 2000, "type": "Florida", "value": 3.7 }, { "year": 2001, "type": "United States", "value": 4.7 }, { "year": 2001, "type": "Florida", "value": 4.7 }, { "year": 2002, "type": "United States", "value": 5.8 }, { "year": 2002, "type": "Florida", "value": 5.6 }, { "year": 2003, "type": "United States", "value": 6 }, { "year": 2003, "type": "Florida", "value": 5.2 }, { "year": 2004, "type": "United States", "value": 5.5 }, { "year": 2004, "type": "Florida", "value": 4.6 }, { "year": 2005, "type": "United States", "value": 5.1 }, { "year": 2005, "type": "Florida", "value": 3.7 }, { "year": 2006, "type": "United States", "value": 4.6 }, { "year": 2006, "type": "Florida", "value": 3.2 }, { "year": 2007, "type": "United States", "value": 4.6 }, { "year": 2007, "type": "Florida", "value": 4 }, { "year": 2008, "type": "United States", "value": 5.8 }, { "year": 2008, "type": "Florida", "value": 6.3 }, { "year": 2009, "type": "United States", "value": 9.3 }, { "year": 2009, "type": "Florida", "value": 10.4 }, { "year": 2010, "type": "United States", "value": 9.6 }, { "year": 2010, "type": "Florida", "value": 11.1 }, { "year": 2011, "type": "United States", "value": 8.9 }, { "year": 2011, "type": "Florida", "value": 10 }, { "year": 2012, "type": "United States", "value": 8.1 }, { "year": 2012, "type": "Florida", "value": 8.5 }, { "year": 2013, "type": "United States", "value": 7.4 }, { "year": 2013, "type": "Florida", "value": 7.2 }, { "year": 2014, "type": "United States", "value": 6.2 }, { "year": 2014, "type": "Florida", "value": 6.3 }, { "year": 2015, "type": "United States", "value": 5.3 }, { "year": 2015, "type": "Florida", "value": 5.4 }, { "year": 2016, "type": "United States", "value": 4.9 }, { "year": 2016, "type": "Florida", "value": 4.9 }, { "year": 2017, "type": "United States", "value": 4.4 }, { "year": 2017, "type": "Florida", "value": 4.3 }];
      // var chartUpdateName;
      // var chartUpdate = function () {
      //   if (chart != null) {
      //     chart.changeData(data)
      //     clearInterval(chartUpdateName)
      //     self.data.stableRequesting = false;
      //     wx.hideLoading()
      //   }
      // }
      // chartUpdateName = setInterval(chartUpdate, 100);
      self.data.contractRequesting = false;
      wx.hideLoading()
      wx.showToast({
        title: '接口异常',
        icon: 'none',
      })
    })
  },
  // onResize: function (res) {
  //   wx.showToast({
  //     title: '屏幕旋转',
  //   })
  //   res.size.windowWidth // 新的显示区域宽度
  //   res.size.windowHeight // 新的显示区域高度
  // },
  onReady() {
  },
  bindPickerChange: function (e) {
    const valueIndex = Number(e.detail.value)
    const addressDic = this.data.addressArray[valueIndex];
      this.setData({
        addressIndex: valueIndex,
        contractChartParameters: {
          ...this.data.contractChartParameters,
          address: addressDic.value,
          addressName: addressDic.name
        }
      })
      this.requestContractChartData();
  },
  handDateChange(event) {
    const datePickName = event.detail.currentTarget.dataset.pickname
    if (event.currentTarget.id === 'group-date-contract') {
      if (datePickName === 'startDate') {
        this.setData({
          contractChartParameters: {
            ...this.data.contractChartParameters,
            startDate: event.detail.detail.value
          }
        })
      } else if (datePickName === 'endDate') {
        this.setData({
          contractChartParameters: {
            ...this.data.contractChartParameters,
            endDate: event.detail.detail.value
          }
        })
      }
      this.requestContractChartData()
    }
  },
  changeDirection(event) {
    const parameters = this.data.contractChartParameters
    parameters.addressIndex = this.data.addressIndex
    let totalUrl = parseParams(`/pages/landscape_line/contract/contract`, parameters)

    wx.navigateTo({
      url: totalUrl
    })
  }

});

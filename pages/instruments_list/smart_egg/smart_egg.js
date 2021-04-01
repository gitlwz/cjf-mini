import {
  feedindexdataChart,
  congestindexdataChart
} from '../../../api/api.js'
import {
  formatDate, parseParams
} from '../../../utils/util.js'
import { FEED_ADDRESS, JAM_ADDRESS, NO_DATA_TYPE } from 'data/instrumentData.js'
let chart = null;
let chart2 = null;
const appGlobalData = getApp().globalData

function initJamChart(canvas, width, height, F2) {
  const data2 = [];

  chart2 = new F2.Chart({
    el: canvas,
    width: width || 360 ,
    animate: false,
    height: height || 213
  });

  chart2.source(data2, {
    congestIndex: {
      tickCount: 5,
      min:90,
      max:110,
    },
    congestDate: {
      type: 'timeCat',
      tickCount: 4
    }

  });

  chart2.axis('congestDate', {
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
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = `拥堵指数`;
      return (ev.items = ev.items.splice(1));
    },
  });

  chart2.area()
    .position('congestDate*congestIndex')
    .color('l(90) 0:#EA5B28 0.5:#EA5B28 1:#03C389').style({
    fillOpacity: 0.4
  });
  chart2.line()
    .position('congestDate*congestIndex').color('#D0A16C')
  chart2.legend(false)
  chart2.render();
  return chart2;
}

function initFeedChart(canvas, width, height, F2) {
  const data = [];
  const Util = F2.Util;
  chart = new F2.Chart({
    el: canvas,
    width: width || 360,
    animate: false,
    height: height || 213
  });

  chart.source(data, {
    feedDate: {
      tickCount: 4,
    },
    data: Util.mix({
      scale: function(value) {
        if (value === null || value === undefined) {
          return NaN;
        }
        var max = 33;
        var min = 0;
        var percent = value/ (max - min);
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        return 1 - (rangeMin + percent * (rangeMax - rangeMin));
      }
    }, {tickCount: 5}),
  });

  chart.axis('feedDate', {
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
    onShow: function onShow(ev) {
      const items = ev.items;
      items[0].name = `饲情指数范围`;
      const value = items[0].origin.data;
      items[0].value = value[0] + ' 至 ' + value[1];
      items[1].name = '高值';
      return (ev.items = ev.items.splice(2));
    }
  });

  chart.interval().position('feedDate*data').color('#06A845').animate({
    appear: {
      animation: 'shapesScaleInY'
    }
  }).size('type', type => {
    if (type !== 'space') {
      return 0;
    }
    return 1;
  });

  chart.area().position('feedDate*data').color('type', type => {
    if (type !== 'default') {
      return 'rgba(255,255,255,0)';
    }
    return 'l(90) 0:#F5A623 1:#F8E71C';
  }).style({
    fillOpacity: 0.5
  });

  chart.point().position('feedDate*data').color('#06A845').size('type', type => {
    if (type !== 'max') {
      return 0;
    }
    return 3;
  });
  chart.legend(false)
  chart.render();
  return chart;
}


Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },
  attached: function() {
    const self = this;
    this.initFeedChartData();
    this.initJamChartData()
  },
  lifetimes: {
    detached: function() {
      chart = null;
      chart2 = null;
      // 在组件实例被从页面节点树移除时执行
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    isPortrait: true,
    jamAddressIndex: 1,
    feedAddressIndex: 0,
    jamOpts: {
      onInit: initJamChart // 延迟加载组件
    },
    feedOpts: {
      onInit: initFeedChart // 延迟加载组件
    },
    jamParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: 'shi_men',
      addressName: '石门'
    },
    jamAddressArray: JAM_ADDRESS,
    feedAddressArray: FEED_ADDRESS,
    feedParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: "dalian",
      addressName: '大连'
    },
    jamRequesting: true,
    feedRequesting: true,
    todayJamValue:'--',
    todayJamChg: '--',
    todayJamChgAbs: '--',
    todayFeedValue: '--',
    jamNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA,
    feedNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA

  },

  /**
   * 组件的方法列表
   */
  methods: {
    initJamChartData: function() {
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      this.data.jamRequesting = true;
      congestindexdataChart(self.data.jamParameters).then(function(result) {
        self.data.jamRequesting = false;
        let data2 = result.congestIndexDataModelList;
        let todayData = result.newIndexDataModelList;
        if (todayData && todayData.length === 2) {
          const todayValue = todayData[0].congestIndex
          const yesterdayValue = todayData[1].congestIndex
          self.setData({
            todayJamValue: todayValue,
            todayJamChgAbs: Math.abs((todayValue - yesterdayValue) * 100 / yesterdayValue).toFixed(2),
            todayJamChg: ((todayValue - yesterdayValue) * 100 / yesterdayValue).toFixed(2)
          })
        } else{
          self.setData({
            todayJamValue: '--',
            todayJamChgAbs: '--',
            todayJamChg: '--'
          })
        }
        const jamDataStatus = (!data2 || data2.length === 0)  ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
        self.setData({
          jamNoData: jamDataStatus
        })
        var chart2UpdateName;
        var chart2Update = function() {
          if (chart2 != null) {
            chart2.changeData(data2)
            clearInterval(chart2UpdateName)
          }
          self.hideLoadingView();
        }
        chart2UpdateName = setInterval(chart2Update, 100);
      }).catch(function() {
        self.setData({
          jamNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.jamRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    initFeedChartData: function() {
      const self = this;
      wx.showLoading({
        title: '加载中',
      })
      this.data.feedRequesting = true;
      feedindexdataChart(self.data.feedParameters).then(function(result) {
        let data = result.feedDataModelList;
        let lastData = result.newDataModelList;

        if (lastData && lastData.length === 1) {
          self.setData({
            todayFeedValue: `${lastData[0].low} - ${lastData[0].high}`
          })
        } else {
          self.setData({
            todayFeedValue: '--'
          })
        }

        const feedDataStatus = (!data || data.length === 0)  ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA
    

        self.setData({
          feedNoData: feedDataStatus
        })
        var chartUpdateName;
        var chartUpdate = function() {
          if (chart != null) {
            chart.changeData(data)
            clearInterval(chartUpdateName)
          }
          self.data.feedRequesting = false;
          self.hideLoadingView();
        }
        chartUpdateName = setInterval(chartUpdate, 100);
      }).catch(function() {
        self.setData({
          feedNoData: NO_DATA_TYPE.ERROR_NO_DATA
        })
        self.data.feedRequesting = false;
        self.hideLoadingView();
        console.error('接口异常')
        wx.showToast({
          title: '接口异常',
          icon: 'none',
        })
      })
    },
    hideLoadingView: function() {
      if(!this.data.feedRequesting && !this.data.jamRequesting) {
        wx.hideLoading()
      }
    },
    bindPickerChange: function(e) {
      const valueIndex = Number(e.detail.value)
      if (e.currentTarget.dataset.pickname === 'feedAddress') {
        const addressDic = this.data.feedAddressArray[valueIndex];
        this.setData({
          feedAddressIndex: valueIndex,
          feedParameters: { ...this.data.feedParameters,
            address: addressDic.value,
            addressName: addressDic.name
          }
        })
        this.initFeedChartData();
      } else if (e.currentTarget.dataset.pickname === 'jamAddress') {
        const addressDic = this.data.jamAddressArray[valueIndex];
        this.setData({
          jamAddressIndex: valueIndex,
          jamParameters: { ...this.data.jamParameters,
            address: addressDic.value,
            addressName: addressDic.name
          }
        })
        this.initJamChartData()
      }
    },
    handDateChange(event) {
      const datePickName = event.detail.currentTarget.dataset.pickname
      if (event.currentTarget.id === 'group-date-jam') {
        if (datePickName === 'startDate') {
          this.setData({
            jamParameters: { ...this.data.jamParameters,
              startDate: event.detail.detail.value
            }
          })
        } else if (datePickName === 'endDate') {
          this.setData({
            jamParameters: { ...this.data.jamParameters,
              endDate: event.detail.detail.value
            }
          })
        }
        this.initJamChartData()
      } else if (event.currentTarget.id === 'group-date-feed') {
        if (datePickName === 'startDate') {
          this.setData({
            feedParameters: { ...this.data.feedParameters,
              startDate: event.detail.detail.value
            }
          })
        } else if (datePickName === 'endDate') {
          this.setData({
            feedParameters: { ...this.data.feedParameters,
              endDate: event.detail.detail.value
            }
          })
        }
        this.initFeedChartData();
      }
    },
    changeDirection(event) {
      const jumpUrl = event.currentTarget.dataset.landscape
      const url = `/pages/landscape_line/${jumpUrl}/${jumpUrl}`
      let parameters = {}
      if (jumpUrl === 'jam') {
        parameters = this.data.jamParameters
        parameters.jamAddressIndex = this.data.jamAddressIndex
      } else {
        parameters = this.data.feedParameters
        parameters.feedAddressIndex = this.data.feedAddressIndex
      }
      let totalUrl = parseParams(url, parameters)
      console.log(totalUrl)
      wx.navigateTo({
        url: totalUrl, event: {
          acceptDataFromOpenedPage: function(data) {
            console.log(data)
          },
          someEvent: function(data) {
            console.log(data)
          }
        },
      success (res) {
        res.eventChannel.emit('acceptDataFromOpenerPage', { data: '1111111' })
      }
      })
    }
  }
})

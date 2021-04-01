import {
  feedindexdataChart,
  congestindexdataChart
} from '../../../api/api.js'
import {
  formatDate
} from '../../../utils/util.js'
import {
  FEED_ADDRESS,
  NO_DATA_TYPE
} from '../../instruments_list/smart_egg/data/instrumentData.js'
let chart = null;
const appGlobalData = getApp().globalData

function initFeedChart(canvas, width, height, F2) {
  const data = [];
  const Util = F2.Util;
  chart = new F2.Chart({
    el: canvas,
    width,
    animate: false,
    height
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
        var percent = value / (max - min);
        var rangeMin = this.rangeMin();
        var rangeMax = this.rangeMax();
        return 1 - (rangeMin + percent * (rangeMax - rangeMin));
      }
    }, {
      tickCount: 5
    }),
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


Page({
  onLoad: function (param) {
    if (Object.keys(param).length !== 0) {
      this.setData({
        feedParameters: param,
        feedAddressIndex: param.feedAddressIndex || 0
      }, function () {
        this.initFeedChartData();
      })
    } else {
      this.initFeedChartData();
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
    isPortrait: true,
    feedOpts: {
      onInit: initFeedChart // 延迟加载组件
    },
    feedAddressArray: FEED_ADDRESS,
    feedAddressIndex: 0,
    feedParameters: {
      startDate: formatDate(-90),
      endDate: formatDate(0),
      address: "dalian",
      addressName: '大连'
    },
    feedRequesting: true,
    feedNoData: NO_DATA_TYPE.SUCCESS_HAVE_DATA

  },

  initFeedChartData: function() {
    const self = this;
    wx.showLoading({
      title: '加载中',
    })
    this.data.feedRequesting = true;
    feedindexdataChart(self.data.feedParameters).then(function(result) {
      let data = result.feedDataModelList;
      const feedDataStatus = (!data || data.length === 0) ? NO_DATA_TYPE.SUCCESS_NO_DATA : NO_DATA_TYPE.SUCCESS_HAVE_DATA

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
        wx.hideLoading()
      }
      chartUpdateName = setInterval(chartUpdate, 100);
    }).catch(function() {
      self.setData({
        feedNoData: NO_DATA_TYPE.ERROR_NO_DATA
      })
      self.data.feedRequesting = false;
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
    }
  },
  handDateChange(event) {
    const datePickName = event.detail.currentTarget.dataset.pickname
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
  },
  preLineClicked() {
    wx.navigateBack()
  },
  nextLineClicked() {
    wx.navigateTo({
      url: "/pages/landscape_line/stable/stable"
    })
  },
  closeLineClicked() {
    wx.navigateBack({
      delta: 100
    })
  }
})

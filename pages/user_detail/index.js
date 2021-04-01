// pages/user_detail/index.js
import { enterpriseoperation, enterprisebrand, enterpriseculturepropaganda, enterprisesegment } from '../../api/api.js'
import { HTTP_DOMIN } from '../../utils/network/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navdata: {
      title: '首创京都',
      navbar: '2'
    },
    navH: '',
    articleInfo: '',
    idLoading: true,
    showLimit: '',
    list:[
      {
        url:`${HTTP_DOMIN}/root/1/12376402b76edc2d8bc05494d4d10cb.png`,
        one: '01 专业机构',
        two: '提升使用体验',
        three: '多账号   多屏幕'
      },
      {
        url: `${HTTP_DOMIN}/root/1/e0e57b11e585bda04e513ed0b7ed92d.png`,
        one: '02 日内交易',
        two: '拓展交易范围',
        three: '无限下单  网格策略'
      },
      {
        url: `${HTTP_DOMIN}/root/1/261a2956fc2359bae1ebe3abf44fc69.png`,
        one: '03 套利交易',
        two: '优化执行精确率',
        three: '套利猎人  组合K线'
      },
      {
        url: `${HTTP_DOMIN}/root/1/cc5e6e3246fc87f19fbdd099ffcbcfb.png`,
        one: '04 套保交易',
        two: '提高执行效率',
        three: 'Smart Order  移仓护卫'
      },
      {
        url: `${HTTP_DOMIN}/root/1/6582691033c90f33bb2511facda4bb1.png`,
        one: '05 期权交易',
        two: '交易管理可视化',
        three: '无限下单   期权板块'
      }
    ],
    backImg: `${HTTP_DOMIN}/root/1/wxyback.png`,
    bottomImg: `${HTTP_DOMIN}/root/1/wxybottom.png`
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this;
    this.setData({
      navH: getApp().globalData.navHeight
    })

    that.setData({
      showLimit:options.index
    })
    console.log(options.index)
    switch(options.index){
      case '0':
        that.setData({
          navdata: {
            title: '首创京都&无限易',
            navbar: '2'
          }
        })
        break;
      case '1':
        that.setData({
          navdata: {
            title: '首创京都&上海农创',
            navbar: '2'
          }
        })
        enterprisesegment().then(function (result) {
          that.setData({
            'articleInfo.publishImage': result['publishImage'],
            'articleInfo.publishContent': result['publishContent'],
            'articleInfo.publishVideo': result['publishVideo'],
            isLoading: false
          })
        }).catch(function () {
        })
        break;
      case '3':
        that.setData({
          navdata: {
            title: '首创京都&北京蛋协',
            navbar: '2'
          }
        })
        enterprisebrand().then(function (result) {
          that.setData({
            'articleInfo.publishImage': result['publishImage'],
            'articleInfo.publishContent': result['publishContent'],
            'articleInfo.publishVideo': result['publishVideo'],
            isLoading: false
          })
        }).catch(function (e) {
        })
        break;
      case '4':
        that.setData({
          navdata: {
            title: '首创京都&北农所',
            navbar: '2'
          }
        })
        enterpriseculturepropaganda().then(function (result) {
          that.setData({
            'articleInfo.publishImage': result['publishImage'],
            'articleInfo.publishContent': result['publishContent'],
            'articleInfo.publishVideo': result['publishVideo'],
            isLoading: false
          })
        }).catch(function (e) {
        })
        break;
      case '2':
        that.setData({
          navdata: {
            title: '首创京都&首创证券',
            navbar: '2'
          }
        })
        enterpriseoperation().then(function (result) {
          that.setData({
            'articleInfo.publishImage': result['publishImage'],
            'articleInfo.publishContent': result['publishContent'],
            'articleInfo.publishVideo': result['publishVideo'],
            isLoading: false
          })
        }).catch(function (e) {
        })
        break;
      default: break;

    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

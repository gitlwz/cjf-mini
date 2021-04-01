// pages/simulatedDelivery/standerdDelivery/standerdDelivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item: [
      '提出期转现申请的客户必须是单位客户，会员代客户办理，期转现的期限为该合约上市之日起至最后交易日前倒数第四个交易日（含当日）。',
      '期转现批准日结算时，交易所将交易双方的期转现持仓按协议价格进行结算处理，产生的盈亏计入当日平仓盈亏。协议价格的最小变动单位应与交易所合约的规定相一致。',
      '期转现的持仓从当日持仓量中扣除，交易结果不计入当日结算价和成交量。每个交易日结束后，交易所将当日执行的期转现有关信息予以公布。'
    ],
    navH: '',
    contentH: '',
    navdata: {
      title: '注意事项',
      navbar: '2'
    },
    url: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.type)
    if(options.type==='standerd'){
      this.setData({
        item: [
          '会员或客户与厂库结清货款等费用后，委托厂库通过电子仓单系统提交标准仓单注册申请。',
          '厂库签发《标准仓单注册申请表》必须向交易提供现金保证金或交易所认可的银行履约担保函。',
          '交易所对厂库提交的现金或者银行履约担保函进行审核。',
          '审核通过后，由厂库向交易所提出标准仓单注册申请，并通知会员进行复核。',
          '会员通过电子仓单系统审核厂库提交的标准仓单注册申请，审核通过后，进一步提交至交易所。',
          '交易所对标准仓单注册申请进行审核。',
          '交易所审核通过后，生成标准仓单。',
          '最后交易所前一交易日（倒数第五个交易日）闭市前注册的仓单可进行每日交割，其后注册的仓单进入一次性交割'
        ],
        vehicle: false,
        url: '/pages/simulatedDelivery/simulatedDelivery?experience=standerd'
      })
    } else if (options.type === 'vehicle'){
      this.setData({
        vehicle: true
      })
    }else{
      this.setData({
        item:[
          '提出期转现申请的客户必须是单位客户，会员代客户办理，期转现的期限为该合约上市之日起至最后交易日前倒数第四个交易日（含当日）。',
          '期转现批准日结算时，交易所将交易双方的期转现持仓按协议价格进行结算处理，产生的盈亏计入当日平仓盈亏。协议价格的最小变动单位应与交易所合约的规定相一致。',
          '期转现的持仓从当日持仓量中扣除，交易结果不计入当日结算价和成交量。每个交易日结束后，交易所将当日执行的期转现有关信息予以公布。'
        ],
        vehicle: false,
        url: '/pages/simulatedDelivery/simulatedDelivery?experience=crash'
      })
    }
    this.setData({
      navH: getApp().globalData.navHeight,
      contentH: getApp().globalData.contentHeight
    });
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
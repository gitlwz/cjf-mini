// pages/simulatedDelivery/standerdDelivery/standerdDelivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: '',
    contentH: '',
    navdata: {
      title: '',
      navbar: '2'
    },
    item: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: getApp().globalData.navHeight,
      contentH: getApp().globalData.contentHeight
    });
    console.log(options.type)
    if (options.type ==='receiptCreate'){
      this.setData({
        item: {
          title: '厂库标准仓单的生成流程图说明',
          list: [
            {
              content: '客户联系厂库，签订协议',
              top: 240
            },
            {
              content: '厂库向交易所提供保函，并提交标准仓单注册申请',
              top: 440
            },
            {
              content: '期货公司会员确认注册申请',
              top: 660
            },
            {
              content: '交易所审批，仓单注册完成',
              top: 860
            }
          ],
          top: 100,
          back: true
        }
      })
    } else if (options.type === 'standerdBuy') {
      this.setData({
        item: {
          title: '厂库交割买方步骤',
          list: [
            {
              content: '准备货款',
              tip: '收款日',
              top: 240
            },
            {
              content: '提货',
              tip: '（交收日后第3个自然日）买方凭提货单到厂库提货',
              top: 490
            }
          ],
          left: '体验卖方流程',
          right: '结束体验',
          adressLeft: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=standerdSell',
          adressRight:'',
          top: 100,
          back: false
        }
      })
    } else if (options.type ==='standerdSell') {
      this.setData({
        item: {
          title: '厂库交割卖方步骤',
          list: [
            {
              content: '准备',
              tip: '联系厂库，签订协议',
              top: 170
            },
            {
              content: '提交交割意向',
              tip: '（配对日）卖方委托会员提交交割意向',
              top: 390
            },
            {
              content: '收取货款',
              tip: '交收日后第4个交易日',
              top: 610
            },
            {
              content: '交发票',
              tip: '（收到80%货款的7个交易日内）卖方将增值税发票交付买方',
              top: 830
            }
          ],
          left: '体验买方流程',
          right: '结束体验',
          adressLeft: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=standerdBuy',
          adressRight:'',
          top: 50,
          back: false
        }
      })
    } else if (options.type ==='oneSell') {
      this.setData({
        item: {
          title: '一次性交割卖方步骤',
          list: [
            {
              content: '交仓单日',
              tip: '卖方提交标准仓单',
              top: 170
            },
            {
              content: '配对日',
              tip: '买卖双方配对',
              top: 390
            },
            {
              content: '收取货款',
              tip: '交收日后第4个交易日',
              top: 610
            },
            {
              content: '交发票',
              tip: '（收到80%货款的7个交易日内）卖方将增值税发票交付买方',
              top: 830
            }
          ],
          left: '返回上一页',
          right: '体验买方流程',
          adressRight: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=oneBuy',
          long: true,
          top: 50,
          back: false
        }
      })
    } else if (options.type ==='oneBuy') {
      this.setData({
        item: {
          title: '一次性交割买方步骤',
          list: [
            {
              content: '买方申报交割意向',
              tip: '配对日',
              top: 240
            },
            {
              content: '交收日',
              tip: '（第三日）收盘前买方补货款',
              top: 490
            }
          ],
          left: '返回上一页',
          right: '体验卖方流程',
          adressRight: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=oneSell',
          top: 100,
          back: false
        }
      })
    } else if (options.type === 'vehicleBuy') {
      this.setData({
        item: {
          title: '车板交割买方步骤',
          list: [
            {
              content: '准备货款',
              tip: '（交收日闭市前）买卖双方无其他约定，买方补齐全额货款',
              top: 170
            },
            {
              content: '提货',
              tip: '（交收日后第3个自然日）当日13：30前，买方到车板交割场所提货',
              top: 420
            },
            {
              content: '支付货款',
              tip: '（交收日后第4个交易日闭市前）若货物不合格，会员向客户支付违约金，买方收取违约金货款',
              top: 670
            }
          ],
          left: '体验卖方流程',
          right: '结束体验',
          adressLeft: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=vehicleSell',
          adressRight: '',
          long: true,
          top: 50,
          back: false
        }
      })
    } else if (options.type === 'vehicleSell') {
      this.setData({
       item: {
          title: '车板交割卖方步骤',
          list: [
            {
              content: '准备',
              tip: '取得车板交割资格，了解交割流程和质量标准，向车板交割场所了解注意事项',
              top: 130
            },
            {
              content: '提交交割意向',
              tip: '（交割月第一个交易日至倒数第五个交易日闭市前）卖方委托会员提交交割意向',
              top: 340
            },
            {
              content: '提交交割意向',
              tip: '（配对日闭市前）卖方委托会员提交交割意向',
              top: 550
            },
            {
              content: '提货',
              tip: '（交收日后第3个自然日）当日13：30前，卖方将货物运至指定车板交割场所',
              top: 760
            },
            {
              content: '收取货款',
              tip: '（交收日后第4个交易日闭市前）卖方收取80%货款',
              top: 970
            },
            {
              content: '交发票',
              tip: '（收到80%货款的7个交易日内）卖方将增值税发票交付买方，收到余款，结束',
              top: 1180
            }
          ],
          left: '体验买方流程',
         right: '结束体验',
         adressLeft: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=vehicleBuy',
          adressRight: '',
          long: true,
          top: 20,
          back: false,
          listHeight: 1540
        }
      })
    } else if (options.type === 'crashBuy') {
      this.setData({
        item: {
          title: '期转现交割买方和卖方步骤',
          list: [
            {
              content: '买卖双方达成协议',
              top: 220
            },
            {
              content: '买卖双方向交易所提交期转现申请、现货买卖协议、相关的贷款证明、入库单存货单等货物持有证明 ',
              top: 400
            }, {
              content: '交易所批准后，买卖双方期货持仓平仓',
              top: 650
            },
            {
              content: '买卖双方自行协商货物交收和货款支付事项',
              top: 830
            }
          ],
          left: '返回上一页',
          right: '结束体验',
          top: 80,
          back: false,
          adressLeft: '',
          adressRight: ''
        }
      })
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
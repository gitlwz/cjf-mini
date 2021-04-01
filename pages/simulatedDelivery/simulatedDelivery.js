// pages/simulatedDelivery/simulatedDelivery.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navdata: {
      title: '',
      navbar: '2'
    },
    navH: '',
    contentH: '',
    item:{
      title: '',
      stepOne: '',
      stepTwo: ''
    }
  },
  type:'',
  topCount: 0,
  bottomCount:0,
  allMonthDelivery:
    {
      title: '选择您想体验的交割模式',
      stepOne: '标准仓单交割',
      stepTwo: '车板交割',
    stepOneUrl: '/pages/simulatedDelivery/simulatedDelivery?select=standerdMode',
    stepTwoUrl: '/pages/simulatedDelivery/simulatedDelivery?select=vehicleMode'
    },
  oneDelivery: 
    {
      title: '体验一次性交割',
      stepOne: '买方',
      stepTwo: '卖方',
      stepOneUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=oneBuy',
      stepTwoUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=oneSell'
    },
  crashDelivery: 
    {
      title: '了解期转现交割相关信息',
      stepOne: '查看期转现交割注意事项',
      stepTwo: '不了解，我要直接体验',
      stepOneUrl: '/pages/simulatedDelivery/attentionItems/attentionItems?type=crash',
    stepTwoUrl: '/pages/simulatedDelivery/simulatedDelivery?experience=crash'
    },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: getApp().globalData.navHeight,
      contentH: getApp().globalData.contentHeight
    });
    if(options.select){
      if (options.select === "standerdMode") {
        this.setData({
          item: {
            title: '了解厂库标准仓单交割相关信息',
            stepOne: '了解注册过程和注意事项',
            stepTwo: '不了解，我要直接体验',
            stepOneUrl: '/pages/simulatedDelivery/simulatedDelivery?select=register',
            stepTwoUrl: '/pages/simulatedDelivery/simulatedDelivery?experience=standerd'
          }
        })
      } else if (options.select === "vehicleMode") {
        this.setData({
          item: {
            title: '了解车板交割相关信息',
            stepOne: '查看车板交割注意事项',
            stepTwo: '不了解，我要直接体验',
            stepOneUrl: '/pages/simulatedDelivery/attentionItems/attentionItems?type=vehicle',
            stepTwoUrl: '/pages/simulatedDelivery/simulatedDelivery?experience=vehicle'
          },
        })
      } else if (options.select === "register") {
        this.setData({
          item: {
            title: '了解厂库标准仓单交割相关信息',
            stepOne: '厂库标准仓单生成',
            stepTwo: '注意事项',
            stepOneUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=receiptCreate',
            stepTwoUrl: '/pages/simulatedDelivery/attentionItems/attentionItems?type=standerd'
          }
        })
      }
    }
    if(options.experience){
      if (options.experience === "standerd") {
        this.setData({
          item: {
            title: '体验厂库标准仓单交割',
            stepOne: '买方',
            stepTwo: '卖方',
            stepOneUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=standerdBuy',
            stepTwoUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=standerdSell'
          }
        })
      } else if (options.experience === "crash") {
        this.setData({
          item: {
            title: '体验期转现交割',
            stepOne: '买方',
            stepTwo: '卖方',
            stepOneUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=crashBuy',
            stepTwoUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=crashBuy'
          }
        })
      } else if (options.experience === "vehicle") {
        this.setData({
          item: {
            title: '体验车板交割',
            stepOne: '买方',
            stepTwo: '卖方',
            stepOneUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=vehicleBuy',
            stepTwoUrl: '/pages/simulatedDelivery/vehicleDeliverySaller/vehicleDeliverySaller?type=vehicleSell'
          }
        })
      }
    }
    if(options.type){
      this.type = options.type
      if (options.type === "oneDelivery") {
        this.setData({
          item: this.allMonthDelivery
        })
      } else if (options.type === "twoDelivery") {
        this.setData({
          item: this.oneDelivery
        })
      } else {
        this.setData({
          item: this.crashDelivery
        })
      }
    }  
  },
  onTop(){
    this.setData({
      count:this.topCount++
    },function(){
      if(this.type==="oneDelivery"){
        this.setData({
          item: this.standerdDelivery[this.topCount]
        })
      }
    })                                                                                                                                 
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
import {
  login,
  getCode,
  getOauthCode
} from '../../api/api.js'
import {
  HTTP_DOMIN
} from '../..//utils/network/config.js'
const util = require('../../utils/util.js')
// pages/login/login.js
var Mcaptcha = require('../../utils/mcaptcha.js');
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  tel: '',
  password: '',
  code: '',
  data: {
    href: '',
    disabled: true,
    navdata: {
      title: '登录',
      navbar: '2'
    },
    navH: '',
    contentH: ''
  },
  onInput(event) {
    const type = event.target.dataset.type
    if (type === 'phone') {
      this.tel = event.detail.value
    } else if (type === 'password') {
      this.password = event.detail.value
    } else if (type === 'code') {
      this.code = event.detail.value
    }
    if (this.tel !== '' && this.password !== '' && this.code !== '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  onLoad() {
    this.setData({
      navH: getApp().globalData.navHeight,
      contentH: getApp().globalData.contentHeight,
    });
    this.getCode()
  },
  onLogin: util.throttle(function(e) {
    const result = /^[1][3|4|5|6|7|8|9][0-9]{9}$/.test(this.tel)
    if (!result) {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    }
    if (!this.data.disabled) {
      //如果按钮可以用,则发请求
      const that = this
      var params = {
        userName: this.tel,
        password: this.password,
        verifyCode: this.code
      }
      login(params).then(function(e) {
        getApp().globalData.login = true
        wx.setStorageSync('username', that.tel)
        wx.setStorageSync('token', e)
        wx.reLaunch({
          url: '/pages/user/index'
        })

      }).catch(function(res) {
        wx.showToast({
            title: res.errorMsg,
            icon: 'none'
          }),
          that.getCode()
      })
    }
  }, 2000),
  // onCode(){
  //   var timestamp = new Date().getTime()
  //   this.setData({
  //     href: 'http://39.98.107.143:8080/quantdo-jdfuture-app/sso/verifycode?v=' + timestamp
  //   })
  // },
  getCode() {
    const that = this
    getOauthCode().then(function (res) {
      wx.setStorageSync('codeToken', res.sessionId)
      if (that.mcaptcha) {
        // console.log(that.mcaptcha,res.verifyCode)

        that.mcaptcha.refresh(res.verifyCode)
      } else {
        that.mcaptcha = new Mcaptcha({
          el: 'canvas',
          width: 80,
          height: 35,
          code: res.verifyCode || '',
          createCodeImg: ""
        })
      }
    }).catch(function (res) {
      wx.showToast({
        title: res.errorMsg,
        icon: 'none'
      })
      })

    // let url = `${HTTP_DOMIN}/quantdo-jdfuture-app/sso/verifycode`;
    // const downloadTask = wx.downloadFile({
    //   url,
    //   success: (res) => {
    //     that.setData({
    //       href: res.tempFilePath
    //     });
    //   }
    // })
    // downloadTask.onHeadersReceived((res) => {
    //   try {
    //     wx.setStorageSync('codeToken', res.header['QuantDo-Token'])
    //   } catch (e) {}
    //   // wx.setStorage({
    //   //   key: 'token',
    //   //   data: res.header['QuantDo-Token'],
    //   // })
    //   // getApp().globalData.codeToken = res.header['QuantDo-Token']
    // })
  },
  toRegister: function() {
    wx.navigateTo("pages/login/login")
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {


  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})

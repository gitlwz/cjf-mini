// pages/forget/forget.js
import { forget, messagecode } from '../../api/api.js'
Page({
  tel: '',
  code: '',
  password: '',
  rePassword: '',
  /**
   * 页面的初始数据
   */
  data: {
    time: 59,
    sendCode: false,
    disabled: true,
    navdata: {
      title: '忘记密码',
      navbar: '2'
    },
    navH: '',
    contentH: '',
    focus:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      navH: getApp().globalData.navHeight,
      contentH: getApp().globalData.contentHeight
    });
  },
  getCode: function () {
    const result = /^[1][3|4|5|6|7|8|9][0-9]{9}$/.test(this.tel)
    var that = this
    if(this.tel!=='' && result){
      this.setData({
        focus: true,
        sendCode: true
      }, () => {
        var timer = setInterval(function () {
          if (that.data.time === 0) {
            clearInterval(timer)
            that.setData({
              time: 60,
              sendCode: false,
              focus: false
            })
          }
          that.setData({
            time: that.data.time - 1
          })
        }, 1000)
      })
      const param = {
        mobile: this.tel
      }
      messagecode(param).then(function () {
      }).catch(function () {
      })
    }else{
      wx.showToast({
        title: '手机号格式错误',
        icon:'none'
      })
    }
   
  },
  onInput(event) {
    console.log(1)
    const type = event.target.dataset.type
    if (type === 'tel') {
      this.tel = event.detail.value
    } else if (type === 'code') {
      this.code = event.detail.value
    } else if (type === 'password') {
      this.password = event.detail.value
    } else if (type === 'repassword') {
      this.rePassword = event.detail.value
    }
    console.log(this.tel, this.password, this.rePassword, this.code )
    if (this.tel !== '' && this.password !== '' && this.rePassword !== '' && this.code !== '') {
      console.log('都有值')
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  onConfirm() {
    console.log('重置密码')
    const result = /^[1][3|4|5|6|9|7|8][0-9]{9}$/.test(this.tel)
    if (!result) {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    }
    if (this.password !== this.rePassword) {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '两次密码不一致',
        icon: 'none'
      })
    }
    if (!this.data.disabled) {
      //如果按钮可以用,则发请求
      const params={
        mobile: this.tel,
        password: this.password,
        verifyCode: this.code
      }
      forget(params).then(function(){
        wx.showToast({
          title: '重置密码成功',
          icon: 'none'
        })
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }).catch(function(res){
        console.log(res,res.errorMsg)
        wx.showToast({
          title: res.errorMsg,
          icon: 'none'
        })
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
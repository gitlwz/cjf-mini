// pages/register/register.js
import { register, messagecode } from '../../api/api.js'
Page({
  tel :'',
  code : '',
  password: '',
  rePassword: '',
  /**
   * 页面的初始数据
   */
  data: {
    checked: false,
    time: 59,
    sendCode: false,
    disabled: true,
    navdata: {
      title: '注册',
      navbar: '2'
    },
    navH: '',
    contentH: '',
    focus:false
  },
  onInput(event) {
    const type = event.target.dataset.type
    if(type==='telphone'){
      this.tel = event.detail.value
    }else if(type==='code'){
      this.code = event.detail.value
    } else if (type === 'password') {
      this.password = event.detail.value
    } else if (type === 'confirmPassword'){
      this.rePassword = event.detail.value
    }
    if (this.tel !== '' && this.password !== '' && this.rePassword !== '' && this.code !== '' && this.data.checked) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  onChange(event) {
    this.setData({
      checked: !this.data.checked
    });
    if(!this.data.checked){
      this.setData({
        disabled:true
      })
    }
    if (this.tel !== '' && this.password !== '' && this.rePassword !== '' && this.code !== '' && this.data.checked) {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  onRegister() {
    const result = /^[1][3|4|5|7|8][0-9]{9}$/.test(this.tel)
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
      const that = this
      var params = {
        mobile: this.tel,
        password: this.password,
        verifyCode: this.code
      }
      register(params).then(function (e) {
        wx.showToast({
          title: '注册成功',
          icon: 'none'
        })
        wx.reLaunch({
          url: '/pages/login/login'
        })
      }).catch(function (e) {
        wx.showToast({
          title: e.errorMsg,
          icon: 'none'
        })
      })
    }
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
    if (this.tel !== '' && result) {
      this.setData({
        focus:true,
        sendCode: true
      }, () => {
        var timer = setInterval(function () {
          if (that.data.time === 0) {
            clearInterval(timer)
            that.setData({
              time: 60,
              sendCode: false,
              focus:false
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
    } else {
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
    }
  },
  toAgreement: function () {
    wx.navigateTo({
      url: "/pages/register/agreement/index",
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
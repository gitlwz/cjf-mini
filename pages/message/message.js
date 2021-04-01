// pages/message/message.js
import { message } from '../../api/api.js'
Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    disabled: true,
    count: 0,
    navdata: {
      title: '留言',
      navbar: '2'
    },
    navH: '',
    name: '',
    tel: '',
    email: '',
    message: ''
  },
  onInput(event) {
    const type = event.target.dataset.type
    if (type === 'name') {
      this.setData({
        name: event.detail.value
      })
    } else if (type === 'tel') {
      this.setData({
        tel: event.detail.value
      })
      this.tel = event.detail
    } else if (type === 'email') {
      this.setData({
        email: event.detail.value
      })
    } else if (type === 'message') {
      this.setData({
        message: event.detail.value
      })
      this.setData({
        count: event.detail.value.length
      })
    }
    if (this.data.name !== '' && this.data.tel !== '' && this.data.message !== '') {
      this.setData({
        disabled: false
      })
    } else {
      this.setData({
        disabled: true
      })
    }
  },
  
  onSubmit() {
    const that = this
    console.log(this.data.tel===15207113302,this.data.email,this.data.tel)
    const telVerify = /^[0-9-]{3,20}$/.test(this.data.tel)
    const emailVerify = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.data.email)
    console.log(telVerify, emailVerify, /^[0-9-]{3,20}$/.test(15207113302), /^[0-9-]{3,20}$/.test(this.data.tel), /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.data.email))
    if (!telVerify) {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '电话格式错误',
        icon: 'none'
      })
    }
    if (!emailVerify && this.data.email) {
      this.setData({
        disabled: true
      })
      wx.showToast({
        title: '邮箱格式错误',
        icon: 'none'
      })
    }
    if (!this.data.disabled) {
      //如果按钮可以用,则发请求
      const params={
        clientName: this.data.name,
        messageMobile: this.data.tel,
        mail: this.data.email,
        remark: this.data.message
      }
      message(params).then(function(){
        wx.showToast({
          title: '提交成功'
        })
        that.setData({
          name: '',
          tel: '',
          email: '',
          message: '',
          count: '0',
          disabled: true
        })
      }).catch(function(res){
        wx.showToast({
          title: '提交失败',
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
      navH: getApp().globalData.navHeight
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
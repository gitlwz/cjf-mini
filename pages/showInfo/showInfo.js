// pages/showInfo/showInfo.js
import { commit } from '../../api/api.js'
import { HTTP_DOMIN } from '../../utils/network/config.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img: null,
    id: null,
    navdata: {
      title: '上传资料',
      navbar: '2'
    },
    navH: ''
  },
  params: {},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const title = "navdata.title"
   this.setData({
     img:options.imgUrl,
     id: options.id,
     navH: getApp().globalData.navHeight,
     [title]: options.text
   })
  },

  onClick: function () {
    const that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        console.log("图片选择成功")
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        const token = wx.getStorageSync('token')
        console.log(tempFilePaths)
        wx.uploadFile({
          url: `${HTTP_DOMIN}/quantdo-jdfuture-app/file/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          // formData: {
          //   index: index
          // },
          header: {
            'QuantDo-Token': token
          },
          success(res) {
            const data = JSON.parse(res.data)
            switch (that.data.id) {
              case '0':
                that.params = {
                  orgPhoto: data.result.fileUrl
                }
                break;
              case '1':
                that.params = {
                  legalIdPhoto: data.result.fileUrl
                }
                break;
              case '2':
                that.params = {
                  assigneeIdPhoto: data.result.fileUrl
                }
                break;
              case '3':
                that.params = {
                  investorProvPhoto: data.result.fileUrl
                }
                break;
              case '4':
                that.params = {
                  auditReportPhoto: data.result.fileUrl
                }
                break;
              case '5':
                that.params = {
                  otherPhoto: data.result.fileUrl
                }
                break;
            }
            commit(that.params).then(function(e){
              wx.showToast({
                title: '图片上传成功'
              })
              that.setData({
                img: tempFilePaths
              })
              //获取已经打开的页面的数组
              var pages = getCurrentPages();
              //获取上一个页面的所有的方法和data中的数据
               var lastpage = pages[pages.length - 2]
              var beforeImg ="list[" + that.data.id + "].img";
              //改变上一个页面中的data中的数据
               lastpage.setData({
                 [beforeImg]: data.result.fileUrl
               })
            }).catch(function(){
              wx.showToast({
                title: '图片上传失败',
                icon: 'none'
              })
            })  
          },
          fail() {
            console.log('图片上传失败')
          }
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
// pages/upLoad/upLoad.js
import { info,commit } from '../../api/api.js'
import { HTTP_DOMIN } from '../../utils/network/config.js'
Page({
  imgList: {
    orgPhoto: null,
    legalIdPhoto: null,
    assigneeIdPhoto: null,
    investorProvPhoto: null,
    auditReportPhoto: null,
    otherPhoto: null
  },
  /**
   * 页面的初始数据
   */
  data: {
    list: [{
      text: '营业执照',
      img: ''
    },
    {
      text: '法人身份证',
      img: ''
    },
    {
      text: '被授权人身份证',
      img: ''
    },
    {
      text: '专业投资者证明材料',
      img: ''
    },
    {
      text: '近月财务报表/上年度审计报告',
      img: ''
    },
    {
      text: '其他资料',
      img: ''
    }],
    reLoad: false,
    isLoading: true,
    disabled: true,
    navdata: {
      title: '上传资料',
      navbar: '2'
    },
    navH: ''
  },

  onTap: function (event) {
    const index = event.currentTarget.dataset.index
    const that = this
    console.log(index)
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths
        var value = wx.getStorageSync('token')
        wx.uploadFile({
          url: `${HTTP_DOMIN}/quantdo-jdfuture-app/file/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          formData: {
            index: index
          },
          header: {
            'QuantDo-Token': value
          },
          success(res) {
            console.log('图片上传成功')
            const data = JSON.parse(res.data)
            var img = "list[" + index + "].img";
            that.setData({
              [img]: data.result.fileUrl
            })
            console.log(that.data.list[index].img)
            switch (index){
              case 0:
                that.imgList.orgPhoto = data.result.fileUrl;
                break;
              case 1:
                that.imgList.legalIdPhoto = data.result.fileUrl;
                break;
              case 2:
                that.imgList.assigneeIdPhoto = data.result.fileUrl;
                break;
              case 3:
                that.imgList.investorProvPhoto = data.result.fileUrl;
                break;
              case 4:
                that.imgList.auditReportPhoto = data.result.fileUrl;
                break;
              case 5:
                that.imgList.otherPhoto = data.result.fileUrl;
                break;
            }
            if (that.data.list[0].img && that.data.list[1].img && that.data.list[2].img && that.data.list[3].img && that.data.list[4].img) {
              that.setData({
                disabled: false
              })
            }
          },
          fail(){
          }
        })
      }
    })
  },
  onSubmit(){
    console.log("submit")
    const that = this
    if(!that.data.disabled){
      console.log('都有值,提交', this.imgList)
      commit(this.imgList).then(function(){
        that.setData({
          reLoad: true
        })
        wx.showToast({
          title: '提交成功'
        })
      }).catch(function () {
        wx.showToast({
          title: '提交失败'
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
    const that = this;
    info().then(function (e) {
      var imgOne = "list[0].img";
      var imgTwo = "list[1].img";
      var imgThree = "list[2].img";
      var imgFore = "list[3].img";
      var imgFive = "list[4].img";
      var imgSix = "list[5].img";
      if(!e.orgPhoto){
        that.setData({
          reLoad : false
        })
      }else {
        that.setData({
          reLoad: true
        })
      }
    that.setData({
      [imgOne]: e.orgPhoto,
      [imgTwo]: e.legalIdPhoto,
      [imgThree]: e.assigneeIdPhoto,
      [imgFore]: e.investorProvPhoto,
      [imgFive]: e.auditReportPhoto,
      [imgSix]: e.otherPhoto,
      isLoading: false
    })

    }).catch(function () {
      that.setData({
        isLoading:false
      })
    })
  },
  // onLi: function (event) {
  //   const id = event.currentTarget.dataset.id
  //   const img = event.currentTarget.dataset.img
  //   const text = event.currentTarget.dataset.text
  //   console.log(text,img,index)
  //   wx.navigateTo({
  //     url: '/pages/showInfo/showInfo?text=' + text + '&img=' + img + '&id=' + id
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // this.onLoad()
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

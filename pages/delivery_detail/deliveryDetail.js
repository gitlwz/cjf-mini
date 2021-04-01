import { deliverystoredetail, deliveryknowledgeFindById} from '../../api/api.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    navdata: {
      title: '交割详情',
      navbar: '2'
    },
    navH: '',
    type: '',
    name:'',
    person:'',
    mobile:'',
    adress: '',
    id:'',
    articleInfo: [],// 文章详情信息,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that=this
    // const tempTitle = options.type == 1 ? '交割知识' : '交割详情'
    this.setData({
      navH: getApp().globalData.navHeight,
      type: options.type,
      name: options.name,
      person: options.person,
      mobile: options.mobile,
      adress: options.address,
      id:options.id
    },function(){
        const param = {
          id: this.data.id
        }

        if (this.data.type == 0) {
          deliverystoredetail(param).then(function (result) {
            that.setData({
              'articleInfo.title': result['title'],
              'articleInfo.source': result['source'],
              'articleInfo.publishTime': result['publishTime'],
              'articleInfo.publishImage': result['publishImage'],
              'articleInfo.publishContent': result['publishContent'],
              'articleInfo.publishVideo': result['publishVideo']
            })
          }).catch(function () {

          })
        } else {
          deliveryknowledgeFindById(param).then(function (result) {
            that.setData({
              'articleInfo.title': result['title'],
              'articleInfo.source': result['source'],
              'articleInfo.publishTime': result['publishTime'],
              'articleInfo.publishImage': result['publishImage'],
              'articleInfo.publishContent': result['publishContent'],
              'articleInfo.publishVideo': result['publishVideo']
            })
          }).catch(function () {

          })
        }
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

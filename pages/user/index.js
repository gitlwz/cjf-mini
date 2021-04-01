import {
  commit,
  info
} from '../../api/api.js'
import {
  HTTP_DOMIN
} from '../../utils/network/config.js'
var app = getApp()
Page({
  data: {
    username: '',
    imgUrl: '',
    login: '',
    clipUrl:'',
    list: [{
        img: '../../images/wxy.png',
        text: '首创京都&无限易',
        param: ''
    },
    {
        img: '../../images/xf.png',
        text: '首创京都&上海农创',
        param: ''
      },
      {
        img: '../../images/jy.png',
        text: '首创京都&首创证券',
        param: ''
      }, {
        img: '../../images/pp.png',
        text: '首创京都&北京蛋协',
        param: ''
      },
      {
        img: '../../images/xc.png',
        text: '首创京都&北农所',
        param: ''
      },
    ],
    img: '../../images/loginOut.png',
    navdata: {
      title: '首创京都',
      navbar: '1'
    },
    navH: '',
    chooseImg: false
  },
  onShow: function() {
    const that = this
    const user = wx.getStorageSync('username')
    const img = wx.getStorageSync('img')
    this.setData({
      username: user.substring(0, 3) + '****' + user.substring(7),
      imgUrl: img,
      login: getApp().globalData.login
    }, function() {
      if (this.data.login) {
        console.log(that.data.imgUrl)
        info().then(function(res) {

          //本地取不到,再在接口里去头像地址,避免一直setdata
          if (that.data.imgUrl === '' && res.headPhoto) {

            console.log("本地没有,才去取")
            wx.setStorageSync('img', res.headPhoto)
            that.setData({
              imgUrl: res.headPhoto
            }, function() {
              console.log(that.data.imgUrl)
            })
          }
        }).catch(function() {
          console.log("info失败")
        })
      }
    })
    //有token,验证token是否已过期
    this.setData({
      navH: getApp().globalData.navHeight
    })
    // this.onLoad()
  },
  onLoad: function(options) {

  },
  onTap: function() {
    this.setData({
      login: false
    })
    getApp().globalData.login = false
    wx.clearStorageSync()
  },
  changeImg: function() {
    const that = this
    var value = wx.getStorageSync('token')
    wx.chooseImage({
      count: 1,
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths

        // that.setData({
        //   chooseImg: true,
        //   clipUrl: tempFilePaths
        // })
        // wx.hideTabBar({

        // })
        wx.uploadFile({
          url: `${HTTP_DOMIN}/quantdo-jdfuture-app/file/upload`, //仅为示例，非真实的接口地址
          filePath: tempFilePaths[0],
          name: 'file',
          header: {
            'QuantDo-Token': value
          },
          success(res) {
            console.log("图片上传成功")
            const data = JSON.parse(res.data)
            try {
              wx.setStorageSync('img', data.result.fileUrl)
            } catch (e) { }
            const params={
              headPhoto: data.result.fileUrl
            }
            commit(params).then(function (e) {
              wx.showToast({
                title: '头像上传成功'
              })
              that.setData({
                imgUrl: data.result.fileUrl
              })
            }).catch(function () {
              console.log("头像上传失败")
            })
          },
          fail() {
            console.log('图片上传失败')
          }
        })
      }
    })
  },
  load(e) {
    const that =this
    var path = e.detail
    console.log(e.detail)
    var value = wx.getStorageSync('token')
    wx.showLoading({
      title: '图片生成中...',
    })
    wx.uploadFile({
      url: `${HTTP_DOMIN}/quantdo-jdfuture-app/file/upload`, //仅为示例，非真实的接口地址
      filePath: path,
      name: 'file',
      header: {
        'QuantDo-Token': value
      },
      success(res) {
        console.log(res)
        const data = JSON.parse(res.data)
        const params = {
          headPhoto: data.result.fileUrl
        }
        commit(params).then(function(e) {
          wx.hideLoading()
          wx.showToast({
            title: '头像上传成功'
          })
          wx.setStorageSync('img', data.result.fileUrl)
          console.log(data.result.fileUrl)
          that.setData({
            imgUrl: data.result.fileUrl,
            chooseImg:false
          },function(){
            wx.showTabBar({

            })
          })

        }).catch(function() {
          console.log("头像上传失败")
        })
      },
      fail() {
        console.log('图片上传失败')
      }
    })
  },
  cancell(){
    this.setData({
      chooseImg:false
    }, function () {
      wx.showTabBar({

      })
    })
  }
})

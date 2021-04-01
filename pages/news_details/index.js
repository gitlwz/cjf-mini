import { getNewDetails } from '../../api/api.js'
import {parseParams} from '../../utils/util'
import { mockArticle } from '../mock.js'

const app = getApp();

Page({
  data: {
    parameter: {
      'navbar': '1',
      'return': '1',
      'title': '文章详情',
      'color': true,
      'class': '0'
    },
    articleId: 0,
    articleInfo: [],// 文章详情信息,
    navdata: {
      title: '',
      navbar: '2'
    },
    navH: '',
    notice:true
  },
  onLoad: function (options) {
    // 获取新闻列表页传递的参数
    if (options.hasOwnProperty('articleId')) {
      this.setData({
        articleId: options.articleId,
        navH: getApp().globalData.navHeight
      });
    }

    if (options.hasOwnProperty('articleType')) {
      console.log(options.articleType)
      const articleType = options.articleType
      const title = "navdata.title"
      if (articleType == 0) {
        this.setData({
          [title]: '大咖观点',
          articleType: articleType,
          notice: true
        })
      } else if (articleType == 1) {
        this.setData({
          [title]: '蛋价视点',
          articleType: articleType,
          notice: true
        })
      } else if (articleType == 2) {
        this.setData({
          [title]: '蛋业新闻',
          articleType: articleType,
          notice: true
        })
      } else if (articleType == 3) {
        this.setData({
          [title]: '公告详情',
          articleType: articleType,
          notice:false
        })
      }
    }
  },
  onShow: function () {
    this.getArticleOne()
  },
  getArticleOne: function () {
    const that = this;
    wx.showLoading({
      title: '加载中',
    })
    getNewDetails({ id: that.data.articleId }).then(function (result) {
      that.setData({
        'articleInfo.title': result['title'],
        'articleInfo.source': result['source'],
        'articleInfo.publishTime': result['publishTime'],
        'articleInfo.publishImage': result['publishImage'],
        'articleInfo.publishContent': result['publishContent'],
        'articleInfo.publishVideo': result['publishVideo']
      })

      setTimeout(()=>{
        wx.hideLoading()
      },300)
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.navdata.title, // 文章分享标题
      path: parseParams('/pages/news_details/index', {articleId: this.data.articleId,articleType: this.data.articleType }), // 分享跳转路径
    }
  }
})

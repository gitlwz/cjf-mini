import {
  apiGetFZCommodityAllCategory,
} from '../../api/api.js'
//index.js
const app = getApp()

Page({
  data: {
    allCommidityCategoryList:[],
    leftCommidityCategoryList:[],
    rightCommidityCategoryList:[],
  },
  onLoad: function() {
    this.initData();
  },
  //首页数据初始化
  initData: function () {
    this.getLeftCommidityCategory()
  },

  //加载首屏数据
  initSelected: function () {
    const that = this
    //右侧小分类加载左侧选中大分类对应的小分类数据
    let leftNewList = []
    let rightNewList = []
    var index0 = 0;
    for(var i=0;i<this.data.allCommidityCategoryList.length;i++){
      //左侧
      if(this.data.allCommidityCategoryList[i].parentId == 0){
        leftNewList[index0] = this.data.allCommidityCategoryList[i]
        index0++;
      }
    }
    let leftCategoryId = leftNewList[0].id
    var index1 = 0;
    for(var i=0;i<this.data.allCommidityCategoryList.length;i++){
      //右侧
      if(this.data.allCommidityCategoryList[i].parentId == leftCategoryId){
        rightNewList[index1] = this.data.allCommidityCategoryList[i]
        index1 ++
      }
    }
    that.setData({
      leftCommidityCategoryList: leftNewList,
      rightCommidityCategoryList:rightNewList
    })
  },

  //点击左侧节点显示右侧内容
  clickLeftCategory:function(e){
    const that = this
    let categoryId = e.target.id
    console.log("--> "+categoryId)
    let listLength = this.data.allCommidityCategoryList.length
    this.data.rightCommidityCategoryList = []
    console.log("listLength--> "+listLength)
    let newList = []
    var index0 =0
    for(var i=0;i<listLength;i++){
        if(this.data.allCommidityCategoryList[i].parentId == categoryId){
            newList[index0] = this.data.allCommidityCategoryList[i]
            index0++
        }
    }
    console.log("rightListLength "+newList.length)
    that.setData({
      rightCommidityCategoryList: newList
    })
 },
  //首页所有分类节点，包含左侧和右侧
  getLeftCommidityCategory: function () {
    const that = this
    apiGetFZCommodityAllCategory().then(function (e) {
      that.setData({
        allCommidityCategoryList: e
      })
      //初始化左侧和右侧的节点
      console.log("00000000000000000000000")
      that.initSelected()
    }).catch(function () { })
  },
})

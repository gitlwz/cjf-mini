import { contractState } from '../../constant.js'
import { contractdetail } from '../../api/api.js'
var app = getApp();

Page({
  //页面的初始数据
  data: {
    contractStateList: [{ text: '全部' }, { text: '已完成', key: contractState.COMPLETE }, { text: '未完成', key: contractState.NOT_COMPLETE }],
    isLoading: true,
    listData: [],
    navdata: {
      title: '合同详情',
      navbar: '2'
    },
    navH: '',
    id: ''
  },
  onLoad(options){
    const that = this
    this.setData({
      navH: getApp().globalData.navHeight,
      id: options.id
    }, function(){
      const param = {
        id: this.data.id
      }
      contractdetail(param).then(function (e){
         that.setData({
           isLoading:false,
           listdata: e
         })

      }).catch(function(){

      })
    })
  }
})
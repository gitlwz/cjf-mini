// pages/instruments_list/productSale/productSale.js
import { company, companyInstrument } from '../../../api/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    exchangeType: [],
    ids:[],
    upImg: false,
    act: false,
    data: [{}, {}, {}],
    show: false,
    remark:'',
    instrumentId: '',
    time:'',
    instrumentPrice:'',
    callBuyPrice:'',
    callSellPrice:'',
    exercisePrice: '',
    putBuyPrice:'',
    putSellPrice:'',
    indexLi:0
  },
  lifetimes:{
    attached() {
      const that = this
      //获取交易所类型列表info
      company().then(function(e){
        const list=[]
        const id=[]
        for (var i = 0; i < e.length;i++){
          list.push(e[i].name)
          id.push(e[i].value)
        }
        that.setData({
          exchangeType: list,
          ids:id
        })
        const param = {
          companyId: e[0].value
        }
        companyInstrument(param).then(function (res) {
          that.setData({
            instrumentId: res.instrumentId,
            time: res.quoteTime,
            instrumentPrice: res.instrumentPrice,
            data:res.instrumentList,
            remark: res.remark
          })
        }).catch(function () {
        })
      }).catch(function(){})

    }
  },
  /**
   * 组件的方法列表
   */
  methods: {
    onImg(){
      this.setData({
        upImg: !this.data.upImg,
        show: !this.data.show
      })
      console.log(this.data.show)
    },
    onLi(e){
      const index = e.target.dataset.index
      const that = this
      this.setData({
        indexLi: index,
        show: false,
        upImg: false,
      })
      const param={
        companyId: this.data.ids[index]
      }
      companyInstrument(param).then(function(e){
        that.setData({
          instrumentId: e.instrumentId,
          time: e.quoteTime,
          instrumentPrice: e.instrumentPrice,
          data: e.instrumentList,
          remark:e.remark
        })
      }).catch(function(){

      })
    },
    onClickHide() {
      this.setData({
        show: false,
        upImg: !this.data.upImg,
      });
    }
  }
})

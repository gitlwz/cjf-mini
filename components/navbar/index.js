var app = getApp();
Component({
  properties: {
    parameter:{
      type: Object
    },
    activityIndex:{
      type: Number ,
      observer: function (newVal, oldVal) {
        this.initActivityNav()
      }
  },
    logoUrl:{
      type:String,
      value:'',
    }
  },
  data: {
    navH: "",
    titleH: "",
    tab: false,
    itemOne: true,
    itemTwo: false,
    itemThree: false
  },
  // ready: function(){
  //   var pages = getCurrentPages();
  //   if (pages.length <= 1) this.setData({'parameter.return':0});
  // },
  attached: function () {
    this.setData({
      navH: app.globalData.navHeight,
      titleH: app.globalData.titleHeight
    });
  },
  methods: {
    initActivityNav:function(){
      switch (this.properties.activityIndex) {
        case 1:
          this.setData({
            itemOne: true,
            itemTwo: false,
            itemThree: false
          });
          break;
        case 2:
          this.setData({
            itemOne: false,
            itemTwo: true,
            itemThree: false
          });
          break;
        case 3:
          this.setData({
            itemOne: false,
            itemTwo: false,
            itemThree: true
          });
          break;
      }
    },
    showDropdown:function(){

    },
    return:function(){
      wx.navigateBack();
    },
    changeType: function(){
      this.setData({
        tab: !this.data.tab
      })
    },
    onTap:function(e){
      const index = e.currentTarget.dataset.index
      switch(index){
        case 'one':
          this.setData({
            itemOne:true,
            itemTwo: false,
            itemThree: false
          });
          this.triggerEvent("reset",'蛋价宝')
          break;
        case 'two':
          this.setData({
            itemOne: false,
            itemTwo: true,
            itemThree: false
          });
          this.triggerEvent("reset", '蛋融通')
          break;
        case 'three':
          this.setData({
            itemOne: false,
            itemTwo: false,
            itemThree: true
          });
          this.triggerEvent("reset", '智慧蛋')
          break;
      }
      this.setData({
        tab: false
      })
    },
    navback:function(param){
      console.log('222222', param)
      if (getCurrentPages().length === 1){
        wx.switchTab({
          url: '/pages/index/index'
        })
      } else {
        wx.navigateBack()
      }
    }
  }
})

// component/clipImg.js
import {
  HTTP_DOMIN
} from '../..//utils/network/config.js'
import {
  commit,
  info
} from '../../api/api.js'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgSrc: {
      type: 'String',
      value: ''
    }
  },

  /**
   * 组件的初始数据
   * imageUrl string 初始化图片
   * cropperW string 缩小图宽度
   * cropperH  string 缩小图高度,
   * img_ratio string  图片比例,
   * IMG_W string 原图高度,
   * IMG_H string 原图高度,
   * left string 图片距离左边距离,
   * top string 图片距离上边距离,
   * clipW number 默认截取框
   */
  data: {
    imageUrl: '',
    cropperW: '',
    cropperH: '',
    img_ratio: '',
    IMG_W: '',
    IMG_H: '',
    left: '',
    top: '',
    clipW: 200,
    marginL:'',
    marginT:''
  },
  /**
   * 组件的方法列表
   */
  // attached(){
  //   const query = wx.createSelectorQuery().in(this)
  //   query.selectAll('#ui').boundingClientRect()
  //   query.exec(function (res) {
  //     this.setData({
  //       left: res[0][0].left,
  //       top: res[0][0].top
  //     })
  //   })
    
  // },
  methods: {
    //点击取消
    cancel: function() {
     this.triggerEvent('cancell')
    },
    //拖拽事件
    move: function({
      detail
    }) {
      this.setData({
        left: detail.x * 2,
        top: detail.y * 2
      })
    },
    //缩放事件
    scale: function({
      detail
    }) {
      console.log(detail.scale)
      this.setData({
        clipW: 200 * detail.scale
      })
    },
    //生成图片
    getImageInfo: function() {
      const that =this
      
      const img_ratio = this.data.img_ratio;
      const canvasW = (this.data.clipW / this.data.cropperW) * this.data.IMG_W
      const canvasH = (this.data.clipW / this.data.cropperH) * this.data.IMG_H
      const canvasL = (this.data.left / this.data.cropperW) * this.data.IMG_W
      const canvasT = (this.data.top / this.data.cropperH) * this.data.IMG_H
      // 将图片写入画布
      const ctx = wx.createCanvasContext('myCanvas');
      //绘制图像到画布
      ctx.save(); // 先保存状态 已便于画完圆再用        
      ctx.beginPath(); //开始绘制  
      ctx.clearRect(0, 0, 1000, 1000)
      //先画个圆
      ctx.arc(this.data.clipW / 2, this.data.clipW / 2, this.data.clipW / 2, 0, 2 * Math.PI, false)
      ctx.clip(); //画了圆 再剪切  原始画布中剪切任意形状和尺寸。一旦剪切了某个区域，则所有之后的绘图都会被限制在被剪切的区域内 
      ctx.drawImage(this.data.imageUrl, canvasL, canvasT, canvasW, canvasH, 0, 0, this.data.clipW, this.data.clipW); // 推进去图片       


      ctx.restore(); //恢复之前保存的绘图上下文 恢复之前保存的绘图上下午即状态 可以继续绘制
      ctx.draw(true, () => {
        // 获取画布要裁剪的位置和宽度   
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: this.data.clipW,
          height: this.data.clipW,
          destWidth: this.data.clipW,
          destHeight: this.data.clipW,
          quality: 0.5,
          canvasId: 'myCanvas',
          success: (res) => {
            wx.hideLoading()
            var value = wx.getStorageSync('token')
            console.log(res.tempFilePath)
            that.triggerEvent('load', res.tempFilePath)
            /**
             * 截取成功后可以上传的服务端直接调用
             * wx.uploadFile();
             */
            //成功获得地址的地方
            // wx.previewImage({
            //   current: '', // 当前显示图片的http链接
            //   urls: [res.tempFilePath] // 需要预览的图片http链接列表
            // })
            // wx.uploadFile({
            //   url: `${HTTP_DOMIN}/quantdo-jdfuture-app/file/upload`, //仅为示例，非真实的接口地址
            //   filePath: res.tempFilePath,
            //   name: 'file',
            //   header: {
            //     'QuantDo-Token': value
            //   },
            //   success(res) {
            //     console.log("图片上传成功")
            //     const data = JSON.parse(res.data)
            //     wx.setStorageSync('img', data.result.fileUrl)
            //     const params = {
            //       headPhoto: data.result.fileUrl
            //     }
            //     commit(params).then(function(e) {
            //       wx.showToast({
            //         title: '头像上传成功'
            //       })
            //       // that.setData({
            //       //   imgUrl: data.result.fileUrl
            //       // })
            //     }).catch(function() {
            //       console.log("头像上传失败")
            //     })
            //   },
            //   fail() {
            //     console.log('图片上传失败')
            //   },
            //   complete(){
            //     console.log(88)
            //   }
            // })
          },
          fail: () => {
            console.log(3)
          }
        })
      })
    }
  },
  ready: function() {
    this.setData({
      imageUrl: this.data.imgSrc[0]
    })
    //获取图片宽高
    wx.getImageInfo({
      src: this.data.imageUrl,
      success: (res) => {
        console.log('图片信息', res);
        //图片实际款高
        const width = res.width;
        const height = res.height;
        //图片宽高比例
        const img_ratio = width / height
        this.setData({
          img_ratio,
          IMG_W: width,
          IMG_H: height,
          
        },function(){
          console.log(this.data.marginL,this.data.marginT)
        })
        if (img_ratio >= 1) {
          //宽比较大，横着显示
          this.setData({
            cropperW: 750,
            cropperH: 750 / img_ratio,
            marginL: 350,
            marginT: height / 2 - 50,
          })
        } else {
          //竖着显示
          this.setData({
            cropperW: 750 * img_ratio,
            cropperH: 750
          })
        }
      }
    })
  }
})
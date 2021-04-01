import { HTTP_REQUEST_URL, HEADER, TOKEN_HEADER} from './config.js'
/**
 * 发送请求
 * 由于小程序的安全限制，只能进行HTTPS类型的网络请求，
 * 开发模式下可以通过小程序开发工具配置关闭域名检验，进行HTTP请求
 */
export default function request(api, method, data, { noAuth = false, noVerify = false }) {
  let Url = HTTP_REQUEST_URL, header = HEADER
  var value = wx.getStorageSync('token')
  var codeValue = wx.getStorageSync('codeToken')
  if(codeValue){
    header[TOKEN_HEADER] = codeValue
  }else if(value){
    header[TOKEN_HEADER] = value
  }else{
    header[TOKEN_HEADER] = null
  }
  wx.removeStorageSync('codeToken')
  // if (getApp().globalData.codeToken) {
  //   console.log(getApp().globalData.codeToken)
  //   header[TOKEN_HEADER] = getApp().globalData.codeToken
  // }
  return new Promise((reslove, reject) => {
    wx.request({
      url: Url + api,
      method: method || 'GET',
      header: header,
      data: data || {},
      success: (res) => {
        if (noVerify){
          reslove(res.data.result)
        }
        else if (res.data.success){
          reslove(res.data.result)
        }
        else {
          console.log(res.data.code)
          if (res.data.code === 401) {
            wx.clearStorageSync()
            getApp().globalData.login = false
            wx.showModal({
              content: '登录已过期,是否重新登录?',
              success(res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: "/pages/login/login"
                  })
                } else if (res.cancel) {
                }
              }
            })
          }
          reject({ errorCode: res.data.code, errorMsg: res.data.message })
        }
      },
      fail: (msg) => {
        reject('网络错误，请稍后重试')
      }
    })
  })
}

['options', 'get', 'post', 'put', 'head', 'delete', 'trace', 'connect'].forEach((method) => {
  request[method] = (api, data, opt) => request(api, method, data, opt || {})
})


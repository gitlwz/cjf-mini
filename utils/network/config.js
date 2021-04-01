// let HTTP_DOMIN = 'http://192.168.33.111:8090'
// let HTTP_DOMIN = 'http://192.168.100.173:8080'
let HTTP_DOMIN = 'https://jdxcx.jingduqh.com'

 module.exports = {
    // 请求域名 格式： https://域名
   HTTP_DOMIN: HTTP_DOMIN,
   HTTP_REQUEST_URL: `${HTTP_DOMIN}/quantdo-jdfuture-app/`,
   // HTTP_REQUEST_URL: 'http://192.168.100.173:8080/quantdo-jdfuture-app/',
  // 请求头
  HEADER: {
    'content-type': 'application/json'
  },
  TOKEN_HEADER: 'QuantDo-Token'
}

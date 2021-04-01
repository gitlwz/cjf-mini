
/*
* 单图上传
* @param object opt
* @param callable successCallback 成功执行方法 data
* @param callable errorCallback 失败执行方法
*/
const uploadImageOne = function (opt, successCallback, errorCallback) {
  if (typeof opt === 'string') {
    var url = opt;
    opt = {};
    opt.url = url;
  }
  var count = opt.count || 1, sizeType = opt.sizeType || ['compressed'], sourceType = opt.sourceType || ['album', 'camera'],
    is_load = opt.is_load || true, uploadUrl = opt.url || '', inputName = opt.name || 'pics';
  wx.chooseImage({
    count: count,  //最多可以选择的图片总数
    sizeType: sizeType, // 可以指定是原图还是压缩图，默认二者都有
    sourceType: sourceType, // 可以指定来源是相册还是相机，默认二者都有
    success: function (res) {
      //启动上传等待中...
      wx.showLoading({
        title: '图片上传中',
      });
      wx.uploadFile({
        url: getApp().globalData.url + '/api/' + uploadUrl,
        filePath: res.tempFilePaths[0],
        name: inputName,
        formData: {
          'filename': inputName
        },
        header: {
          "Content-Type": "multipart/form-data",
          [TOKENNAME]: 'Bearer ' + getApp().globalData.token
        },
        success: function (res) {
          wx.hideLoading();
          if (res.statusCode == 403) {
            Tips({ title: res.data });
          } else {
            var data = res.data ? JSON.parse(res.data) : {};
            if (data.status == 200) {
              successCallback && successCallback(data)
            } else {
              errorCallback && errorCallback(data);
              Tips({ title: data.msg });
            }
          }
        }, fail: function (res) {
          wx.hideLoading();
          Tips({ title: '上传图片失败' });
        }
      })
    }
  })
}

/**
 * 精确运算工具函数
 */
const Calc = {
  //除法函数，用来得到精确的除法结果
  //说明：javascript的除法结果会有误差，在两个浮点数相除的时候会比较明显。这个函数返回较为精确的除法结果。
  //调用：$h.Div(arg1,arg2)
  //返回值：arg1除以arg2的精确结果
  Div: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var t1 = 0, t2 = 0, r1, r2;
    try { t1 = arg1.toString().split(".")[1].length; } catch (e) { }
    try { t2 = arg2.toString().split(".")[1].length; } catch (e) { }
    r1 = Number(arg1.toString().replace(".", ""));
    r2 = Number(arg2.toString().replace(".", ""));
    return this.Mul(r1 / r2, Math.pow(10, t2 - t1));
  },
  //加法函数，用来得到精确的加法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
  //调用：$h.Add(arg1,arg2)
  //返回值：arg1加上arg2的精确结果
  Add: function (arg1, arg2) {
    arg2 = parseFloat(arg2);
    var r1, r2, m;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(100, Math.max(r1, r2));
    return (this.Mul(arg1, m) + this.Mul(arg2, m)) / m;
  },
  //减法函数，用来得到精确的减法结果
  //说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的减法结果。
  //调用：$h.Sub(arg1,arg2)
  //返回值：arg1减去arg2的精确结果
  Sub: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var r1, r2, m, n;
    try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
    try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
    m = Math.pow(10, Math.max(r1, r2));
    //动态控制精度长度
    n = (r1 >= r2) ? r1 : r2;
    return ((this.Mul(arg1, m) - this.Mul(arg2, m)) / m).toFixed(n);
  },
  //乘法函数，用来得到精确的乘法结果
  //说明：javascript的乘法结果会有误差，在两个浮点数相乘的时候会比较明显。这个函数返回较为精确的乘法结果。
  //调用：$h.Mul(arg1,arg2)
  //返回值：arg1乘以arg2的精确结果
  Mul: function (arg1, arg2) {
    arg1 = parseFloat(arg1);
    arg2 = parseFloat(arg2);
    var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
    try { m += s1.split(".")[1].length } catch (e) { }
    try { m += s2.split(".")[1].length } catch (e) { }
    return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
  },
}

/**
   * opt  object | string
   * to_url object | string
   * 例:
   * this.tipWithOpenPage('/pages/test/test'); 跳转不提示
   * this.tipWithOpenPage({title:'提示'},'/pages/test/test'); 提示并跳转
   * this.tipWithOpenPage({title:'提示'},{tab:1,url:'/pages/index/index'}); 提示并跳转值tab上
   * tab=1 一定时间后跳转至 tab上
   * tab=2 一定时间后跳转至非 tab上
   * tab=3 一定时间后返回上页面
   * tab=4 关闭所有页面跳转至非tab上
   * tab=5 关闭当前页面跳转至tab上
   */
const tipWithOpenPage = function (opt, to_url) {
  if (typeof opt == 'string') {
    to_url = opt;
    opt = {};
  }
  var title = opt.title || '', icon = opt.icon || 'none', endtime = opt.endtime || 2000;
  if (title) wx.showToast({ title: title, icon: icon, duration: endtime })
  if (to_url != undefined) {
    if (typeof to_url == 'object') {
      var tab = to_url.tab || 1, url = to_url.url || '';
      switch (tab) {
        case 1:
          //一定时间后跳转至 tab
          setTimeout(function () {
            wx.switchTab({
              url: url
            })
          }, endtime);
          break;
        case 2:
          //跳转至非tab页面
          setTimeout(function () {
            wx.navigateTo({
              url: url,
            })
          }, endtime);
          break;
        case 3:
          //返回上页面
          setTimeout(function () {
            wx.navigateBack({
              delta: parseInt(url),
            })
          }, endtime);
          break;
        case 4:
          //关闭当前所有页面跳转至非tab页面
          setTimeout(function () {
            wx.reLaunch({
              url: url,
            })
          }, endtime);
          break;
        case 5:
          //关闭当前页面跳转至非tab页面
          setTimeout(function () {
            wx.redirectTo({
              url: url,
            })
          }, endtime);
          break;
      }

    } else if (typeof to_url == 'function') {
      setTimeout(function () {
        to_url && to_url();
      }, endtime);
    } else {
      //没有提示时跳转不延迟
      setTimeout(function () {
        wx.navigateTo({
          url: to_url,
        })
      }, title ? endtime : 0);
    }
  }
}

//函数防抖
function throttle(fn, gapTime) {
  if (gapTime == null || gapTime == undefined) {
    gapTime = 1500
  }

  let _lastTime = null

  // 返回新的函数
  return function () {
    let _nowTime = + new Date()
    if (_nowTime - _lastTime > gapTime || !_lastTime) {
      fn.apply(this, arguments)   //将this和传递给原函数
      _lastTime = _nowTime
    }
  }
}
// 日期格式化
const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

/**
 *  @parameter differentDay 距离今天的差值, +未来differentDay天, -前differentDay天 默认0
 *  @parameter formarter  格式化连接符 默认 -
 *  @return 2019-12-17
 */
const formatDate = (differentDay = 0, date= new Date(), formarter = '-') => {
  // 一天的毫秒值24 * 60*60* 1000 =
  date.setTime(date.getTime() + 86400000 * differentDay)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return [year, month, day].map(formatNumber).join(formarter)
}



const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function formatTimeTwo(number, format) {
  var formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
  var returnArr = [];
  // var date = new Date(number * 1000);//时间戳为10位
  var date = new Date(number);//时间戳为13位
  returnArr.push(date.getFullYear());
  returnArr.push(formatNumber(date.getMonth() + 1));
  returnArr.push(formatNumber(date.getDate()));

  returnArr.push(formatNumber(date.getHours()));
  returnArr.push(formatNumber(date.getMinutes()));
  returnArr.push(formatNumber(date.getSeconds()));

  for (var i in returnArr) {
    format = format.replace(formateArr[i], returnArr[i]);
  }
  return format;
}

const parseParams = (uri, params) => {
  const paramsArray = []
  Object.keys(params).forEach(key => {
    paramsArray.push(`${key}=${params[key]}`)
  })
  if (uri.search(/\?/) === -1) {
    uri += `?${paramsArray.join('&')}`
  } else {
    uri += `&${paramsArray.join('&')}`
  }
  return uri
}

module.exports = {
  formatTime: formatTime,
  formatTimeTwo: formatTimeTwo,
  formatDate: formatDate,
  uploadImageOne,
  parseParams,
  Calc,
  tipWithOpenPage,
  throttle
}

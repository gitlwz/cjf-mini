const encodeKey = 'encodedData'

/**
 * 编码，防止参数中含？，&字符导致解析出错
 * @param {object} data
 */
function encode(data) {
  // json序列化参数传递，确保参数类型被保留
  return encodeURIComponent(JSON.stringify(data));
}

/**
 * 解码参数
 * @param {object} code
 */
function decode(code) {
  return JSON.parse(decodeURIComponent(code));
}

/**
 * 处理参数拼接
 * @param {object} obj
 */
function querify(obj) {
  return Object.keys(obj).map((k) => {
    const v = obj[k];
    return `${k}=${v}`;
  }).join('&');
}

/**
 * 跳转页面
 * url: 页面路径，注意，路径需以“/”开头,如，'/pages/index/index'
 * data: 编码数据
 * query: 非编码数据，数据不进行编码和json序列化，会转换成string类型，丢失参数类型
 * success：页面跳转成功回调
 * fail：页面跳转失败回调
 * fail：页面跳转失败回调
 * complete：页面跳转结束的回调函数（调用成功、失败都会执行）
 * isTab：是否跳转tab页面
 * @param {object} routeObj { url, data, success, fail, complete, isTab }
 */
function forward(routeObj = {}, isReplace = false) {
  const {
    url, data, query, success, fail = () => console.log('跳转失败，请检查页面路径'), complete, isTab = false
  } = routeObj;
  const queryData = query || {};
  let pageUrl = url || ''
  if (!pageUrl) {
    throw new Error('路由路径不能为空');
  }
  if (data) {
    queryData[encodeKey] = encode(data);
  }
  if (!isTab) {
    pageUrl += `?${querify(queryData)}`;
  }
  const opt = {
    url: pageUrl,
    success,
    fail,
    complete,
  };
  if (isReplace) {
    wx.redirectTo(opt);
    return;
  }
  if (isTab) {
    wx.switchTab(opt);
  } else {
    wx.navigateTo(opt);
  }
}

/**
 * 跳转页面，屏蔽tab页跳转和普通页面跳转差异（tab页面跳转，需要在option中添加）
 * @param {object} option
 */
function push(option) {
  return forward.call(this, option);
}

/**
 * 替换当前页面
 * @param {object} option
 */
function replace(option) {
  return forward.call(this, option, true);
}

/**
 * 页面返回
 * option可以指定delta属性指定需要返回几层
 */
function pop(option) {
  wx.navigateBack(option);
}

/**
 * 关闭所有页面，打开到应用内的某个页面
 * @param {object} routeObj { url, data, success, fail, complete, isTab }
 */
function relaunch(routeObj = {}) {
  const {
    url, data, query, success, fail = () => console.log('跳转失败，请检查页面路径'), complete, isTab
  } = routeObj;
  const queryData = query || {};
  let pageUrl = url || ''
  if (!pageUrl) {
    throw new Error('路由路径不能为空');
  }
  if (data) {
    queryData[encodeKey] = encode(data);
  }
  if (!isTab) {
    pageUrl += `?${querify(queryData)}`;
  }
  wx.reLaunch({
    url: pageUrl,
    success,
    fail,
    complete,
  });
}

/**
 * 跳转页面后调用此方法获取解析参数
 * @param {object} option
 */
function parseQuery(option = {}) {
  const data = option[encodeKey];
  if (data) {
    return decode(data);
  }
  return null;
}

module.exports = {
  push,
  replace,
  pop,
  relaunch,
  parseQuery,
};

import request from '../utils/network/request.js'

/**
 * 获取首页轮播图
 * @param data
 * @returns {*}
 */
export function getIndexBanner(data) {
  return request.get('recyclecover/viewlist', data);
}

/**
 * 获取首页通知
 * @param data
 * @returns {*}
 */
export function getIndexNotices() {
  return request.get('publicnotice/home');
}


/**
 * 获取首页大咖观点数据
 * @param data
 * @returns {*}
 */
export function getBignamePointNew() {
  return request.get('bignamepoint/home');
}

/**
 * 获取首页蛋价视点数据
 * @param data
 * @returns {*}
 */
export function getEggPriceViewNew() {
  return request.get('eggpriceview/home');
}


/**
 * 获取首页蛋业新闻数据
 * @param data
 * @returns {*}
 */
export function getEggNew() {
  return request.get('eggnews/home');
}

/**
 * 获取大咖观点数据带分页
 * @param data
 * @returns {*}
 */
export function getBignamePointNews(data) {
  return request.post('bignamepoint/info', data);
}

/**
 * 获取蛋价视点数据带分页
 * @param data
 * @returns {*}
 */
export function getEggPriceViewNews(data) {
  return request.post('eggpriceview/info', data);
}


/**
 * 获取蛋业新闻数据带分页
 * @param data
 * @returns {*}
 */
export function getEggNews(data) {
  return request.post('eggnews/info', data);
}

export function getBignamePointCover() {
  return request.post('bignamepoint/cover');
}

export function getEggPriceViewNewCover() {
  return request.post('eggpriceview/cover');
}

export function getEggNewCover() {
  return request.post('eggnews/cover');
}

/**
 * 获取新闻详情
 * @param data
 * @returns {*}
 */
export function getNewDetails(data) {
  return request.get('bignamepoint/findbyid', data);
}

/**
 * 登录
 * @param data
 * @returns {*}
 */
export function login(data) {
  return request.post('sso/login', data);
}

/**
 * 获取验证码
 * @param data
 * @returns {*}
 */
export function getCode() {
  return request.get('sso/verifycode');
}

/**
 * get请求 获取token 和验证码字符
 * @param data
 * @returns {*}
 */
export function getOauthCode() {
  return request.get('oauth/verifycode');
}

/**
 * 注册
 * @param data
 * @returns {*}
 */
export function register(data) {
  return request.post('oauth/registry', data);
}
/**
 * 忘记密码
 * @param data
 * @returns {*}
 */
export function forget(data) {
  return request.post('oauth/resetpassword', data);
}
/**
 * 获取资料上传页面info
 * @param data
 * @returns {*}
 */
export function info() {
  return request.get('client/info');
}
/**
 * 资料上传页面提交
 * @param data
 * @returns {*}
 */
export function commit(data) {
  return request.post('client/commit', data);
}
/**
 * 提交留言
 * @param data
 * @returns {*}
 */
export function message(data) {
  return request.post('messageboard/save', data);
}
/**
 * 企业经营
 * @param data
 * @returns {*}
 */
export function enterpriseoperation() {
  return request.get('enterpriseoperation/info');
}
/**
 * 企业品牌
 * @param data
 * @returns {*}
 */
export function enterprisebrand() {
  return request.post('enterprisebrand/info');
}
/**
 * 企业文化宣传
 * @param data
 * @returns {*}
 */
export function enterpriseculturepropaganda() {
  return request.post('enterpriseculturepropaganda/info');
}
/**
 * 细分管理
 * @param data
 * @returns {*}
 */
export function enterprisesegment() {
  return request.get('enterprisesegment/info');
}
/**
 * 合同列表
 * @param data
 * @returns {*}
 */
export function contractlist(data) {
  return request.post('clientcontract/self',data);
}
/**
 * 合同详情
 * @param data
 * @returns {*}
 */
export function contractdetail(data) {
  return request.post('clientcontract/findbyid', data);
}

/**
 * 合同K线
 * @param data
 * @returns {*}
 */
export function clientcontractChart(data) {
  return request.post('clientcontract/chart', data);
}
/**
 * 标的合约
 * @param data
 * @returns {*}
 */
export function instrument() {
  return request.post('quotecompany/instrument');
}
/**
 * 查询合约期货价格
 * @param data
 * @returns {*}
 */
export function calculaterate(data) {
  return request.post('eggpricetreasure/calculaterate', data);
}
/**
 * 行情-蛋价保-计算波动率
 * @param data
 * @returns {*}
 */
export function instrumentprice() {
  return request.get('eggpricetreasure/findinstrumentprice');
}

/**
 * 行情-智慧蛋-现期货价格的季节性分析表格
 * @param data
 * @returns {*}
 */
export function futurespotchg(data) {
  return request.post('spotdata/futurespotchg', data);
}

/**
 * 行情-智慧蛋-现期货价格的季节性分析
 * @param data
 * @returns {*}
 */
export function futurespotprice(data) {
  return request.post('spotdata/futurespotprice', data);
}

/**
 * 行情-智慧蛋-现货价格的稳定性分析
 * @param data
 * @returns {*}
 */
export function priceconstancy(data) {
  return request.post('spotdata/priceconstancy', data);
}

/**
 * 行情-智慧蛋-拥堵指数
 * @param data
 * @returns {*}
 */
export function congestindexdataChart(data) {
  return request.post('congestindexdata/chart', data);
}

/**
 * 行情-智慧蛋-饲料行情
 * @param data
 * @returns {*}
 */
export function feedindexdataChart(data) {
  return request.post('feedindexdata/chart', data);
}

/**
 * 行情-智慧蛋-基差
 * @param data
 * @returns {*}
 */
export function futuredataBasis(data) {
  return request.post('futuredata/basis', data);
}

/**
 * 行情-智慧蛋-滞后相关
 * @param data
 * @returns {*}
 */
export function futuredataCorrelation(data) {
  return request.post('futuredata/correlation', data);
}

/**
 * 报价计时器的计算
 * @param data
 * @returns {*}
 */
export function calculateoption(data) {
  return request.post('eggpricetreasure/calculateoption',data);
}
/**
 * 查询所有公司
 * @param data
 * @returns {*}
 */
export function company() {
  return request.post('quotecompany/company');
}
/**
 * 查询合约
 * @param data
 * @returns {*}
 */
export function companyInstrument(data) {
  return request.get('eggpricetreasure/findbycompanyid',data);
}
/**
 * 提交保价需求
 * @param data
 * @returns {*}
 */
export function submitNeed(data) {
  return request.post('eggpricetreasureinsure/save', data);
}
/**
 * 提交需求页面合同列表
 * @param data
 * @returns {*}
 */
export function needInfo(data) {
  return request.post('eggpricetreasureinsure/self', data);
}
/**
 * 删除保价单
 * @param data
 * @returns {*}
 */
export function deleteself(data) {
  return request.get('eggpricetreasureinsure/deleteself', data);
}
/**
 * 蛋融通列表页
 * @param data
 * @returns {*}
 */
export function eggFusion(data) {
  return request.post('eggproductfinance/page', data);
}
/**
 * 短信验证码
 * @param data
 * @returns {*}
 */
export function messagecode(data) {
  return request.get('oauth/smsverifycode', data);
}
/**
 * 首页交易所信息
 * @param data
 * @returns {*}
 */
export function companyhome() {
  return request.get('eggpricetreasure/home');
}
/**
 * 交割库首页
 * @param data
 * @returns {*}
 */
export function deliverystore(data) {
  return request.post('deliveryhouse/home', data);
}

/**
 * 交割知识
 * @param data
 * @returns {*}
 */
export function deliveryknowledge(data) {
  return request.post('deliveryknowledge/home', data);
}

/**
 * 交割知识详情页
 * @param data
 * @returns {*}
 */
export function deliveryknowledgeFindById(data) {
  return request.get('deliveryknowledge/findbyid', data);
}
/**
 * 交割流程
 * @param data
 * @returns {*}
 */
export function deliveryflow() {
  return request.post('deliveryflow/latestone');
}
/**
 * 交割仓库详情
 * @param data
 * @returns {*}
 */
export function deliverystoredetail(data) {
  return request.get('deliveryhouse/findbyid',data);
}

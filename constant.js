// 合约状态
 const contractState = {
  COMPLETE: '1',
  NOT_COMPLETE: '0'
}
//保价方向
const insureDirection={
  BUY: '0',
  SELL: '1'
}
//保价需求方案状态
const planStatus = {
  unSet: '0',
  hasSet: '1'
}
module.exports = {
  contractState,
  insureDirection,
  planStatus
}
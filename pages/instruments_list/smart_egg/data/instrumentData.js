const SPOT_ADDRESS = [{
    value: 'da_yang_road',
    name: "大洋路"
  }, {
    value: 'shi_men',
    name: "石门"
  }, {
    value: 'hui_long_guan',
    name: "回龙观"
  }, {
    value: 'dong_guan',
    name: "东莞"
  },
  {
    value: 'guang_zhou',
    name: "广州"
  }, {
    value: 'egg_league',
    name: "禽蛋联盟"
  }, {
    value: 'egg_trader_federal',
    name: "蛋商联合会"
  }, {
    value: 'egg_federal',
    name: "禽蛋联合会"
  },
  {
    value: 'zheng_zhou',
    name: "郑州"
  }, {
    value: 'shang_qiu',
    name: "商丘"
  }, {
    value: 'kai_feng',
    name: "开封"
  }, {
    value: 'luo_yang',
    name: "洛阳"
  },
  {
    value: 'shi_jia_zhuang',
    name: "石家庄"
  }, {
    value: 'bao_ding',
    name: "保定"
  }, {
    value: 'cang_zhou',
    name: "沧州"
  }, {
    value: 'xin_ji',
    name: "辛集"
  },
  {
    value: 'guan_tao',
    name: "管陶"
  }, {
    value: 'ji_nan',
    name: "济南"
  }, {
    value: 'lai_yang',
    name: "莱阳"
  }, {
    value: 'qing_dao',
    name: "青岛"
  },
  {
    value: 'lin_yi',
    name: "临沂"
  }, {
    value: 'liao_cheng',
    name: "聊城"
  }, {
    value: 'de_zhou',
    name: "德州"
  }, {
    value: 'jin_cheng',
    name: "晋城"
  },
  {
    value: 'lv_liang',
    name: "吕梁"
  }, {
    value: 'ji_shan',
    name: "稷山"
  }, {
    value: 'da_lian',
    name: "大连"
  }, {
    value: 'chao_yang',
    name: "朝阳"
  },
  {
    value: 'jin_zhou',
    name: "锦州"
  }, {
    value: 'liao_zhong',
    name: "辽中"
  }, {
    value: 'su_zhou',
    name: "宿州"
  }, {
    value: 'fu_yang',
    name: "阜阳"
  },
  {
    value: 'xi_shui',
    name: "浠水"
  }, {
    value: 'xin_zhou',
    name: "新洲"
  }, {
    value: 'sale_area',
    name: "销区"
  }, {
    value: 'product_area',
    name: "产区"
  },
]

const JAM_ADDRESS = [{
  value: 'dayang_road',
  name: "大洋路"
}, {
  value: 'shi_men',
  name: "石门"
}]
const FEED_ADDRESS = [{
  value: 'dalian',
  name: "辽宁大连"
}, {
  value: 'xishui',
  name: "湖北浠水"
}, {
  value: 'shunyi',
  name: "北京顺义"
}]

const DELIVERY_MONTH = [{
    value: 'index_price',
    name: "指数价格"
  }, {
    value: 'january_price',
    name: "1月交割价"
  }, {
    value: 'february_price',
    name: "2月交割价"
  },
  {
    value: 'march_price',
    name: "3月交割价"
  }, {
    value: 'april_price',
    name: "4月交割价"
  }, {
    value: 'may_price',
    name: "5月交割价"
  }, {
    value: 'june_price',
    name: "6月交割价"
  },
  {
    value: 'july_price',
    name: "7月交割价"
  }, {
    value: 'august_price',
    name: "8月交割价"
  }, {
    value: 'september_price',
    name: "9月交割价"
  }, {
    value: 'october_price',
    name: "10月交割价"
  },
  {
    value: 'november_price',
    name: "11月交割价"
  }, {
    value: 'december_price',
    name: "12月交割价"
  }]

const DELAY_DAYS_ARRAY = ['7', '14', '21', '28', '35', '42', '49', '56', '63', '70', '77', '84', '91', '98', '105', '112', '119', '126', '133', '140', '147', '154', '161', '168', '180','210','240','270','300','330','360']
const NO_DATA_TYPE = { SUCCESS_HAVE_DATA: 1, SUCCESS_NO_DATA:2, ERROR_NO_DATA: 3}
module.exports = {
  FEED_ADDRESS,
  JAM_ADDRESS,
  SPOT_ADDRESS,
  DELIVERY_MONTH,
  DELAY_DAYS_ARRAY,
  NO_DATA_TYPE
};

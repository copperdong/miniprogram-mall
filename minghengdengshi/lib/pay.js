// 四舍五入
function to_fixed(num, d) {
  return (Math.round(num * Math.pow(10, d)) / Math.pow(10, d)).toFixed(d)
}
//计算总价
let calTotalPrice = (goodsList) => {
  let freightPrice = 0.0;
  let checkedCount = 0;
  let checkedAmount = 0.0;   // 被选中商品总价
  if (goodsList.length == 0) {
    return {
      checkedCount: checkedCount,
      checkedAmount: checkedAmount, // 
      freightPrice: freightPrice    // 运费
    }
  }
  freightPrice = 10.0;  // 默认10元运费
  for (let i in goodsList) {
    var goods = goodsList[i];
    if (goods.checked) {
      checkedCount += goods.number
      checkedAmount += goods.price * goods.number;
    }
  }
  // 考虑运费，满99包邮
  /*
  if (checkedAmount >= 99) {
    freightPrice = 0.0
  }
  */
  freightPrice = 0.0;
  checkedAmount += freightPrice  // 加上运费
  // 保留小数点两位
  checkedAmount = to_fixed(checkedAmount, 2)
  return {
    checkedCount: checkedCount,
    checkedAmount: checkedAmount, // 
    freightPrice: freightPrice    // 运费
  }
}

// 微信支付
function weChatPay(param, cbs, cbe) {
  let goodsList = param.goods_list;
  let desc = "";  // 商品名称
  for (let i in goodsList) {
    desc += goodsList[i].name + " "
  }
  if (desc.length > 10) {
    desc = desc.slice(0, 10) + "等"; /**显示10个字 */
  }
  // 测试支付金额
  let totalCost = param.price;               // 支付金额
  let merchandiseDescription = desc;         // 描述内容
  let merchandiseSchemaID = "68907";         // 订单表tableID，请填写您的orders订单表ID
  let merchandiseRecordID = param._id;       // 订单ID 
  let payParams = {
    totalCost,
    merchandiseDescription,
    merchandiseSchemaID,
    merchandiseRecordID  // 付款对应的那条记录，在这里，它是当前用户注册的记录，完成支付后，在后台订单页就可以看到对应关系
  }
  // 直接调用知晓云支付接口
  wx.BaaS.pay(payParams).then(res => {
    // 支付成功
    cbs(res);
  }, err => {
    cbe(err);
  })
}

// 订单支付
let payOrder = (param, cbs, cbe) => {
  weChatPay(param,
    function (res) {
      //支付成功
      cbs(res)
    }, function (err) {
      if (err.code === 603) {
        wx.openSetting()
      }
      cbe(err)
    });
}

module.exports = {
  calTotalPrice,   // 计算总价
  payOrder,        // 订单支付
}

import cart from "./cart.js"

var orderKey = "orderResult";
//下单
let saveOrder = (param, cbs, cbe) => {
  //保存到缓存中
  var orderResult = param;
  wx.setStorage({
    key: orderKey,
    data: orderResult
  })
  cbs({})
}

//获取订单缓存
let getCheckoutInfo = (param, cbs, cbe) => {
  wx.getStorage({
    key: orderKey,
    success: res => {
      cbs(res.data)
    },
    fali: err => {
      cbe(err)
    }
  })
}

import pay from "pay.js"
import coupon from "coupon.js"
var orders = new wx.BaaS.TableObject("orders");
// 随机数
let getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
/** 生成订单的编号order_sn 
 * 根据当前日期+随机数生成订单
*/
let generateOrderNumber = () => {
  const date = new Date();
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  const rn = getRandomNumber(100000, 999999); // 保证随机数6位数
  return [year, month, day, hour, minute, second, rn].map(formatNumber).join('');
}
//确认订单并付款
let submitOrder = (param, cbs, cbe) => {
  // 改变用户优惠卷状态
  coupon.useCoupon(param.coupon_id, function (res) {
    param.order_sn = generateOrderNumber(); //生成订单号
    let order = orders.create();  //创建一条记录
    order.set(param).save().then(retOrder => {
      ////清除下单的商品
      cart.deleteCheckedGoods(param.goods_list);
      let dataOrder = retOrder.data
      // 支付
      pay.payOrder(dataOrder, function (res) {
        let myOrder = orders.getWithoutData(dataOrder._id)
        // 订单更为待发货
        myOrder.set("pay_status", 2).update().then(res2 => {
          cbs(dataOrder)
        }, err => {
          cbe(dataOrder)
        })
      }, function (err) {
        cbe(dataOrder);
      })
    }, err => {
      cbe(param)
    })
  }, function (err) {
    cbe(param)
  });
}



module.exports = {
  saveOrder,        // 保存订单
  getCheckoutInfo,  // 从缓存中读取订单信息
  submitOrder,      // 提交订单
}


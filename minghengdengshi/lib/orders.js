import util from '../utils/util'
import pay from "./pay.js"
import user from "./user.js"
var orders = new wx.BaaS.TableObject("orders");
var comments = new wx.BaaS.TableObject("comments");

// 订单状态显示文本
// 1:待付款 2：已取消 3：支付 | 待收货 4: 已完成 5: 售后中 6: 已退款
var orderStatusText = [
  {
    "status": "",
    "cancel": "",   // 是否取消
    "pay": ""        // 是否支付或退款
  },
  {
    "status": "待付款",
    "cancel": "取消订单",
    "pay": "去付款"
  },
  {
    "status": "待发货",
    "cancel": "取消订单",
    "pay": ""
  },
  {
    "status": "待收货",
    "cancel": "确认收货",
    "pay": ""
  },
  {
    "status": "已完成",
    "cancel": "",
    "pay": "申请售后"  //已支付和已完成的情况下
  },
  {
    "status": "售后中",
    "cancel": "",
    "pay": "取消售后"
  },
  {
    "status": "交易关闭",
    "cancel": "",
    "pay": ""
  },
  {
    "status": "已取消",
    "cancel": "",
    "pay": ""
  },
];
//获取用户的订单列表
let getOrderList = (ctx, cbs, cbe) => {
  var userid = wx.BaaS.storage.get('uid').toString();
  if (!userid) { // 没有用户登录信息
    cbe()
    return
  }
  var query = new wx.BaaS.Query()
  query.compare('user_id', '=', userid)
  orders.setQuery(query).orderBy('-updated_at').find()  //创建日期排序
    .then(res => {
      let objects = res.data.objects;
      for (let i in objects) { /* 将订单状态转换为文本 */
        objects[i].orderStatusText = orderStatusText[objects[i].pay_status].status;
      }
      cbs(objects)
    })
    .catch(err =>
      cbe(err)
    )
}
//获取订单详细列表
let getOrderDetail = (id, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('id', '=', id)
  orders.setQuery(query).find()
    .then(data => {
      if (data.data.objects.length > 0) {
        let res = data.data.objects[0];
        // 时间显示
        var date = new Date(parseInt(res.created_at) * 1000);
        //var date = date.toLocaleString().replace(/:\d{1,2}$/, ' ');
        date = util.formatTime(date); //转换时间格式
        res.create_time = date;
        let orderStatus = orderStatusText[res.pay_status];
        res.pay_status_text = orderStatus.status;
        res.order_status_text1 = orderStatus.cancel;
        res.order_status_text2 = orderStatus.pay;
        cbs(res)
      } else {
        cbe("no data")
      }
    })
    .catch(err =>
      cbe(err)
    )
}
//支付成功订单
let payOrder = (id, cbs, cbe) => {
  //更新订单状态，待发货状态
  let myOrder = orders.getWithoutData(id)
  myOrder.set("pay_status", 2).update().then(res => {
    cbs(res)
  }, err => {
    cbe(err)
  })
}
//取消订单
let cancelOrder = (id, cbs, cbe) => {
  //更新订单状态
  let myOrder = orders.getWithoutData(id)
  myOrder.set("pay_status", 7).update().then(res => {
    cbs(res)
  }, err => {
    cbe(err)
  })
}
// 确认收货
let confirmOrder = (orderInfo, cbs, cbe) => {
  //更新订单状态
  let myOrder = orders.getWithoutData(orderInfo.id)
  // 更改为已完成
  myOrder.set("pay_status", 4).update().then(res => {
    // 添加用户待评价商品
    let goods_list = orderInfo.goods_list;
    user.getUserInfo(null, function (userinfo) {
      console.log(userinfo)
      for (let i in goods_list) {
        let record = {
          "order_id": orderInfo.id,          // 订单ID
          // 商品信息
          "goods_id": goods_list[i].id.toString(),
          "goods_name": goods_list[i].name,
          "goods_url": goods_list[i].cover,
          // 用户信息
          "user_id": userinfo.id.toString(),
          "user_name": userinfo.nickname,
          "user_avatar": userinfo.avatar,
          // 评价状态
          "status": 0    // 评价状态:待评价
        }
        console.log(record);
        let com = comments.create();  //创建一条记录
        com.set(record).save().then(res => {
        }, err => {
          cbe(err)
        })
      }
      cbs(res)
    }, function(err) {
      cbe(err)
    })
  }, err => {
    cbe(err)
  })
}
//售后申请
let refundOrder = (id, cbs, cbe) => {
  //更新订单状态
  let myOrder = orders.getWithoutData(id)
  myOrder.set("pay_status", 5).update().then(res => {
    cbs(res)
  }, err => {
    cbe(err)
  })
}

module.exports = {
  getOrderList,    // 获取用户订单列表
  getOrderDetail,  // 获取订单详情
  payOrder,        //支付成功订单
  cancelOrder,     // 取消订单
  confirmOrder,    // 确认收货
  refundOrder      // 申请售后
}

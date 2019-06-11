import util from '../utils/util'

var coupon = new wx.BaaS.TableObject('coupon');
var userCoupon = new wx.BaaS.TableObject('user_coupon');
var userCouponKey = "userCoupon";

// 从缓存中读取用户优惠卷
let getStorageUserCoupon = () => {
  let ret = wx.getStorageSync(userCouponKey);
  if (!ret) {
    return [];
  }
  return ret
}
// 获取最新的优惠卷信息
// param：用户领取过的优惠卷
let getNewCoupon = (param, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('status', '=', 1) //查询有效优惠卷
  coupon.setQuery(query).find()
    .then(res => {
      const data = res.data.objects;
      // 判断用户是否领取过
      for (let i in data) {
        let id = data[i].id;
        let received = 0;
        // 查询是否领取过
        for (let j in param) {
          if (id == param[j].coupon_id) {
            received = 1; // 领取过
            break;
          }
        }
        data[i].received = received; // 是否领取过
      }
      cbs(data) //成功回调函数
    })
    .catch(err =>
      cbe(err) //失败回调函数
    )
}
// 获取用户优惠卷
let getUserCoupon = (param, cbs, cbe) => {
  let userInfo = wx.getStorageSync("userInfo");
  if (!userInfo) { // 没有用户登录信息
    //("用户未登录")
    cbs([])
    return
  }
  // 查询用户已领取的优惠卷
  var query = new wx.BaaS.Query()
  query.compare('user_id', '=', userInfo.id.toString()); //查询用户有效优惠卷
  userCoupon.setQuery(query).find()
    .then(res => {
      const data = res.data.objects;
      for (let i in data) {
        let time = data[i].start_time.toString().slice(0, 10);
        data[i].start_time_txt = time;
        time = data[i].end_time.toString().slice(0, 10);
        data[i].end_time_txt = time;
      }
      wx.setStorageSync(userCouponKey, data); // 保存用户优惠卷列表
      cbs(data);
    })
    .catch(err =>
      cbe(err) //失败回调函数
    )
}
// 获取优惠卷
let getCoupon = (param, cbs, cbe) => {
  // 先获取用户优惠卷
  getUserCoupon(param, function (res) {
    getNewCoupon(res, cbs, cbe);  //获取最新优惠卷
  }, function (err) {
    cbe(err) //失败回调函数
  })
}
// 领取优惠卷
let receiveCoupon = (param, cbs, cbe) => {
  let userInfo = wx.getStorageSync("userInfo");
  if (!userInfo) { // 没有用户登录信息
    cbe("用户未登录")
    return
  }
  let record = {
    "user_id": userInfo.id.toString(),      // 用户ID
    "coupon_id": param.id,
    "status": 0,       // 优惠卷0:未使用,1:已使用，2：已失效
    "type": param.type, // 优惠卷类型
    "amount": param.amount,
    "discount": param.discount,
    "start_time": param.start_time,
    "end_time": param.end_time
  }
  let order = userCoupon.create();  //创建一条记录
  order.set(record).save().then(res => {
    // 获取用户优惠卷，并存入缓存
    getUserCoupon(param, function (res) {
    }, function (err) {
    })
    cbs(res)
  }, err => {
    cbe("")
  })
}
// 根据支付价格判断优惠卷是否可用
let getAvailableCoupon = (checkedAmount) => {
  let couponList = getStorageUserCoupon();
  let maxIndex = -1;
  let maxDiscount = 0.0;
  let nowTime = new Date();  // 当前时间
  // 获取最大优惠金额
  let newCouponList = []
  for (let i in couponList) {
    if (couponList[i].type == 1) {  // 满减优惠卷
      couponList[i].available = 0; // 当前优惠卷不可用
      if (couponList[i].status == 0) {  // 未使用且为未过期
        if (couponList[i].amount < checkedAmount) {
          couponList[i].available = 1; // 当前优惠卷可用
          // 满足消费金额
          if (couponList[i].discount > maxDiscount) {
            maxDiscount = couponList[i].discount;
            maxIndex = newCouponList.length;  // 指向新的列表
          }
        }
        newCouponList.push(couponList[i]);
      } else if (couponList[i].status == 1) {  // 已使用
        couponList[i].available = 2; // 当前优惠卷已使用
      } else if (couponList[i].status == 2) {  // 已过期
        couponList[i].available = 3; // 当前优惠卷已过期
      }
    }
  }
  return {
    "couponList": newCouponList,
    "couponIndex": maxIndex
  }
}
// 使用优惠卷
let useCoupon = (id, cbs, cbe) => {
  if (id == "") {
    cbs();  //不需要优惠卷
    return;
  }
  //更新状态
  let myCoupon = userCoupon.getWithoutData(id)
  myCoupon.set("status", 1).update().then(res => {
    cbs(res)
  }, err => {
    cbe(err)
  })
}

module.exports = {
  //getStorageUserCoupon,   // 从缓存中读取用户的优惠卷
  getUserCoupon,          // 获取用户的优惠卷
  getAvailableCoupon,     // 根据商品价格，获取可用优惠卷
  getCoupon,              // 获取优惠卷，包括新优惠卷
  receiveCoupon,          // 用户领取优惠卷
  useCoupon               // 使用优惠卷
}

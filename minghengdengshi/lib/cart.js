import pay from "./pay.js"  // 支付模块
var cartKey = "cartResult"
// 加入购物车
let addToCart = (param, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey) || [];
  var flag = true
  for (var i = 0; i < cartResult.length; i++) {
    let cr = cartResult[i]
    // 是否有相同的商品，同一ID并且规格一样
    if (cr.id == param.id &&
      cr.specifition == param.specifition) {
      cartResult[i].number += param.number;
      flag = false
      break;
    }
  }
  if (flag) {
    // 如果是新产品，则加入购物车
    cartResult.push(param);
  }
  wx.setStorage({
    key: cartKey,
    data: cartResult
  })
  cbs({})
}

//获取购物车商品数量
let getCounter = (param, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey) || [];
  cbs(cartResult.length)
}

// 从购物车缓存中读取商品
let getCartList = (param, cbs, cbe) => {
  wx.getStorage({
    key: cartKey,
    success: res => {
      var data = {}
      data.cartList = res.data; // 商品列表
      //计算总价
      let ret = pay.calTotalPrice(data.cartList);   // 计算总价
      data.checkedGoodsCount = ret.checkedCount;    // 选择商品的总数
      data.checkedGoodsAmount = ret.checkedAmount;  // 总价
      cbs(data)
    },
    fali: err => {
      cbe(err)
    }
  })
}

//清除下单的商品
let deleteCheckedGoods = (goods_list, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey);
  for (let i in goods_list) {
    for (let j in cartResult) {
      if (cartResult[j].id == goods_list[i].id && 
          cartResult[j].specifition == goods_list[i].specifition) { 
        cartResult.splice(j, 1);   //删除链表中的元素
      }
    }
  }
  //写回购物车
  wx.setStorageSync(cartKey, cartResult);
}

//更改商品数目
let updateCartCount = (param, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey) || [];
  cartResult[param.index].number = param.number; //更新数量
  //写回购物车
  wx.setStorageSync(cartKey, cartResult);
  cbs(cartResult)
}
//更新商品选中状态
let updateCartChecked = (index, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey) || [];
  cartResult[index].checked = !cartResult[index].checked; //状态取反
  //写回购物车
  wx.setStorageSync(cartKey, cartResult);
  cbs(cartResult)
}
//更新商品全选选中
let updateCartAllChecked = (checked, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey) || [];
  for (let i in cartResult) {
    cartResult[i].checked = checked; //更新状态
  }
  //写回购物车
  wx.setStorageSync(cartKey, cartResult);
  cbs(cartResult)
}
//删除商品
let deleteGoods = (index, cbs, cbe) => {
  let cartResult = wx.getStorageSync(cartKey);
  cartResult.splice(index, 1);   //删除链表中的元素
  //写回购物车
  wx.setStorageSync(cartKey, cartResult);
  cbs(cartResult)
}

module.exports = {
  addToCart,                // 将商品加入购物车中
  getCounter,               // 统计购物车中商品数量总数
  getCartList,              // 读取购物车缓存中商品
  updateCartCount,          // 更新商品数量
  updateCartChecked,        // 更新商品是否选中状态
  updateCartAllChecked,     // 全选商品
  deleteGoods,              // 删除商品
  deleteCheckedGoods,       //清除下单的商品
}




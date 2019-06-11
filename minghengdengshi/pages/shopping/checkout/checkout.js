// pages/shopping/checkout/checkout.js
import shopping from '../../../lib/shopping'
import pay from '../../../lib/pay'
import address from '../../../lib/address'
import user from '../../../lib/user'
import coupon from '../../../lib/coupon'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    checkedGoodsList: [],       // 商品列表
    checkedAddress: null,       // 地址,
    goodsTotalPrice: 0.00,      // 商品总价
    freightPrice: 0.00,         // 运费
    actualPrice: 0.00,          // 实际需要支付的总价
    marks: "备注",              // 备注
    /* 优惠卷对话框 */
    openAttr: false,            // 是否打开优惠卷对话框
    couponList: [],             // 用户优惠卷
    selectedCouponIndex: -1,    // 选择的优惠卷
    selectedCouponText: "*",    // 选择的优惠卷文本
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();
  },
  // 获取下单信息
  getCheckoutInfo: function () {
    let that = this;
    // 获取地址
    address.getAddress(that, function (res) {
      that.setData({
        checkedAddress: res,
      });
    }, function (err) {
      console.log(err);
    });

    // 获取商品信息
    shopping.getCheckoutInfo(that, function (cartList) {
      //计算总价
      let price = pay.calTotalPrice(cartList);
      // 获取优惠卷，并且判断是否可用
      let availCoupon = coupon.getAvailableCoupon(price.checkedAmount);
      that.setData({
        couponList: availCoupon.couponList,
        selectedCouponIndex: availCoupon.couponIndex,   // 优惠最大的卷
        selectedCouponText: availCoupon.couponIndex == -1 ? "无可用" : "有可用"
      });
      // 根据优惠券，再次计算价格
      let actualPrice = price.checkedAmount;  // 商品总价
      if (availCoupon.couponIndex != -1) {
        let discount = availCoupon.couponList[availCoupon.couponIndex].discount; // 优惠金额
        actualPrice -= discount  // 减去优惠卷
        that.setData({
          selectedCouponText: "-" + discount
        });
      }
      // 更新支付显示数据
      that.setData({
        checkedGoodsList: cartList,            // 商品列表
        goodsTotalPrice: price.checkedAmount,  // 商品总价
        freightPrice: price.freightPrice,      // 运费
        actualPrice: actualPrice,       // 实付
      });
      wx.hideLoading();
    }, function (err) {
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shopping/address/address',
    })
  },
  bindinputMarks(event) {
    this.setData({
      marks: event.detail.value
    });
  },
  //去付款
  submitOrder: function (e) {
    let that = this;
    if (!that.data.checkedAddress) {
      wx.showToast({
        title: '请选择收货地址',
        image: '/static/images/icon_error.png'
      })
      return false;
    }
    let uid = user.getUid().toString();
    let desc = ""; // 商品描述
    for (let i in that.data.checkedGoodsList) {
      desc += that.data.checkedGoodsList[i].name + " "
    }
    if (desc.length > 10) {
      desc = desc.slice(0, 10) + "等"; /**显示10个字 */
    }
    let coupon_id = "";
    let discount = 0.0;
    if (that.data.selectedCouponIndex != -1) {
      coupon_id = that.data.couponList[that.data.selectedCouponIndex].id.toString();
      discount = that.data.couponList[that.data.selectedCouponIndex].discount;
    }
    let param = {
      // 用户信息
      user_id: uid,    //用户id
      // 收货信息
      username: that.data.checkedAddress.name,
      mobile: that.data.checkedAddress.mobile,
      address: that.data.checkedAddress.address,
      // 订单信息
      pay_status: 1,  //1：待支付 2：待发货 3：支付|待收货 4:已完成 5:售后中 6:交易关闭 7：已取消 
      // 支付信息
      total_price: parseFloat(that.data.goodsTotalPrice),  // 商品价格
      price: parseFloat(that.data.actualPrice),            // 支付价格
      freight_price: parseFloat(that.data.freightPrice),   // 运费
      // 优惠券
      coupon_id: coupon_id,
      discount: discount,
      // 商品信息
      goods_list: that.data.checkedGoodsList,
      goods_desc: desc,
      // 其他信息
      marks: that.data.marks  //备注
    }
    // 提交并支付
    shopping.submitOrder(param, function (res) {
      // 支付成功
      // 同时上报formId获取通知
      wx.BaaS.wxReportTicket(e.detail.formId)
      var orderId = res._id;  //订单号
      wx.hideLoading();
      wx.hideToast();
      setTimeout(() => {
        wx.showToast({
          title: '支付成功',
          duration: 2000,
          mask: true
        });
        setTimeout(() => {
          wx.hideToast();
          wx.navigateBack({
          })
        }, 2000)
      }, 500);
    }, function (err) {
      // 支付失败
      wx.BaaS.wxReportTicket(e.detail.formId)
      var orderId = err._id;  //订单号
      /*
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?id=' + orderId,
      })
      */
      wx.hideLoading();
      wx.hideToast();
      setTimeout(() => {
        wx.showToast({
          image: '/static/images/icon_error.png',
          title: '支付失败',
          duration: 2000,
          mask: true
        });
        setTimeout(() => {
          wx.hideToast();
          wx.navigateBack({
          })
        }, 2000)
      }, 500);
    })
  },
  // 打开优惠卷选择对话框
  openSelectedCoupon: function (e) {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeSelectedCoupon: function () {
    this.setData({
      openAttr: false,
    });
  },
  // 选择优惠券
  toggleCoupon: function (event) {
    let that = this;
    let couponIndex = event.currentTarget.dataset.index;
    if (that.data.couponList[couponIndex].status == 0 && that.data.couponList[couponIndex].available > 0) {
      let curCoupon = that.data.couponList[couponIndex]; // 当前选中的优惠卷
      let actualPrice = that.data.goodsTotalPrice;  // 商品总价
      actualPrice -= curCoupon.discount  // 减去优惠卷
      that.setData({
        selectedCouponIndex: couponIndex,
        selectedCouponText: "-" + curCoupon.discount.toString(),  // 显示优惠金额
        actualPrice: actualPrice,       // 实付
        openAttr: false,
      });
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
var app = getApp();
import orders from '../../lib/orders'
import pay from '../../lib/pay'
Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: 0,           // 订单ID
    orderInfo: {},
    orderGoods: [],       // 订单商品
    handleOption: {}
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.id
    });
    this.getOrderDetail();
  },
  // 获取订单详情
  getOrderDetail() {
    let that = this;
    orders.getOrderDetail(that.data.orderId, function(res) {
      that.setData({
        orderInfo: res,
        orderGoods: res.goods_list,
      });
    }, function(err) {
    });
  },
  // 取消订单
  cancelOrder() {
    let that = this;
    let res = that.data.orderInfo;
    //取消订单
    if (res.pay_status == 1 || res.pay_status == 2) {   //只有在待付款和待发货的情况下才能取消订单
      wx.showModal({
        title: '提示',
        content: '是否确认取消订单',
        success(res) {
          if (res.confirm) {
            orders.cancelOrder(that.data.orderId, function (res) {
              //返回上一页
              wx.navigateBack({});
            }, function (err) {
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }else if (res.pay_status == 3) {   //只有在待收货的情况下
      // 确认收货
      wx.showModal({
        title: '提示',
        content: '是否确认收货',
        success(res) {
          if (res.confirm) {
            orders.confirmOrder(that.data.orderInfo, function (res) {
              //返回上一页
              wx.navigateBack({});
            }, function (err) {
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
    else if (res.pay_status == 4) {   //只有在已完成的情况下才能去评价
      wx.navigateTo({
        url: "/pages/comment/comment",
      })
    }
  },
  // 去支付
  payOrder() {
    let that = this;
    let res = that.data.orderInfo;
    if (res.pay_status == 1) {   //只有在待支付的情况下支付
      pay.payOrder(that.data.orderInfo, function (res) {
        // 更改订单状态，待发货
        orders.payOrder(that.data.orderInfo, function (res) {
          //返回上一页
          wx.navigateBack({});
        }, function (err) {
        })
      }, function (err) {
      })
    } else if (res.pay_status == 3 || res.pay_status == 4) {   //已支付和已完成的情况下申请售后
      wx.showModal({
        title: '提示',
        content: '是否确认售后',
        success(res) {
          if (res.confirm) {
            orders.refundOrder(that.data.orderId, function (res) {
              //返回上一页
              wx.navigateBack({});
            }, function (err) {
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    }
  },
  // 回首页
  taggleHome: function(e) {
    wx.switchTab({
      url: '/pages/home/home',
    })
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
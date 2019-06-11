// pages/order/order.js
import orders from '../../lib/orders'
import comment from "../../lib/comment.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentTab: 0,       // 当前选择的订单状态
    orderListAll: [],    // 全部订单列表
    orderList: [],       // 显示订单列表
    commentList: [],     // 全部评价列表
    userStars: [
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      currentTab: options.index
    })
    that.getOrderList();
    that.getCommentList();
  },
  /*切换订单查看*/
  swichNav: function (e) {
    var that = this;
    if (that.data.currentTab === e.currentTarget.dataset.current) {
    } else {
      that.setData({
        currentTab: e.currentTarget.dataset.current
      })
      that.selectOrderList() // 更新列表显示
    }
  },
  // 获取订单
  getOrderList() {
    let that = this;
    orders.getOrderList(that, function (data) {
      that.setData({
        orderListAll: data  // 全部订单
      });
      that.selectOrderList();
      wx.stopPullDownRefresh();
    }, function (err) {
      wx.stopPullDownRefresh();
    })
  },
  // 更新渲染订单列表
  selectOrderList() {
    let that = this;
    let orderListAll = that.data.orderListAll;
    let currentTab = that.data.currentTab;
    if (currentTab == 0) { // 全部
      that.setData({
        orderList: orderListAll
      });
    } else {
      let orderList = []
      for (let i in orderListAll) {
        if (currentTab == orderListAll[i].pay_status) { // 根据导航栏过滤订单
          orderList.push(orderListAll[i])
        }
      }
      that.setData({
        orderList: orderList
      });
    }
  },
  // 获取用户评价列表
  getCommentList: function () {
    let that = this;
    // 用户处于登录状态才能访问
    if (that.data.userLogin == false) {
      return;
    }
    comment.getCommentList(that,
      function (res) {
        that.setData({
          commentList: res
        })
      },
      function (err) {
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
    this.getOrderList();
    this.getCommentList();
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
    this.getOrderList();
    this.getCommentList();
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
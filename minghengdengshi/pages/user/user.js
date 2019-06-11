// pages/user/user.js
import user from '../../lib/user'
import util from "../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      nickname: '点击登录',
      avatar: '/static/images/default_avatar.png'
    },
    userLogin: false,         // 用户是否登录
    showLoginDialog: false,   //是否弹出登录对话框
    // 我的订单按钮
    orderItem: [
      {
        "icon": "/static/images/pending_payment.png",
        "name": "待付款"
      },
      {
        "icon": "/static/images/already_shipped.png",
        "name": "待收货"
      },
      {
        "icon": "/static/images/pending_score.png",
        "name": "待评价"
      },
      {
        "icon": "/static/images/completed.png",
        "name": "售后"
      },
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取用户信息
    user.getUserInfo(that, function(res) {
      that.setData({
        userInfo: res,
        userLogin: true      // 用户处于登录状态
      })
    }, function(err) {

    });
  },
  //点击登录
  toggleLogin: function (e) {
    if (this.data.userLogin == true) {
      // 用户已经登录时，不再注册
      return;
    }
    this.showLoginDialog();
  },
  //弹出登录对话框
  showLoginDialog() {
    this.setData({
      showLoginDialog: true
    })
  },
  //关闭登录对话框
  onCloseLoginDialog() {
    this.setData({
      showLoginDialog: false
    })
  },
  onDialogBody() {
    // 阻止冒泡
  },
  onWechatLogin: function (e) {
    let that = this;
    //用户是否点击授权
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      //用户拒绝
      if (e.detail.errMsg === 'getUserInfo:fail auth deny') {
      }
      util.showErrorToast("微信登录失败");
      return false
    }
    //用户同意
    wx.showLoading({
      title: '登录中...',
    })
    user.register(e, function (res) {
      // 设置用户信息
      that.setData({
        userInfo: res,
        userLogin: true,        // 用户处于登录状态
        showLoginDialog: false  // 关闭登录对话框
      });
      wx.hideLoading();
    }, function (err) {
      wx.hideLoading();
      util.showErrorToast("微信登录失败");
      that.setData({
        showLoginDialog: false  // 关闭登录对话框
      });
      return false
    });
  },
  // 点击优惠卷
  toggleCoupon: function (e) {
    if (this.data.userLogin == false) {
      util.showErrorToast("请先登录");
      return;
    }
    wx.navigateTo({
      url: '../coupon/coupon',
    });
  },
  // 点击查看订单
  toggleOrder: function (event) {
    let that = this;
    let index = event.currentTarget.dataset.index;
    // 用户处于登录状态才能访问订单
    if (that.data.userLogin == false) {
      util.showErrorToast("请先登录");
      return;
    }
    let idxMap = ['1', '3', '6', '5'];
    wx.navigateTo({
      url: '../order/order?index=' + idxMap[index],
    })
  },
  // 联系电话
  toggleCall: function (event) {
    wx.makePhoneCall({
      phoneNumber: '13767676797' //仅为示例，并非真实的电话号码
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
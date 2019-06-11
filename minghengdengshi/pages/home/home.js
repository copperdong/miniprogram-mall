// pages/home/home.js
import home from '../../lib/home'
import coupon from '../../lib/coupon'
import util from "../../utils/util.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    banner: [],       // 轮播图
    couponList: [],   // 优惠卷
    goods: [],        // 商品
    hotGoods: [],     // 热品
    showAdvDialog: false,
    showAdvImageUrl: "",
    searchText: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //获取首页广告
    home.getHomeAdv(that, function (data) {
      that.setData({
        showAdvDialog: true,
        showAdvImageUrl: data.image_url,
      });
    },
      function (err) {
        console.log(err)
      });
    that.getInfo();
  },
  // 获取首页数据
  getInfo: function () {
    let that = this;
    //获取海报banner
    home.getBanner(that, function (data) {
      that.setData({
        banner: data,           //
      });
    },
      function (err) {
      });
    //获取热销
    home.getHotGoods(that, function (data) {
      that.setData({
        hotGoods: data,           //
        goods: data,           //
      });
    },
      function (err) {
        console.log(err)
      });
    //获取优惠卷
    coupon.getCoupon(that, function (data) {
      that.setData({
        couponList: data,           //
      });
    },
      function (err) {
        console.log(err)
      });
    wx.stopPullDownRefresh(); //停止下来更新
  },
  // 点击领取优惠卷
  toggleCoupon: function (event) {
    let that = this;
    let couponIndex = event.currentTarget.dataset.index;
    let couponList = that.data.couponList;
    coupon.receiveCoupon(couponList[couponIndex],
      function (res) {
        // 领取成功
        couponList[couponIndex].received = 1 // 改为已领取
        that.setData({
          couponList: couponList
        })
        wx.showToast({
          title: '领取成功',
        });
      }, function (err) {
        util.showErrorToast("请先登录");
      })
  },
  // 关闭广告页面
  onCloseAdvDialog: function (e) {
    this.setData({
      showAdvDialog: false
    })
  },
  onBindFocus: function (e) {
  },
  inputMsg: function (e) {
  },
  // 点击搜索
  toggleSearch: function (e) {
    let that = this;
    let inputTxt = e.detail.value;
    if (inputTxt == "") {
      that.setData({
        goods: that.data.hotGoods
      });
      return;
    }
    // 搜索结果
    home.searchGoods(inputTxt, function (res) {
      that.setData({
        goods: res
      });
    }, function (err) {
    });
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
    this.getInfo();
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
    return {
      title: '首页',
      desc: '铭恒灯饰',
      path: '/pages/home/home'
    }
  }
})
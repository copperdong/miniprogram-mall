// pages/catalog/catalog.js
import catalog from '../../lib/catalog'
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categoryList: [],               //分类
    currentCategory: {},       //当前类别
    scrollLeft: 0,
    scrollTop: 0,
    goodsCount: 0,
    scrollHeight: 0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCatalog();
  },
  getCatalog: function () {
    //CatalogList
    let that = this;
    wx.showLoading({
      title: '加载中...',
    });
    /** 获取类别与对应商品信息 */
    catalog.getCatalog(that, function(res) {
      that.setData({
        categoryList: res,
        currentCategory: res[0] /** 默认第一个为当前选中类别 */
      });
      wx.hideLoading();
    }, function(res) {
    })
    wx.stopPullDownRefresh();
  },
  /** 获取当前类别 */
  getCurrentCategory: function (id) {
    let that = this;
    for (let obj of that.data.categoryList) {
      if (obj.id == id) {
        that.setData({
          currentCategory: obj
        });
      }
    }
  },
  //切换类别
  switchCategory: function (event) {
    var that = this;
    var currentTarget = event.currentTarget;
    if (this.data.currentCategory.id == event.currentTarget.dataset.id) {
      return false;
    }
    that.getCurrentCategory(event.currentTarget.dataset.id);
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
    this.getCatalog();
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
import lAddress from '../../../lib/address'
import util from "../../../utils/util.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',      // 姓名
    mobile: '',    // 手机号
    address: ''    // 详细地址
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAddressDetail();
  },
  //输入框
  bindinputMobile(event) {
    let inputValue = event.detail.value;
    this.setData({
      mobile: inputValue
    });
  },
  bindinputName(event) {
    let inputValue = event.detail.value;
    this.setData({
      name: inputValue
    });
  },
  bindinputAddress(event) {
    let inputValue = event.detail.value;
    this.setData({
      address: inputValue
    });
  },
  getAddressDetail() {
    let that = this;
    lAddress.getAddress(that, function (res) {
      that.setData({
        name: res.name,      // 姓名
        mobile: res.mobile,    // 手机号
        address: res.address    // 详细地址
      });
    }, function (err) {

    });
  },
  // 获取地址
  getLocation: function (event) {
    let that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          address: res.address
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })
  },
  //保存地址
  saveAddress() {
    if (this.data.name == '') {
      util.showErrorToast('请输入姓名');
      return false;
    }
    if (this.data.mobile == '') {
      util.showErrorToast('请输入手机号码');
      return false;
    }
    if (this.data.address == '') {
      util.showErrorToast('请输入详细地址');
      return false;
    }
    var param = {
      name: this.data.name,
      mobile: this.data.mobile,
      address: this.data.address,
    }
    // 保存地址至缓存
    lAddress.saveAddress(param, function (res) {
      wx.navigateBack({
      })
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
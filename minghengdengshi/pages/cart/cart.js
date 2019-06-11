// pages/cart/cart.js
import cart from '../../lib/cart'
import shopping from '../../lib/shopping'
import user from '../../lib/user'
import util from "../../utils/util.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartGoods: [],             // 商品列表
    checkedGoodsCount: 0,      // 总数量
    checkedGoodsAmount: 0.00,  // 总价格
    checkedAllStatus: false,   // 是否全选
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
    this.getCartList(); // 获取购物车
  },
  //判断购物车商品已全选
  isCheckedAll: function () {
    if (this.data.cartGoods.length == 0) {
      return false;
    }
    for (let idx in this.data.cartGoods) {
      if (this.data.cartGoods[idx].checked == false) {
        return false;
      }
    }
    return true;
  },
  // 从缓存中获取购物车
  getCartList: function () {
    let that = this;
    // 获取购物车商品
    cart.getCartList(that, function (res) {
      that.setData({
        cartGoods: res.cartList,    // 商品列表
        checkedGoodsCount: res.checkedGoodsCount,      //总数量
        checkedGoodsAmount: res.checkedGoodsAmount,  // 总价格
      });
      that.setData({
        checkedAllStatus: that.isCheckedAll() // 是否全选
      });
    }, function (err) {
    })
  },
  //选中商品
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;
    // 更新购物车中商品选中状态
    cart.updateCartChecked(itemIndex,
      function (res) {
      }, function (err) {
      });
    that.getCartList() // 重新更新购物车
  },
  //全选
  checkedAll: function () {
    let that = this;
    //编辑状态
    let checkedAllStatus = that.isCheckedAll();
    // 更新购物车中商品状态
    cart.updateCartAllChecked(!checkedAllStatus,  // 状态取反
      function (res) {
      }, function (err) {
      });
    that.getCartList() // 重新更新购物车
  },
  //商品数量减一
  cutNumber: function (event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex; /** 商品索引 */
    let cartItem = this.data.cartGoods[itemIndex];
    var number = cartItem.number - 1
    if (number < 1) { /** number=0时 弹出是否删除 */
      number = 1
      wx.showModal({
        title: '是否删除',
        content: that.data.cartGoods[itemIndex].name,
        success(res) {
          if (res.confirm) {
            //从购物车中删除商品
            cart.deleteGoods(itemIndex, function (res) {
              that.setData({
                cartGoods: res,
              });
              that.getCartList();
            }, function (err) {
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else { /**  */
      //更新购物车
      var param = {
        "index": itemIndex,
        "number": number
      };
      cart.updateCartCount(param,
        function (res) {
          that.getCartList();
        }, function (err) {
        });
    }
  },
  //商品数量加一
  addNumber: function (event) {
    let that = this;
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    var number = cartItem.number + 1;
    //更新购物车
    var param = {
      "index": itemIndex,
      "number": number
    };
    cart.updateCartCount(param,
      function (res) {
        that.getCartList();
      }, function (err) {
      });
  },
  //下单
  checkoutOrder: function () {
    let that = this;
    // 下单前需要先登录
    user.getUserInfo(that,
      function (res) { // 成功获取用户信息，说明用户登录成功
        //获取已选择的商品
        var checkedGoods = []
        for (let i in that.data.cartGoods) {
          if (that.data.cartGoods[i].checked == true) {
            checkedGoods.push(that.data.cartGoods[i])
          }
        }
        if (checkedGoods.length <= 0) {
          // 没有选中的商品
          return false;
        }
        //下单，将选中的商品加入订单缓存中
        shopping.saveOrder(checkedGoods, function (res) {
          wx.navigateTo({
            url: '../shopping/checkout/checkout'
          })
        }, function (err) {
        })
      },
      function (err) { //用户登录失败
        util.showErrorToast('请先登录');
      });
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
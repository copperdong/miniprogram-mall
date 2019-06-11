// pages/goods/goods.js
var WxParse = require("../../lib/wxParse/wxParse.js");
import goods from "../../lib/goods"
import util from "../../utils/util.js"
import cart from "../../lib/cart"
import comments from '../../lib/comment'
import shopping from '../../lib/shopping'
import user from '../../lib/user'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,                 // 商品ID
    goods: {},             // 当前商品
    gallery: [],           // 轮播图
    /* 规格对话框 */
    openAttr: false,       // 是否打开规格属性对话框
    specList: [],          // 规格
    productList: [],       // 产品价格列表
    number: 1,             // 购买数量
    specPrice: 0,          // 规格价格
    specUrl: "",           // 规格封面图片
    checkedSpecText: '请选择规格数量',
    /* 底部导航栏 */
    cartGoodsCount: 0,     // 购物车数量
    /* 评价 */
    commentList: [],      // 商品评价
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
    // 页面初始化 options为页面跳转所带来的参数
    that.setData({
      id: options.id
    });
    that.getGoodsInfo();     // 获取商品信息
    that.getComment();       // 获取评价
    that.getCartCounter();   // 获取购物车中商品数量
  },
  /* 根据商品ID获取商品信息 */
  getGoodsInfo: function () {
    let that = this;
    wx.showLoading({
      title: '加载中...',
    })
    // 获取商品详细信息
    goods.goodsDetail(that.data.id, function (res) {
      that.setData({
        goods: res,
        gallery: res.images,        //轮播图
      });
      // 渲染详情
      WxParse.wxParse('goodsDetail', 'html', res.desc, that);
      //规格数据结构
      /*
      {
        name,
        valueList: [],
        checkedIndex
      }
     */
      var specList = res.spec_list;   /*规格属性列表 */
      for (let i in specList) {  // 遍历各个规格，如颜色，尺寸，添加checkedIndex值
        specList[i].checkedIndex = 0; // 第一默认被选中
      }
      that.setData({
        "specList": specList,
        "productList": res.products_list
      })
      that.getCheckedProduct(); // 获得产品规格选择
      wx.hideLoading();
    }, function (err) {
      wx.hideLoading();
    });
  },
  // 获取评价
  getComment: function() {
    let that = this;
    comments.getGoodsComment(that.data.id, function (res) {
      that.setData({
        "commentList": res
      })
    }, function (err) {

    })
  },
  // 获得产品规格选择
  getCheckedProduct: function () {
    let that = this;
    let specList = this.data.specList;
    let key = "p";  //获取产品规格组合，格式“p_x_y, 如p_1_3”
    let checkedNameValue = ""  /* 选中的名称组合 */
    for (let i in specList) {
      let checkedIdx = specList[i].checkedIndex; /** 选中的属性索引 */
      key += "_" + (checkedIdx + 1).toString();  /* 索引从1开始，需加一 */
      checkedNameValue += specList[i].valueList[checkedIdx] + " ";
    }
    // 从产品组合中找到产品信息
    let productList = that.data.productList;
    if (key in productList) {
      let checkedProduct = productList[key];
      that.setData({
        'checkedSpecText': checkedNameValue,
        "specPrice": checkedProduct.price,     // 更新价格
        "specUrl": checkedProduct.url          // 产品图片链接
      });
      return checkedProduct; // 返回产品规格信息
    }
    // 没有找到对应的规格
    util.showErrorToast("没有该规格");
    return null;
  },
  //弹出规格窗口
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false,
    });
  },
  // 改变规格
  clickSkuValue: function (event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    let specList = this.data.specList
    specList[specNameId].checkedIndex = specValueId // 选择的规格索引
    that.setData({
      'specList': specList
    });
    that.getCheckedProduct();  // 更新规格信息
  },
  // 预览产品图片
  previewProductImage: function (e) {
    let pictures = [this.data.specUrl];
    wx.previewImage({
      current: this.data.specUrl,  //当前显示图片链接
      urls: pictures   //图片数据源
    });
  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  },
  // 底部选择栏
  //回首页
  openHome: function () {
    wx.switchTab({
      url: '/pages/home/home',
    })
  },
  // 购物车商品数量
  getCartCounter: function () {
    let that = this;
    cart.getCounter(this, function (res) {
      that.setData({
        cartGoodsCount: res
      });
    }, function (err) {
    });
  },
  //去购物车
  openCartPage: function () {
    wx.switchTab({
      url: '/pages/cart/cart',
    })
  },
  //立即购买
  goShopping: function () {
    var that = this;
    if (that.data.openAttr === false) {
      //打开规格选择窗口
      that.setData({
        openAttr: !that.data.openAttr
      });
    } else {
      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = that.getCheckedProduct();
      //验证库存
      if (null == checkedProduct || checkedProduct.number < that.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showErrorToast("库存不足");
        return;
      }
      // 下单前需要先登录
      user.getUserInfo(that,
        function (res) { // 成功获取用户信息，说明用户登录成功
          //获取已选择的商品
          var param = {
            id: that.data.goods.id,                   // 商品ID
            name: that.data.goods.name,               // 商品名称
            cover: that.data.goods.cover,             // 商品封面
            specifition: that.data.checkedSpecText,   // 规格名称
            price: that.data.specPrice,               // 价格
            number: that.data.number,                 // 选购数量
            checked: true                             // 选中状态
          }
          var checkedGoods = [param];
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
    }
  },
  //加入购物车
  addToCart: function () {
    var that = this;
    if (that.data.openAttr === false) {
      //打开规格选择窗口
      that.setData({
        openAttr: !that.data.openAttr
      });
    } else {
      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = that.getCheckedProduct();
      //验证库存
      if (null == checkedProduct || checkedProduct.number < that.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showErrorToast("库存不足");
        return;
      }
      //添加到购物车
      var param = {
        id: that.data.goods.id,                   // 商品ID
        name: that.data.goods.name,               // 商品名称
        cover: that.data.goods.cover,        // 商品封面
        specifition: that.data.checkedSpecText,   // 规格名称
        price: that.data.specPrice,               // 价格
        number: that.data.number,                 // 选购数量
        checked: true                             // 选中状态
      }
      cart.addToCart(param, function (res) {
        wx.showToast({
          title: '添加成功'
        });
        that.setData({
          openAttr: !that.data.openAttr, /* 关闭规格弹出框 */
        });
        that.getCartCounter(); /** 更新购物车显示数量 */
      }, function (err) {
        util.showErrorToast(err);
      })
    }
    return;
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
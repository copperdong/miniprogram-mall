// 海报对应table
var advs = new wx.BaaS.TableObject('banner');
let getBanner = (ctx, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('is_show', '=', true) //只查询需要显示的商品
  advs.setQuery(query).find()
    .then(res => {
      const data = [];
      //从读取的数据中获取海报信息
      for (let object of res.data.objects) {
        data.push({
          id: object.id,
          goods_id: object.goods_id,   // 商品ID
          url: object.image_url            // 海报封面
        })
      }
      cbs(data) //成功回调函数
    })
    .catch(err =>
      cbe(err) //失败回调函数
    )
}

//获取热销商品
var goods = new wx.BaaS.TableObject('goods');   // 商品对应table
let getHotGoods = (ctx, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('is_delete', '=', false)  // 去除下架商品
  query.compare('is_hot', '=', true)      // 标记为新品
  goods.setQuery(query).find()
    .then(res => {
      cbs(res.data.objects)
    })
    .catch(err =>
      cbe(err)
    )
}


// 搜索商品
let searchGoods = (txt, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('is_delete', '=', false)  // 去除下架商品
  query.contains('name', txt) /* 包含 */
  goods.setQuery(query).limit(50).find()
    .then(res => {
      cbs(res.data.objects)
    })
    .catch(err =>
      cbe(err)
    )
}
var adv = new wx.BaaS.TableObject('adv');  /* 首页广告 */
let getHomeAdv = (ctx, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('is_show', '=', true) //只查询需要显示的
  adv.setQuery(query).find()
    .then(res => {
      if (res.data.objects.length > 0) {
        cbs(res.data.objects[0]) //成功回调函数
      } else {
        cbe("没有需要显示的广告")
      }
    })
    .catch(err =>
      cbe(err) //失败回调函数
    )
}

module.exports = {
  getHomeAdv,   // 获取广告
  getBanner,    // 获取轮播图
  getHotGoods,  // 获取推荐商品
  searchGoods   // 搜索商品
}
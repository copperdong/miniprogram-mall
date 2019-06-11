var goods = new wx.BaaS.TableObject('goods');  // 商品对应tableID

// 根据商品ID获取商品详情
let goodsDetail = (id, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('is_delete', '=', false)
  query.compare('id', '=', id)
  goods.setQuery(query).find()
    .then(res => {
      if (res.data.objects.length > 0) {
        cbs(res.data.objects[0])
      } else {
        cbe(res)
      }
    })
    .catch(err => {
      cbe(err)
    })
}

module.exports = {
  goodsDetail,   // 获取商品详情
}
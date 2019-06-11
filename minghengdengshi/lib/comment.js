var comments = new wx.BaaS.TableObject("comments");
//获取用户的评价列表
let getCommentList = (param, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  var userId = wx.BaaS.storage.get('uid').toString(); /* 当前用户 */
  if (!userId) {
    cbe("用户未登录！")
    return
  }
  query.compare('user_id', '=', userId)
  comments.setQuery(query).orderBy('-updated_at').find()  //创建日期排序
    .then(res => {
      let objects = res.data.objects;
      cbs(objects)
    })
    .catch(err =>
      cbe(err)
    )
}
//提交用户评价
let submitComment = (param, cbs, cbe) => {
  let com = comments.getWithoutData(param.commentId)
  com.set("score", param.score)
  com.set("comment", param.comment)
  com.set("status", param.status)
  com.update().then(res => {
    cbs(res)
  }, err => {
    cbe(err)
  })
}
// 获取商品对应的评价
let getGoodsComment = (id, cbs, cbe) => {
  var query = new wx.BaaS.Query()
  query.compare('goods_id', '=', id)
  query.compare('status', '=', 1)   // 已经评价过的
  comments.setQuery(query).limit(50).orderBy('-updated_at').find()  //创建日期排序
    .then(res => {
      let objects = res.data.objects;
      cbs(objects)
    })
    .catch(err =>
      cbe(err)
    )
}

module.exports = {
  getCommentList,
  submitComment,
  getGoodsComment  // 获取商品对应的评价
}

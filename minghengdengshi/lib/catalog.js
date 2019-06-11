let category = new wx.BaaS.TableObject('category')
var goods = new wx.BaaS.TableObject('goods');  // 商品对应tableID

let getCatalog = (param, cbs, cbe) => {
  /*读取所有类别*/
  category.find()
    .then(res => {
      const categoryList = [];
      for (let object of res.data.objects) {
        var temp = {
          id: object.id,
          name: object.name,    /** 类别名字 */
          goodsList: [] /** 类别商品列表 */
        }
        categoryList.push(temp)
      }
      /*读取所有商品 */
      var query = new wx.BaaS.Query()
      query.compare('is_delete', '=', false)
      goods.setQuery(query).find().then(res => {
        var data = []
        /*将商品按所属类别进行归类 */
        for (let object of res.data.objects) {
          /** 遍历所有类别 */
          for (var i = 0; i < categoryList.length; i++) {
            if (object.category == categoryList[i].id) {
              categoryList[i].goodsList.push(object)
            }
          }
        }
        cbs(categoryList)
      })
        .catch(err =>
          cbe(err)
        )
    })
    .catch(err =>
      cbe(err)
    )
}

module.exports = {
  getCatalog,
}

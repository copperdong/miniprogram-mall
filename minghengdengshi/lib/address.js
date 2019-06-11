var addressKey = "address";
// 从缓存中读取地址
let getAddress = (param, cbs, cbe) => {
  try {
    var address = wx.getStorageSync(addressKey);
    if (address) {
      cbs(address)
    } else {
      cbe({})
    }
  } catch (e) {
    // Do something when catch error
    cbe({})
  }
}
// 将地址信息保存至缓存中
let saveAddress = (param, cbs, cbe) => {
  wx.setStorageSync(addressKey, param);
  cbs()
}

module.exports = {
  getAddress,     // 读取地址
  saveAddress,    // 保存地址
}

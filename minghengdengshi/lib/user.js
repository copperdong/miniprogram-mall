var userKey = "userInfo";

// 登录知晓云
let login = (ctx, cbs, cbe) => {
  wx.BaaS.login(false).then((res) => {
    let MyUser = new wx.BaaS.User()
    MyUser.get(wx.BaaS.storage.get('uid')).then(res => {
    })
  })
}

// 获取用户ID
let getUid = (ctx) => {
  return wx.BaaS.storage.get('uid')
}

// 用户是否登录过
let getUserInfo = (ctx, cbs, cbe) => {
  let userInfo = wx.getStorageSync(userKey);
  if (userInfo) {
    cbs(userInfo)
  } else {
    cbe("")
  }
}

//注册
let register = (data, cbs, cbe) => {
  //注册并返回用户信息
  wx.BaaS.auth.loginWithWechat(data).then(res => {
    // 将用户信息保存至缓存中
    wx.setStorageSync(
      userKey,
      res
    )
    cbs(res)
  }, err => {
    // **res 有两种情况**：用户拒绝授权，res 包含基本用户信息：id、openid、unionid；其他类型的错误，如网络断开、请求超时等，将返回 Error 对象（详情见下方注解）
    cbe(err)
  })
}

module.exports = {
  login,        // 登录知晓云
  getUserInfo,  // 用户是否登录过
  register,     // 注册
  getUid        // 获取用户ID
}

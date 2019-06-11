//app.js
App({
  onLaunch() {
    // 引入 SDK
    require('./lib/sdk-wechat.2.0.9')

    // 初始化 SDK
    let clientID = '知晓云管理后台获取到的 ClientID'  
    wx.BaaS.init(clientID)
    /* 登录测试代码 */
    /*
    wx.BaaS.login(false).then((res) => {
      // 读取用户信息 
      let MyUser = new wx.BaaS.User()
      MyUser.get(wx.BaaS.storage.get('uid')).then(res => {
        console.log(res)
      })
    })
    */
  }
})

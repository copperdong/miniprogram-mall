# miniprogram-mall
- 微信小程序项目：铭恒灯饰电商+知晓云
- [文档和数据库](https://www.fageka.com/store/item/s/id/urmo8pl1025.html "铭恒灯饰")  
- [知晓云](https://cloud.minapp.com/?invitation=iosayz "知晓云")  
# 指南
        本项目是来自实际项目“铭恒灯饰商城”,“铭恒灯饰“是长三角地区一个朋友开的工厂直销店铺。主要面向本地区用户在线下经营灯具、厨具、卫浴等产品，目前在售产品有几千种，每月线下客户流量大概为几千人。在互联网浪潮的影响下，传统店铺希望客户能在线上完成交易，一来线上渠道可快速获取客户流量，尤其是微信本身拥有10亿用户；二来线上交易成功率高，客户可以随时随地浏览和购买产品。<br>
<div align='center'>
  <p>铭恒灯饰</p>
  <img src="https://github.com/copperdong/miniprogram-mall/blob/master/doc/mingheng.png" width = "200" height = "200"/>
</div>  
        在经过他本人同意的情况下，本项目使用该店铺的营业执照在微信公众平台注册微信小程序，并获得微信认证以及开通微信支付功能。<br>
 ---
## “铭恒灯饰”的需求与其他B2C基本一致，简要描述如下：<br>
- 用户管理：普通用户的注册和登录，管理员具有对普通用户信息管理。
- 商品管理：普通用户可查看商品信息，管理员可添加、修改和删除商品。
- 订单管理：普通用户可下单和查看自己的订单，管理员可对所有用户的订单进行执行和编辑。
- 广告管理：普通用户可在首页查看最新广告，管理员可添加、修改和删除广告。
- 其它需求：前期后台满足30个并发用户，处理查询操作不超过10秒，保证24x7x365的全天候服务，允许一个月一次1小时停机服务，作为系统维护，以及每年30%的可扩展性等需求。
 ---
<div align='center'>
  <p>小程序二维码</p>
  <img src="https://github.com/copperdong/miniprogram-mall/blob/master/doc/gh_24da18e564c9_1280.jpg" width = "200" height = "200" div align=center />
</div> 
 ---
<div align='center'>
    <p>小程序UI截图</p>
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/home.jpg width = "180">
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/catelog.jpg width = "180">
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/cart.jpg width = "180">
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/user.jpg width = "180">
    </img>
</div>
 ----
# 文档简介
        本项目页面编写流程是主要分四大块：<br>
- 页面设计，主要考虑使用哪些组件来展现，通过编辑.wxml、.wxss和.json来实现。
- 页面数据，即页面需要展现的数据，来自page.js中的data。
- 页面控制，即页面中事件处理，比如点击按钮要产生什么动作、加载页面时产生什么动作等。
- 后端服务，页面控制中有些逻辑需要对服务器端或者本地缓存的数据进行访问，这部分逻辑代码单独放在/lib目录下。本项目后端使用知晓云。
 ---
<div align='center'>
    <p>页面编写流程</p>
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/design1.png width = "300">
    </img>
</div>
 ---
<div align='center'>
    <p>页面设计截图</p>
    <img src=https://github.com/copperdong/miniprogram-mall/blob/master/doc/design2.png width = "300">
    </img>
</div>
 ---
# 贡献者
copperdong<br>
Lily（设计）<br>
clement（测试）<br>
铭恒灯饰（商家）<br>
# 版权说明
本项目完全开源
# 鸣谢
感谢铭恒灯饰商家赞助和知晓云平台

import comment from "../../lib/comment.js"

Page({
  data: {
    "commentId":  "",  // 当前评价记录ID
    userStars: [
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
      "/static/images/score_yes.png",
    ],
    score: 5,        // 评分1-5
    commentInput: "" // 文字评价
  },
  // 星星点击事件
  starTap: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var tempUserStars = this.data.userStars;   // 暂存星星数组
    var len = tempUserStars.length;            // 获取星星数组的长度
    for (var i = 0; i < len; i++) {
      if (i <= index) { // 小于等于index的是满心
        tempUserStars[i] = "/static/images/score_yes.png";
        that.setData({
          score: i + 1,
        })
      } else { // 其他是空心
        tempUserStars[i] = "/static/images/score_no.png"
      }
    }
    // 重新赋值
    that.setData({
      userStars: tempUserStars
    })
  },
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    let commentInput = e.detail.value;
    if (commentInput.length > 150) {
      return
    }
    this.setData({
      commentInput: commentInput //当前字数  
    });
  },
  
  onLoad: function (options) {
    this.setData({
      "commentId": options.id   // 评价记录的ID
    })
  },
  // 提交评论
  submitScore: function(e) {
    let commentInput = this.data.commentInput;
    if (commentInput == "") {
      commentInput = "没有填写评价内容"
    }
    let param = {
      "commentId": this.data.commentId,
      "score": this.data.score,             // 评分
      "comment": this.data.commentInput,    // 评论
      "status": 1                           // 评价状态，已评价
    }
    comment.submitComment(param,
      function(res) {
        wx.navigateBack({}) // 返回
      }, function (err) {
      })
  }
})
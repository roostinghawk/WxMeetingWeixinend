var app = getApp()
Page({
    data: {
    motto: '会议记录',
    meetings: {}
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;
      if (!app.globalData.openid){
        app.login();
      }

    // 获取会议一览
    wx.request({
        url: 'https://liuanchen.com/w/meetings/',
        header: {
            "token":app.globalData.token
        },
        success: function(res) {
            that.setData({
                meetings: res.data
            })
        },
        fail: function(error) {
        that.setData({
                errMsg: error.errMsg
            })
        }
    })
  },
});
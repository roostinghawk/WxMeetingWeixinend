//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '会议详情',
    meetingId: '',
    info: {},
    shareResult: ''
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;
      if (!app.globalData.openid){
        app.login();
      }
      // 会议ID
      that.setData({
          meetingId: options.id
      });
      wx.showShareMenu();
    // 获取会议详细
    wx.request({
        url: 'https://liuanchen.com/w/meetings/' + options.id,
        header: {
            "token":app.globalData.token
        },
        success: function(res) {
            that.setData({
                info: res.data.data
            })
        },
        fail: function(error) {
        that.setData({
                errMsg: error.errMsg
            })
        }
    })
  },
  joinMeetingEvent: function(){
    wx.request({
                url: 'https://liuanchen.com/w/meeting/' + options.id + '/join',
                method: 'PUT',
                header: {
                "token": app.globalData.token
                },
                success: function(res) {
                    // todo
                },
                fail: function(error) {
                    // todo
                }
            })
  },
  onShareAppMessage: function (options) {
      var that = this;
    return {
      title: '邀请会议',
      path: '/pages/detail/detail?id=' + that.data.meetingId,
      success: function(res) {
        // 分享成功
        that.setData({
                shareResult: "分享成功！"
            })
      },
      fail: function(res) {
        // 分享失败
        that.setData({
                shareResult: "分享失败！"
            })
      }
    }
  }
})

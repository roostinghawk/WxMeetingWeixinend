//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '预约会议',
    currentDate: new Date(),
    meetingRooms: ['会议室1', '会议室2']
  },
  //事件处理函数
  formSubmit: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
  }
})

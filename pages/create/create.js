//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    motto: '预约会议',
    currentDate: new Date(),
    meetingDate: '2017-6-15',
    meetingTime: '14:00',
    meetingRoomIndex: 0,
    meetingRooms: ['会议室1', '会议室2'],
    title: '早会',
    content: '了了',
    errMsg: ""
  },
onLoad: function(){
   var that = this;
    if (!app.globalData.openid){
      app.login();
    }
},
bindDateChange: function(e) {
    this.setData({
      meetingDate: e.detail.value
    })
  },
  bindTimeChange: function(e) {
    this.setData({
      meetingTime: e.detail.value
    })
  },
  bindRoomChange: function(e) {
      this.setData({
          meetingRoomIndex: e.detail.value
      })
  },
  //事件处理函数
  formSubmit: function() {
      var that = this;
    // 获取天气信息
    wx.request({
        url: 'https://liuanchen.com/w/meetings',
        method: 'POST',
        header: {
            'content-type': 'application/json',
            "token":app.globalData.token
        },
        data: {
            meetingDate: that.data.meetingDate,
            meetingTime: that.data.meetingTime,
            meetingRoorm: that.data.meetingRooms[that.data.meetingRoomIndex],
            title: that.data.title,
            content: that.data.content
        },
        success: function(res) {
            if(res.data.status == 'success') {
                 wx.navigateTo({
                    url: '../detail/detail?id=' + res.data.data
                })
            } else {
                this.setData({
                    errMsg: "创建失败，请重新尝试"
                })
            }
        },
        fail: function(error) {
        that.setData({
                errMsg: error.errMsg
            })
        }
    })
  },
  onLoad: function () {
  }
})

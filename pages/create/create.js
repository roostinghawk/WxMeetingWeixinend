//获取应用实例
var app = getApp()
var config = require('../../common/config')

Page({
  data: {
    motto: '预约会议',
    currentDate: new Date(),
    meetingDate: '',
    meetingTime: '',
    meetingRoomIndex: 0,
    meetingRooms: ['会议室1', '会议室2'],
    title: '',
    content: '',
    errMsg: "",
    loading: false // 加载是否显示
  },
onLoad: function(){
   var that = this;
    if (!app.globalData.openid){
      app.login();
    }
},
bindDateChange: function(e) {
    this.setData({ meetingDate: e.detail.value})
},
bindTimeChange: function(e) {
    this.setData({meetingTime: e.detail.value})
},
bindRoomChange: function(e) {
    this.setData({meetingRoomIndex: e.detail.value})
},
bindTitleChange: function(e) {
    this.setData({title: e.detail.value})
},
bindContentChange: function(e) {
    this.setData({content: e.detail.value});
},
  // 新建会议
  formSubmit: function() {
      var that = this;
      that.showLoading();
      wx.request({
        url: config.apiList.meeting,
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
        },
        compelete: function(){
            that.hideLoading();
        }
    })
  },
  showLoading: function(){
      this.setData({loading: true});
   },
   hideLoading: function(){
      this.setData({loading: false});
  }
})

//获取应用实例
var app = getApp()
var config = require('../../common/config')

Page({
  data: {
    motto: '预约会议',
    currentDate: new Date(),
    meetingDate: '',
    meetingTime: '',
    endTime: '',
    address: '',
    currentDate: '',
    currentTime: '',
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
bindEndTimeChange: function(e) {
    this.setData({endTime: e.detail.value})
},
bindAddressChange: function(e) {
    this.setData({address: e.detail.value})
},
bindTitleChange: function(e) {
    this.setData({title: e.detail.value})
},
bindContentChange: function(e) {
    this.setData({content: e.detail.value});
},
  // 新建会议
  formSubmit: function(e) {
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
            endTime: that.data.endTime,
            meetingRoom: that.data.address,
            title: that.data.title,
            content: that.data.content,
            formId: e.detail.formId
        },
        success: function(res) {
            that.hideLoading();
            if(res.data.status == 'success') {
                 wx.switchTab({
                     url: '/pages/list/list',
                     success: function(e){
                         var page = getCurrentPages().pop();
                         if (page == undefined || page == null) return;
                         page.onLoad(); 
                     }
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

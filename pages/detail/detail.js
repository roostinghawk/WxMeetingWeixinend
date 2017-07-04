var config = require('../../common/config')
var app = getApp()
Page({
  data: {
    motto: '会议详情',
    meetingId: '',
    info: {},
    shareResult: '',
    errMsg: '',
    hiddenModal: true,
    loading: false // 加载是否显示
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;
         // 会议ID
      that.setData({
          meetingId: options.id
      });
      if (!app.globalData.openid){
        app.login(this.initData);
      } else {
          this.initData();
      }
      wx.showShareMenu();
 
  },
  bindDeleteTapEvent: function(){
    this.setData({ hiddenModal: false});
  },
  bindEditTapEvent: function() {
    wx.navigateTo({
      url: '/pages/edit/edit?id=' + this.data.meetingId
    });
  },
  // 初始化
  initData: function(){
      var that = this;
      that.showLoading();
      // 获取会议详细
      wx.request({
            url: config.apiList.meeting + that.data.meetingId,
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
            },
            complete: function(){
                that.hideLoading();
            }
        })
  },
  // 加入会议
  joinMeetingEvent: function(e){
      var that = this;
      that.showLoading();
      wx.request({
            url: config.apiList.meeting + that.data.meetingId + '/join?formId=' + e.detail.formId,
            method: 'PUT',
            header: {
            "token": app.globalData.token
            },
            success: function(res) {
                // 重新初始化数据
                that.initData();
            },
            fail: function(error) {
                that.setData({errMsg: "加入失败，请重新尝试"})
            },
            complete: function() {
                that.hideLoading();
            }
      })
  },
  onShareAppMessage: function () {
      var that = this;
    return {
      title: '邀请会议',
      path: '/pages/detail/detail?id=' + that.data.meetingId,
      success: function(res) {
        // 分享成功
        that.setData({shareResult: "分享成功！"})
      },
      fail: function(res) {
        // 分享失败
        that.setData({shareResult: "分享失败！"})
      }
    }
  },
  cancelDelete: function(){
    this.setData({ hiddenModal: true});
  },
  confirmDelete: function(){
    var that = this;
    wx.request({
      url: config.apiList.meeting + that.data.meetingId,
      method: 'DELETE',
      header: {
        "token": app.globalData.token
      },
      success: function(res) {
        wx.switchTab({
          url: '/pages/list/list',
          success: function (e) {
            var page = getCurrentPages().pop();
            if (page == undefined || page == null) return;
            page.onLoad();
          }
        })
      },
      fail: function(error) {
        that.setData({ errMsg: error});
      },
      complete: function(){
        that.setData({hiddenModal: true});
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

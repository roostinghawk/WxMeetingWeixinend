var config = require('../../common/config')
var app = getApp()
Page({
    data: {
    motto: '会议记录',
    meetings: {},
    loading: false, // 加载是否显示
    userInfo: {}
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;

      that.showLoading();
      if (!app.globalData.openid){
        app.login(this.initData);
      } else {
          this.initData();
      }

      that.setData({
        userInfo: app.globalData.userInfo
      })
      
  },
  onPullDownRefresh: function(){
    this.onLoad();
  },
  initData: function() {
      var that = this;
      // 获取会议一览
      wx.request({
        url: config.apiList.futureMeeting,
          header: {
              "token":app.globalData.token
          },
          success: function(res) {
              that.setData({
                  meetings: res.data
              })
          },
          fail: function(error) {
            that.setData({errMsg: error.errMsg})
          },
          complete: function(){
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
});
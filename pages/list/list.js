var config = require('../../common/config')
var app = getApp()
Page({
    data: {
    motto: '会议记录',
    meetings: {},
    loading: false // 加载是否显示
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;
      if (!app.globalData.openid){
        app.login(this.initData);
      } else {
          this.initData();
      }
  },
  initData: function() {
      var that = this;
      that.showLoading();
      // 获取会议一览
      wx.request({
          url: config.apiList.meeting,
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
var config = require('../../common/config')
var app = getApp()
Page({
    data: {
    motto: '会议记录',
    meetings: {},
    loading: false, // 加载是否显示
    userInfo: {},
    address: '',
    addressArray: [],
    addressIndex: 0
  },
  //事件处理函数
  onLoad: function(options) {
      var that = this;

      that.showLoading();
      if (!app.globalData.openid){
        app.login(this.initData);
      } else {
        that.initData();
      }

      that.setData({
        userInfo: app.globalData.userInfo
      })
  },
  onPullDownRefresh: function(){
    this.onLoad();
  },
  bindAddressChange: function (e) {
    this.setData({ addressIndex: e.detail.value })
    this.setData({ address: this.data.addressArray[e.detail.value] })
    this.showLoading();
    this.initList();
  },

  initData: function() {
    var that = this;

    // 获取会议室列表
    wx.request({
      url: config.apiList.meetingRooms,
      header: {
        "token": app.globalData.token
      },
      success: function (res) {
        var roomArray = [];
        for (var index in res.data) {
          roomArray.push(res.data[index].name);
        }
        that.setData({
          addressArray: roomArray
        })
        if (roomArray.length > 0) {
          that.setData({
            address: roomArray[0],
            addressIndex: 0
          });
        }
        // 成功请求之后再取得当前数据
        that.initList();
      },
      fail: function (error) {
        that.setData({
          errMsg: '获取会议室列表未成功'
        })
        that.hideLoading();
      }
    })
  },
  
  initList: function() {
      var that = this;

      var url = config.apiList.futureMeetingByRoom + '?meetingRoom=' + that.data.address;
      // 获取会议一览
      wx.request({
        url: url,
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
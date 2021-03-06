//获取应用实例
var app = getApp()
var config = require('../../common/config')

Page({
  data: {
    motto: '预约会议',
    meetingId: '',
    currentDate: new Date(),
    meetingDate: '',
    meetingTime: '',
    endTime: '',
    address: '',
    addressArray: [],
    addressIndex: 0, 
    currentDate: '',
    currentTime: '',
    title: '',
    content: '',
    creatorName: '',
    errMsg: "",
    hiddenModal: true,
    loading: false // 加载是否显示
  },
  onLoad: function (options) {
    var that = this;
    that.showLoading();
    that.setData({ meetingId: options.id });
    if (!app.globalData.openid) {
      app.login(this.initData);
    } else {

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
          // 成功请求之后再取得当前数据
          that.initData();
        },
        fail: function (error) {
          that.setData({
            errMsg: '获取会议室列表未成功'
          })
          that.hideLoading();
        }
      })

    }
  },
  bindDateChange: function (e) {
    this.setData({ meetingDate: e.detail.value })
  },
  bindTimeChange: function (e) {
    this.setData({ meetingTime: e.detail.value })
  },
  bindEndTimeChange: function (e) {
    this.setData({ endTime: e.detail.value })
  },
  bindAddressChange: function (e) {
    this.setData({ addressIndex: e.detail.value })
    this.setData({ address: this.data.addressArray[e.detail.value] })
  },
  bindTitleChange: function (e) {
    this.setData({ title: e.detail.value })
  },
  bindContentChange: function (e) {
    this.setData({ content: e.detail.value });
  },
  bindCreatorNameChange: function (e) {
    this.setData({ creatorName: e.detail.value });
  },

  // 初始化
  initData: function () {
    var that = this;
    // 获取会议详细
    wx.request({
      url: config.apiList.meeting + that.data.meetingId,
      header: {
        "token": app.globalData.token
      },
      success: function (res) {
        var info = res.data.data;
        that.setData({
          meetingDate: info.meetingDate,
          meetingTime: info.meetingTime,
          endTime: info.endTime,
          meetingRoom: info.address,
          title: info.title,
          content: info.content,
          creatorName: info.createdBy,
          address: info.meetingRoom
        })

        // 会议室下拉
        var roomArray = that.data.addressArray;
        for (var i = 0; i < roomArray.length; i++) {
          if (roomArray[i] == info.meetingRoom) {
            that.setData({
              addressIndex: i 
            });
            break;
          }
        }
      },
      fail: function (error) {
        that.setData({
          errMsg: error.errMsg
        })
      },
      complete: function () {
        that.hideLoading();
      }
    })
  },
  // 更新会议
  formSubmit: function (e) {
    var that = this;
    that.showLoading();
    wx.request({
      url: config.apiList.meeting,
      method: 'PUT',
      header: {
        'content-type': 'application/json',
        "token": app.globalData.token
      },
      data: {
        id: that.data.meetingId,
        meetingDate: that.data.meetingDate,
        meetingTime: that.data.meetingTime,
        endTime: that.data.endTime,
        meetingRoom: that.data.address,
        title: that.data.title,
        content: that.data.content,
        creatorName: that.data.creatorName,
        formId: e.detail.formId
      },
      success: function (res) {
        that.hideLoading();
        if (res.data.status == 'success') {
          wx.switchTab({
            url: '/pages/list/list',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            }
          })
        } else {
          that.setData({
            hiddenModal: false,
            errMsg: res.data.data.errmsg
          })
        }
      },
      fail: function (error) {
        that.setData({
          hiddenModal: false,
          errMsg: error.errmsg
        })
      },
      compelete: function () {
        that.hideLoading();
      }
    })
  },
  confirmModal: function () {
    this.setData({ hiddenModal: true });
  },
  showLoading: function () {
    this.setData({ loading: true });
  },
  hideLoading: function () {
    this.setData({ loading: false });
  }
})

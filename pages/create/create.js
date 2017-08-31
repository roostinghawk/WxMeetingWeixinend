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
    addressArray: [],
    addressIndex: 0, 
    currentDate: '',
    currentTime: '',
    title: '',
    content: '',
    creatorName: '',
    errMsg: '',
    hiddenModal: true,
    loading: false // 加载是否显示
  },
  onLoad: function (options){
   var that = this;
    if (!app.globalData.openid){
      app.login();
    }

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    var hh = today.getHours() + 1;
    var nextHour = hh + 1;

    if (dd < 10) {
      dd = '0' + dd;
    }

    if (mm < 10) {
      mm = '0' + mm;
    }

    if(hh < 10) {
      hh = '0' + hh;
    }

    if (nextHour < 10) {
      nextHour = '0' + nextHour;
    }

    that.setData({
      meetingDate:  yyyy + '-' + mm + '-' + dd,
      currentDate:  yyyy + '-' + mm + '-' + dd,
      meetingTime: hh + ':00',
      startTime: hh + ':00',
      endTime: nextHour + ':00'
    });
    
    // 获取会议室列表
    wx.request({
      url: config.apiList.meetingRooms,
      header: {
        "token": app.globalData.token
      },
      success: function (res) {
        var roomArray = [];
        for(var index in res.data) {
          roomArray.push(res.data[index].name);
        }
        that.setData({
          addressArray: roomArray
        })
      },
      fail: function (error) {
      }
    })


    // 获取发起人姓名
    wx.request({
      url: config.apiList.getName,
      header: {
        "token": app.globalData.token
      },
      success: function (res) {
        that.setData({
          creatorName: res.data
        })
      },
      fail: function (error) {
      }
    })
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
  this.setData({ addressIndex: e.detail.value })
  this.setData({ address: this.data.addressArray[e.detail.value]})
},
bindTitleChange: function(e) {
    this.setData({title: e.detail.value})
},
bindContentChange: function(e) {
    this.setData({content: e.detail.value});
},
  bindCreatorNameChange: function(e) {
    this.setData({ creatorName: e.detail.value});
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
            creatorName: that.data.creatorName,
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
                that.setData({
                  hiddenModal: false,
                  errMsg: res.data.data.errmsg
                })
            }
        },
        fail: function(error) {
        that.setData({
                errMsg: error.errmsg
            })
        },
        compelete: function(){
            that.hideLoading();
        }
    })
  },
  confirmModal: function(){
    this.setData({ hiddenModal: true});
  },
  showLoading: function(){
      this.setData({loading: true});
   },
   hideLoading: function(){
      this.setData({loading: false});
  }
})

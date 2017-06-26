var config = require('common/config')
//app.js
App({
    globalData: {
    openid: null,
    token:null
  },
  onLaunch: function () {
    this.login();

  }, 
  // 获取openid
  login: function (process) {
    var that = this;
    //调用微信登录接口  
    wx.login({
      success: function (result) {
        wx.getUserInfo({
          success: function (res) {
            wx.request({
              url: config.apiList.login,
              data: {
                "code": result.code,
                "encryptedData": res.encryptedData,
                "iv": res.iv
              },
              method: 'POST',
              header: {
                'content-type': 'application/json'
              },
              success: function (resl) {
                that.globalData.openid = resl.data.data.principal;
                that.globalData.token = resl.data.data.details.token;
                if(process) {
                    process();
                }
              }
            })
          }
        })
      }
    })
   }
})
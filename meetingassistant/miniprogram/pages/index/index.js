//index.js
const app = getApp()
const db=wx.cloud.database()
var that=this;

Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    usertag:false
  },
  onLoad: function() {
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }
    that=this
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.setData({
            usertag:true
          })
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
              //调用云函数获取openid
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  app.globalData.openid = res.result.openid
                  db.collection('user').where({
                    _openid: app.globalData.openid
                  }).get({
                    success: res => {
                      //未注册用户
                      if(res.data.length==0){
                        app.globalData.pri=false
                        wx.redirectTo({
                          url: '../signup/signup',
                        })
                      }
                      //已注册
                      else{
                        wx.redirectTo({
                          url: '../usercenter/usercenter',
                        })
                      }
                    }
                  })
                },
                fail: err => {
                  console.error('[云函数] [login] 调用失败', err)
                }
              })
            }
          })
        }
      }
    })
  },

  onGetUserInfo: function(e) {
    console.log("getuser")
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        usertag:true
      })
    }
    
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.globalData.openid = res.result.openid
        db.collection('user').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            if (res.data.length == 0) {
              app.globalData.pri = false
              wx.redirectTo({
                url: '../signup/signup',
              })
            }
            else {
              wx.redirectTo({
                url: '../usercenter/usercenter',
              })
            }
          }
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })

    
  },


})

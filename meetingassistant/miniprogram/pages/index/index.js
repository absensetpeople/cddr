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
  confirm:function(){

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
              //console.log("getsetting")
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  app.globalData.openid = res.result.openid
                  console.log('[云函数] [login] user openid: ', app.globalData.openid)
                  
                  // wx.cloud.callFunction({
                  //   name:'search',
                  //   data:{
                  //     'userid':2
                  //   },
                  //   complete: res => {
                  //     console.log(res)
                  //   }
                  // })
                  db.collection('user').where({
                    _openid: app.globalData.openid
                  }).get({
                    success: res => {
                      //console.log(res.data)
                      if(res.data.length==0){
                        app.globalData.pri=false
                        wx.redirectTo({
                          url: '../signup/signup',
                        })
                      }
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

    //that.onGetOpenid()
    

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
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        db.collection('user').where({
          _openid: app.globalData.openid
        }).get({
          success: res => {
            console.log(res.data)
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

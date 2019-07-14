// miniprogram/pages/formmeeting/formmeeting.js
const app=getApp()
const db=wx.cloud.database()
var that=this
var _=db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    formflag:app.globalData.formflag,
    buttontext:'',

    name:'',
    code:'',
    meetingid:'',
    deleteflag:false,
    privacyflag:false,
    codeflag:false
  },

  privacysel:function(e){
    that.data.privacyflag=e.detail.value
  },

  inputname:function(e){
    that=this
    that.setData({
      name:e.detail.value
    })
  },

  inputcode:function(e){
    that=this
    that.setData({
      code:e.detail.value
    })
  },

  confirm:function(){
    that=this
    if(that.data.formflag==0&&that.data.codeflag==true){
      db.collection('meeting').add({
        data:{
          meetingname:that.data.name,
          meetingstate:'即将',
          record:[],
          privacy:that.data.privacyflag
        },
        success:res=>{
          console.log(res)
          that.data.meetingid=res._id
          db.collection('user').doc(app.globalData.userid).update({
            data:{
              meeting:_.push({authority:'creater',meetingid:res._id})
            },
            success:res2=>{
              console.log('update succ')
              db.collection('tmpcode').add({
                data: {
                  name: that.data.name,
                  code: that.data.code,
                  id: that.data.meetingid
                },
                success:e=>{
                  console.log('create success')
                  app.globalData.currentmeetingid=that.data.meetingid
                  that.setData({
                    deleteflag:true
                  })
                  wx.redirectTo({
                    url: '../meeting/meeting',
                  })
                }
              })

            }
          })
        }
      })
      
    }
    else if(that.data.codeflag==true){
      db.collection('tmpcode').where({code:that.data.code}).get({
        success:res=>{
          console.log(res.data[0],app.globalData.userid)
          db.collection('user').doc(app.globalData.userid).update({
            data:{
              meeting:_.push([{authority:'participant',meetingid:res.data[0].id}])
            },
            success:e=>{
              console.log('join succ',e)
              app.globalData.currentmeetingid=res.data[0].id
              wx.redirectTo({
                url: '../meeting/meeting',
              })
            }
          })
        }
      })
    }
    else{
      db.collection('tmpcode').add({
        data:{
          code: that.data.code,
          id: app.globalData.currentmeetingid
        },
        success:res=>{
          wx.redirectTo({
            url: '../meeting/meeting',
          })
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    that.setData({
      formflag:app.globalData.formflag,
      codeflag:app.globalData.codeflag
    })
    if(app.globalData.formflag==0||that.data.codeflag==false){
      that.setData({
        buttontext:'发起'
      })
    }
    else{
      that.setData({
        buttontext:'加入'
      })
    }
    console.log(that.data.formflag)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})
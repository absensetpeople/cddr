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

  //输入会议名
  inputname:function(e){
    that=this
    that.setData({
      name:e.detail.value
    })
  },

  //输入邀请码
  inputcode:function(e){
    that=this
    that.setData({
      code:e.detail.value
    })
  },

  //确定button
  confirm:function(){
    that=this
    if(that.data.formflag==0&&that.data.codeflag==true){//创建会议流程
      //数据库增加相应的会议条目
      db.collection('meeting').add({
        data:{
          meetingname:that.data.name,
          meetingstate:'即将',
          record:[],
          privacy:that.data.privacyflag
        },
        success:res=>{
          that.data.meetingid=res._id
          //修改对应的用户信息
          db.collection('user').doc(app.globalData.userid).update({
            data:{
              meeting:_.push({authority:'creater',meetingid:res._id})
            },
            success:res2=>{
              //在邀请码集合中增加相应记录
              db.collection('tmpcode').add({
                data: {
                  name: that.data.name,
                  code: that.data.code,
                  id: that.data.meetingid
                },
                success:e=>{
                  app.globalData.currentmeetingid=that.data.meetingid
                  that.setData({
                    deleteflag:true//允许删除已创建的邀请码
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
    //加入会议流程
    else if(that.data.codeflag==true){
      db.collection('tmpcode').where({code:that.data.code}).get({
        success:res=>{
          db.collection('user').doc(app.globalData.userid).update({
            data:{
              //在用户信息中的meeting数组中插入新的会议条目
              meeting:_.push([{authority:'participant',meetingid:res.data[0].id}])
            },
            success:e=>{
              app.globalData.currentmeetingid=res.data[0].id
              wx.redirectTo({
                url: '../meeting/meeting',
              })
            }
          })
        }
      })
    }
    //重新创建邀请码流程
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
    //页面之间传递参数
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
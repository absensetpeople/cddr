// miniprogram/pages/meeting/meeting.js
const app=getApp()
const db=wx.cloud.database()
var that=this

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetingname:'',
    meetingstate:'',
    createrflag:false,
    recordinfo:[],
    tips:'',
    codeflag:false,
    exitflag:''
  },

  exitmeeting:function(){
    that=this
    var n=0
    var index=0
    var tmpflag=false
    app.globalData.meeting.forEach(item=>{
      if(item.meetingid==app.globalData.currentmeetingid){
        index=n
      }
      n=n+1
    })
    console.log('createrflag',that.data.createrflag)
    app.globalData.meeting.splice(index, 1)
    console.log(app.globalData.meeting)
    db.collection('user').doc(app.globalData.userid).update({
      data: {
        meeting: app.globalData.meeting
      },
      success: wx.redirectTo({
        url: '../usercenter/usercenter',
      })
    })
  },

  deletecode:function(){
    if(that.data.codeflag){
      db.collection('tmpcode').where({id:app.globalData.currentmeetingid}).get({
        success:res=>{
          db.collection('tmpcode').doc(res.data[0]._id).remove({
            success:e=>{
              that.setData({
                tips: '创建邀请码'
              })
              app.globalData.codeflag = false
              that.data.codeflag=false
            }
          })
        }
      })
    }
    else{
      app.globalData.codeflag=false
      wx.navigateTo({
        url: '../formmeeting/formmeeting',
      })
    }
  },

  search: function (e,i) {
    //that=this
    //var tmpmeeting = []
    return new Promise(function (resolve, reject) {
      db.collection('record').doc(e).get({
        success: res => {
          console.log('res.data',res.data)
          resolve({ num: i, id: res.data._id, name: res.data.recordname, state: res.data.recordstate,time:res.data.time,date:res.data.date })
        }
      })
    })
  },

  sum: function (e) {
    //var temprecord = []
    var temp = []
    var tmp=[]
    var i = 0
    e.forEach(item => {
      i=i+1
      that.search(item,i).then(function (res) {
        temp.push(res)
        if (i == e.length) {
          console.log(temp)
          that.sort(temp)
        }
      })
    })
  },

  sort:function(e){
    that=this
    var tmp=[]
    var i=0
    for(i=e.length;i>0;i--){
      e.forEach(item=>{
        if(item.num==i){
          tmp.push(item)
        }
      })
    }
    console.log(tmp)
    that.setData({
      recordinfo:tmp
    })
  },

  selectr:function(e){
    that=this
    app.globalData.currentrecordid=e.currentTarget.id
    that.data.recordinfo.forEach(item=>{
      if(item.id==app.globalData.currentrecordid){
        if(item.state=='未生成'){
          wx.navigateTo({
            url: '../recordcreate/recordcreate',
          })
        }
        else{
          wx.navigateTo({
            url: '../recordscan/recordscan',
          })
        }
      }
    })
  },

  holdmeeting:function(){
    wx.navigateTo({
      url: '../selecttime/selecttime',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    that=this
    db.collection('meeting').doc(app.globalData.currentmeetingid).get({
      success: res => {
        console.log(res.data)
        console.log(app.globalData.userid)
        that.setData({
          meetingname: res.data.meetingname,
          meetingstate: res.data.meetingstate
        })
        
        if (res.data.record.length != 0) {
          that.sum(res.data.record)
        }

        if (res.data._openid == app.globalData.openid) {
          app.globalData.authority = 0
          that.setData({
            createrflag: true,
            exitflag:'删除会议'
          })
        }
        else {
          app.globalData.authority = 1
          that.setData({
            createrflag: false,
            exitflag:'退出会议'
          })
        }
        db.collection('tmpcode').where({id:app.globalData.currentmeetingid}).get({
          success:res=>{
            if(res.data.length==0){
              that.setData({
                tips:'创建邀请码',
                codeflag:false
              })
            }
            else{
              that.setData({
                tips:"删除邀请码",
                codeflag:'true'
              })
            }
          }
        })
      }
    })
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
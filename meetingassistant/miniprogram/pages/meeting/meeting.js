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
    app.globalData.meeting.splice(index, 1)
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
    return new Promise(function (resolve, reject) {
      db.collection('record').doc(e).get({
        success: res => {
          //异步查询函数使用resolve变同步
          resolve({ num: i, id: res.data._id, name: res.data.recordname, state: res.data.recordstate,time:res.data.time,date:res.data.date })
        }
      })
    })
  },

  sum: function (e) {
    var temp = []
    var tmp=[]
    var i = 0
    //遍历用户的meeting信息
    e.forEach(item => {
      i=i+1
      that.search(item,i).then(function (res) {
        temp.push(res)
        //全部查询完毕
        if (i == e.length) {
          that.sort(temp)
        }
      })
    })
  },

  //排序函数
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
        that.setData({
          meetingname: res.data.meetingname,
          meetingstate: res.data.meetingstate
        })
        
        if (res.data.record.length != 0) {
          that.sum(res.data.record)
        }

        //根据用户在该会议中的身份决定button的功能
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

        //查询该会议的邀请码状态
        db.collection('tmpcode').where({id:app.globalData.currentmeetingid}).get({
          success:res=>{
            //无邀请码
            if(res.data.length==0){
              that.setData({
                tips:'创建邀请码',
                codeflag:false
              })
            }
            //有邀请码
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
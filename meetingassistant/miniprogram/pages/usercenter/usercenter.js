// miniprogram/pages/usercenter/usercenter.js
const app=getApp()
const db=wx.cloud.database()
const _=db.command
var that=this

Page({

  /**
   * 页面的初始数据
   */
  data: {
    meetingname:[],
    meetingstate:[],
    meetinginfo:[]

  },

  search:function(e,i){
    var tmpmeeting=[]
    return new Promise(function(resolve,reject){
      db.collection('meeting').doc(e).get({
        success: res => {
          resolve({ num: i, id: res.data._id, name: res.data.meetingname, state: res.data.meetingstate ,privacy:res.data.privacy})
        }
      })
    })
  },

  sum:function(e){
    var tmpmeeting=[]
    var temp=[]
    var i=0
    console.log('sum')
    e.forEach(item => {
      that.search(item.meetingid,i).then(function (res) {
        temp.push(res)
        if(i==e.length){
          temp.sort(that.compare('num'))
          that.setData({
            meetinginfo:temp
          })
          console.log(that.data.meetinginfo)
        }
      })
      i = i + 1
    })    
  },

  compare: function (pro) {
    return function (a, b) {
      return a[pro] - b[pro]
    }
  },

  selectm:function(e){
    that=this
    var id=e.currentTarget.id
    that.data.meetinginfo.forEach(item=>{
      if(item.id==id){
        app.globalData.currentmeetingid = id
        if(item.privacy==true){
          app.globalData.pri=true
          console.log(app.globalData.pri)
          wx.navigateTo({
            url: '../camera/camera',
          })
        }
        else{
          wx.navigateTo({
            url: '../meeting/meeting',
          })
        }
      }
    })
    
    
  },

  createmeeting:function(){
    app.globalData.formflag=0
    app.globalData.codeflag=true
    wx.navigateTo({
      url: '../formmeeting/formmeeting',
    })
  },

  joinmeeting:function(){
    app.globalData.formflag=1
    app.globalData.codeflag = true
    wx.navigateTo({
      url: '../formmeeting/formmeeting',
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
  powerDrawer: function () {
    this.setData({
      showStatus: false
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    that = this
    db.collection('user').where({ _openid: app.globalData.openid }).get({
      success: res => {
        console.log(res.data[0])
        app.globalData.userid = res.data[0]._id
        app.globalData.username=res.data[0].username
        console.log('userid:', app.globalData.userid)
        var userinf = res.data[0]
        app.globalData.meeting=res.data[0].meeting.slice()
        app.globalData.imgid=res.data[0].imgid
        console.log(res.data[0].meeting)
        if (userinf.meeting.length != 0) {
          that.sum(userinf.meeting)
        }
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
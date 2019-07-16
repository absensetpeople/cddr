// miniprogram/pages/selecttime/selecttime.js
const app = getApp()
const db = wx.cloud.database()
var that
var _=db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date:'',
    time:'',
    name:''
  },

  //picker组件对应的函数，选择日期
  seldate:function(e){
    this.data.date=e.detail.value
    this.setData({
      da: e.detail.value
    })
  },
  //选择时间
  seltime: function (e) {
    this.data.time = e.detail.value
    this.setData({
      ti: e.detail.value
    })
  },
  //输入会议名
  nameinput:function(e){
    this.data.name=e.detail.value
  },

  confirm:function(){
    that=this
    //更新数据库，增加一条record
    db.collection('record').add({
      data:{
        recordname:that.data.name,
        recordstate:'未生成',
        text:[],
        date:that.data.date,
        time:that.data.time
      },
      success:res=>{
        //更新meeting，关联刚生成的record
        db.collection('meeting').doc(app.globalData.currentmeetingid).update({
          data:{
            record:_.push(res._id)
          },
          success:e=>{
            wx.redirectTo({
              url: '../meeting/meeting',
            })
          }
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
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
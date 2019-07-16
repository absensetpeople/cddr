// miniprogram/pages/recordscan/recordscan.js
const app=getApp()
const db=wx.cloud.database()
const au = wx.createInnerAudioContext()
var that

Page({

  /**
   * 页面的初始数据
   */
  data: {
    messageinfo:[],
    playflag:false
  },

  //list的点击事件，根据点击位置返回不同的id
  selectme:function(e){
    if(that.data.playflag==false){
      //下载对应的音频文件
      wx.cloud.downloadFile({
        fileID: e.currentTarget.id,
        success:res=>{
          //播放
          au.src=res.tempFilePath
          au.play()
        }
      })
    }
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
    that=this
    //查询会议记录并显示
    db.collection('record').doc(app.globalData.currentrecordid).get({
      success:res=>{
        that.setData({
          messageinfo:res.data.text
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
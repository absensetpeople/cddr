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

  selectme:function(e){
    console.log(e.currentTarget.id)
    if(that.data.playflag==false){
      wx.cloud.downloadFile({
        fileID: e.currentTarget.id,
        success:res=>{
          console.log('tmpfilepath:',res.tempFilePath)
          au.src=res.tempFilePath
          au.play()
        }
      })
    }
  },
  test:function(e){
    console.log(e)
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
    db.collection('record').doc(app.globalData.currentrecordid).get({
      success:res=>{
        console.log('record:',res.data)
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
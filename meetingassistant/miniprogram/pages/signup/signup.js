// miniprogram/pages/signup/signup.js
const app=getApp()
const file=wx.getFileSystemManager()
const db=wx.cloud.database()
var that=this
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:[],
    permitstate:false,
    usernamestate:false,
    tip:'请上传清晰照片',
    username:'',
    showModelStatus: true,
    bnt_background: '#e0e0e0',
    bnt_backgroundUp: '#e0e0e0',
    bntStatu: true
  },

  upload:function(){
    that=this
    wx.chooseImage({
      count:1,
      sizeType:['compressed'],
      sourceType:['album'],
      success: function(res) {
        that.setData({
          imgurl:res.tempFilePaths,
          permitstate:true
        })
        app.globalData.uploadimgurl=res.tempFilePaths

        console.log("choosesuccess")
        that.setData({
          bnt_background: '#68ACEA',
          bntStatu: false
        })
      },
    })
  },

  signup:function(){
    that=this
    if(that.data.permitstate==true&&that.data.username!=''){
      console.log(app.globalData.username)
      wx.redirectTo({
        url: '../camera/camera',
      })
    }
    else if(that.data.permitstate==false){
      that.setData({
        tip:'请先上传照片',
        showModelStatus: true
      })
    }
    else{
      that.setData({
        tip:'用户名为空',
        showModelStatus: true
      })
    }
  },

  input:function(e){
    this.setData({
      username:e.detail.value
    })
    app.globalData.username=e.detail.value
  },
  powerDrawer: function () {
    this.setData({
      showModelStatus: false,
      bnt_backgroundUp: '#68ACEA',
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
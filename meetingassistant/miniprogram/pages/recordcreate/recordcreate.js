// miniprogram/pages/recordcreate/recordcreate.js
var plugin = requirePlugin("WechatSI")
const app=getApp()
const db=wx.cloud.database()
const recorder=plugin.getRecordRecognitionManager()
const au=wx.createInnerAudioContext()
var that



Page({

  /**
   * 页面的初始数据
   */
  data: {
    clickflag:false,
    tip:'点击按钮开始录音',
    filepath:'',
    num:0
  },

  click:function(){
    that=this
    if(!that.data.clickflag){
      recorder.start({
        lang:'zh_CN'
      })
      that.data.clickflag=!that.data.clickflag
      that.setData({
        tip:'录音ing'
      })
    }
    else{
      recorder.stop()
      console.log('stop')
      that.setData({
        tip:'录音结束，点击按钮继续录音'
      })
    }
  },
  
  test:function(){
    that=this
    console.log(that.data.filepath)
    au.src=that.data.filepath
    au.play()
  },

  exit:function(){
    that=this
    if(app.globalData.authority==0){
      db.collection('record').doc(app.globalData.currentrecordid).update({
        data:{
          recordstate:'待修订'
        },
        success:res=>{
          wx.redirectTo({
            url: '../recordscan/recordscan',
          })
        }
      })
    }
    else{
      wx.redirectTo({
        url: '../meeting/meeting',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initRecord()
  },

  initRecord:function(){
    recorder.onStart=function(res){
      console.log('成功开始识别',res)
    }

    recorder.onError = function (res) {
      console.error("error msg", res.msg)
    }

    recorder.onStop = function (res) {
      console.log('result:', res.result)
      console.log('path',res.tempFilePath)
      that.data.clickflag = !that.data.clickflag
      that.data.filepath=res.tempFilePath
      that.setData({
        tip: res.result
      })
      that.data.num=that.data.num+1
      wx.cloud.uploadFile({
        cloudPath:app.globalData.currentrecordid+app.globalData.userid+that.data.num+'.mp3',
        filePath:that.data.filepath,
        success:e=>{
          console.log(e.fileID)
          wx.cloud.callFunction({
            name: 'insertmessage',
            data: {
              id: app.globalData.currentrecordid,
              speaker:app.globalData.username,
              str:res.result,
              url:e.fileID
            },
            success:res=>{
              console.log(res)
            }
          })
        }
      })
    }
    recorder.onRecognize = (res) => {
      console.log('result',res.result)
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
    that=this
    if(app.globalData.authority==0){
      that.setData({
        exittip:'结束会议'
      })
    }
    else{
      that.setData({
        exittip:'退出'
      })
    }
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
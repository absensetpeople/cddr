// miniprogram/pages/camera/camera.js
const app=getApp()
var db=wx.cloud.database()
var file=wx.getFileSystemManager()
var that=this

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgurl:[],
    tip:'请拍照验证身份',
    showModelStatus: true,
    permitstate: false,

    serectkey: 'XvOPG2fWJzZuufCDzXqqZ0A56qMbNipe',
    secret_id: 'AKIDslYBdpHRqTmxrW6Xkjod8NKQGrLasT8x',
    imageABase64: '', //base64的文件
    imageBBase64: '', 
    privacy:false,
    urla:''
  },

  camera:function(){
    that = this
    const ctx = wx.createCameraContext()
    if(that.data.privacy==false){
      console.log(that.data.privacy)
      file.readFile({
        filePath:app.globalData.uploadimgurl[0],
        encoding:'base64',
        success:function(e){
          that.data.imageABase64=e.data
          //camera
          ctx.takePhoto({
            quality: 'high',
            success: res => {
              console.log('camera')
              file.readFile({
                filePath: res.tempImagePath,
                encoding: 'base64',
                success: function (e) {
                  console.log("transfersuc")
                  that.setData({
                    imageBBase64: e.data
                  })
                  //that.submit()
                  wx.request({
                    url: 'https://iai.tencentcloudapi.com',
                    data: that.submit(),
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: res => {
                      console.log("apisucc")
                      console.log(res.data.Response)
                      if (res.data.Response.Score > 90) {
                        that.setData({
                          permitstate: true,
                          tip:'身份核验通过',
                          showModelStatus: true
                        })
                      }
                      else {
                        that.setData({
                          permitstate: false,
                          tip: '验证失败，请重新拍照',
                          showModelStatus: true
                        })
                      }
                    },
                    fail:e=>{
                      that.setData({
                        permitstate: false,
                        tip: '验证失败，请重新拍照',
                        showModelStatus: true
                      })
                    }
                  })
                },
              })
            },
          })
        }
      })
    }
    else{
      console.log(that.data.privacy)
      console.log('验证ing')
      wx.cloud.getTempFileURL({
        fileList:[{fileID:app.globalData.imgid}],
        success:res=>{
          console.log('get success:',res.fileList[0].tempFileURL)
          that.data.urla=res.fileList[0].tempFileURL
          ctx.takePhoto({
            quality: 'high',
            success: res => {
              console.log('camera')
              file.readFile({
                filePath: res.tempImagePath,
                encoding: 'base64',
                success: function (e) {
                  console.log("transfersuc")
                  that.setData({
                    imageBBase64: e.data
                  })
                  wx.request({
                    url: 'https://iai.tencentcloudapi.com',
                    data: that.submitB(),
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: res => {
                      console.log("apisucc")
                      console.log(res.data.Response)
                      if (res.data.Response.Score > 90) {
                        that.setData({
                          permitstate: true,
                          tip: '身份核验通过',
                          showModelStatus: true
                        })
                        wx.redirectTo({
                          url: '../meeting/meeting',
                        })
                      }
                      else {
                        that.setData({
                          permitstate: false,
                          tip: '验证失败，请重新拍照',
                          showModelStatus: true
                        })
                      }
                    },
                    fail: e => {
                      that.setData({
                        permitstate: false,
                        tip: '验证失败，请重新拍照',
                        showModelStatus: true
                      })
                    }
                  })
                },
              })
            },
          })
        }
      })
    }
  },

  signup:function(){
    that=this
    if(that.data.permitstate){
      wx.cloud.uploadFile({
        cloudPath:app.globalData.openid+'.png',
        filePath:app.globalData.uploadimgurl[0],
        success:res=>{
          console.log("uploadsuccess")
          console.log(res)
          console.log(res.fileID)
          db.collection('user').add({
            data:{
              username:app.globalData.username,
              imgid:res.fileID,
              meeting:[]
            },
            success:res=>{
              console.log('addsuccess')
              app.globalData.userid=res._id
              wx.redirectTo({
                url: '../usercenter/usercenter',
              })
            }
          })
        },
        fail:err=>{
          console.log(err)
        }
      })

    }
  },

  submit() {
    let serectkey = that.data.serectkey;
    let param = {
      Action: 'CompareFace',
      Version: '2018-03-01',
      ImageA: that.data.imageABase64,
      ImageB: that.data.imageBBase64,
      Timestamp: parseInt(new Date().getTime() / 1000),
      Nonce: parseInt(new Date().getTime() / 1000),
      SecretId: that.data.secret_id,
    };
    //把参数按键值大小排序并拼接成字符串
    let data = ksort(param);
    let arr = [];
    for (var x in data) {
      data[x] = encodeURI(data[x]);
      arr.push(x + '=' + data[x]);
    }
    let str = arr.join('&');

    //签名生成

    let sign = 'POSTiai.tencentcloudapi.com/?' + str;
    sign = b64_hmac_sha1(serectkey, sign);
    data['Signature'] = sign;
    console.log("data:", data)
    return data
  },
  submitB() {
    let serectkey = that.data.serectkey;
    let param = {
      Action: 'CompareFace',
      Version: '2018-03-01',
      UrlA: that.data.urla,
      ImageB: that.data.imageBBase64,
      Timestamp: parseInt(new Date().getTime() / 1000),
      Nonce: parseInt(new Date().getTime() / 1000),
      SecretId: that.data.secret_id,
    };
    //把参数按键值大小排序并拼接成字符串
    let data = ksort(param);
    let arr = [];
    for (var x in data) {
      data[x] = encodeURI(data[x]);
      arr.push(x + '=' + data[x]);
    }
    let str = arr.join('&');

    //签名生成

    let sign = 'POSTiai.tencentcloudapi.com/?' + str;
    sign = b64_hmac_sha1(serectkey, sign);
    data['Signature'] = sign;
    console.log("data:", data)
    return data
  },
  powerDrawer: function () {
    this.setData({
      showModelStatus: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    that=this
    console.log(app.globalData.privacy)
    that.setData({
      privacy :app.globalData.pri
    })
    console.log(that.data.privacy)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    that=this
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

function ksort(obj) {
  let temp = 'Action';
  let k_arr = [];
  for (var x in obj) {
    k_arr.push(x);
  }
  k_arr.sort();
  let res = {};
  for (let i = 0; i < k_arr.length; i++) {
    let k = k_arr[i];
    res[k] = obj[k];
  }
  return res;
}
//加密函数
function b64_hmac_sha1(k, d, _p, _z) {
  //_p = b64pad, _z = character size;not used here but I left them available just in case
  if (!_p) { _p = '='; } if (!_z) { _z = 8; } function _f(t, b, c, d) { if (t < 20) { return (b & c) | ((~b) & d); } if (t < 40) { return b ^ c ^ d; } if (t < 60) { return (b & c) | (b & d) | (c & d); } return b ^ c ^ d; } function _k(t) { return (t < 20) ? 1518500249 : (t < 40) ? 1859775393 : (t < 60) ? -1894007588 : -899497514; } function _s(x, y) { var l = (x & 0xFFFF) + (y & 0xFFFF), m = (x >> 16) + (y >> 16) + (l >> 16); return (m << 16) | (l & 0xFFFF); } function _r(n, c) { return (n << c) | (n >>> (32 - c)); } function _c(x, l) { x[l >> 5] |= 0x80 << (24 - l % 32); x[((l + 64 >> 9) << 4) + 15] = l; var w = [80], a = 1732584193, b = -271733879, c = -1732584194, d = 271733878, e = -1009589776; for (var i = 0; i < x.length; i += 16) { var o = a, p = b, q = c, r = d, s = e; for (var j = 0; j < 80; j++) { if (j < 16) { w[j] = x[i + j]; } else { w[j] = _r(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1); } var t = _s(_s(_r(a, 5), _f(j, b, c, d)), _s(_s(e, w[j]), _k(j))); e = d; d = c; c = _r(b, 30); b = a; a = t; } a = _s(a, o); b = _s(b, p); c = _s(c, q); d = _s(d, r); e = _s(e, s); } return [a, b, c, d, e]; } function _b(s) { var b = [], m = (1 << _z) - 1; for (var i = 0; i < s.length * _z; i += _z) { b[i >> 5] |= (s.charCodeAt(i / 8) & m) << (32 - _z - i % 32); } return b; } function _h(k, d) { var b = _b(k); if (b.length > 16) { b = _c(b, k.length * _z); } var p = [16], o = [16]; for (var i = 0; i < 16; i++) { p[i] = b[i] ^ 0x36363636; o[i] = b[i] ^ 0x5C5C5C5C; } var h = _c(p.concat(_b(d)), 512 + d.length * _z); return _c(o.concat(h), 512 + 160); } function _n(b) { var t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", s = ''; for (var i = 0; i < b.length * 4; i += 3) { var r = (((b[i >> 2] >> 8 * (3 - i % 4)) & 0xFF) << 16) | (((b[i + 1 >> 2] >> 8 * (3 - (i + 1) % 4)) & 0xFF) << 8) | ((b[i + 2 >> 2] >> 8 * (3 - (i + 2) % 4)) & 0xFF); for (var j = 0; j < 4; j++) { if (i * 8 + j * 6 > b.length * 32) { s += _p; } else { s += t.charAt((r >> 6 * (3 - j)) & 0x3F); } } } return s; } function _x(k, d) { return _n(_h(k, d)); } return _x(k, d);
}
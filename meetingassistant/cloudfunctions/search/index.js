// 云函数入口文件
const cloud = require('wx-server-sdk');
cloud.init({
  env: 'cloudtestcxs',
  traceUser: true,
});
const db=cloud.database();


// 云函数入口函数
exports.main = async (event, context) => {
  console.log(event.openid)
  try{
  return await
    db.collection('user').doc('oVDJZ5B1jaCZnihCv6d3nfGgLb0A').update({
      username:'cddrxy'
    })
  } catch(e){
    console.error
  }
}
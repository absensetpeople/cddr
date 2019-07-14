// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database({
  env: 'cloudtestcxs',
  traceUser: true,
})
const _=db.command

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return await db.collection('record').doc(event.id).update({
    data:{
      text:_.push({speaker:event.speaker,str:event.str,recording:event.url})
    }
  })
}
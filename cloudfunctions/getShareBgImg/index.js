// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    shareBgImg: 'http://www.ytmp3.cn/down/49676.mp3'
  }
}
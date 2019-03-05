// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    musicUrl: 'http://www.ytmp3.cn/down/49676.mp3',
    imgUrls: ["cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupV1.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupV2.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupV4.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupV5.jpg"],
    imgTitles: ["照片描述1",
      "照片描述2",
      "照片描述3",
      "照片描述4"],
    shareBgImg: 'http://img2.ph.126.net/L6FVeUGtfFnRT7QXLTR86Q==/2100366276315540902.jpg'
  }
}
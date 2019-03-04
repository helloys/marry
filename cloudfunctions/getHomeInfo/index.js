// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    musicUrl: 'http://www.ytmp3.cn/down/49676.mp3',
    imgUrls: ["cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-22-57_moment2.png",
      "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-22-57_moment2.png",
      "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-22-57_moment2.png",
      "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-22-57_moment2.png"],
    imgTitles: ["照片描述1",
      "照片描述2",
      "照片描述3",
      "照片描述4"],
  }
}
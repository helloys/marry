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
    imgTitles: ["茫茫人海、感谢相遇",
      "一路走来、风雨同行",
      "相伴到老、余生是你",
      "小爽与大聪"],
    shareBgImg: 'http://img1.ph.126.net/yHFO54L8gGCjU4fUI7w60g==/6608193525799473199.png'
  }
}
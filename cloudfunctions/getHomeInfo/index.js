// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  return {
    musicUrl: 'http://www.ytmp3.cn/down/49676.mp3',
    imgUrls: ["cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h1.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h23.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h29.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h8.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h28.jpg",
      "cloud://marry-6752d6.6d61-marry-6752d6/marryPhoto/h27.jpg"],
    imgTitles: ["茫茫人海、感谢相遇",
      "一路走来、风雨同行",
      "相伴到老、余生是你",
      "小爽与大聪",
      "遇上方知有",
      "斯人若彩虹"],
    shareBgImg: 'http://img1.ph.126.net/yHFO54L8gGCjU4fUI7w60g==/6608193525799473199.png'
  }
}
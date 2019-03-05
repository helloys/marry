// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const curDate = Date.now()

  const date1 = new Date('2019-02-17T04:00:00')

  if (curDate < date1) {
    return {
      inviteName: 'Mr.余&Miss.张',
      inviteDateOne: '谨定于 2019年3月16日',
      inviteDateTwo: '农历 己亥年二月初十 举办婚礼',
      inviteAddress: '地址：湖北省枝江市陶家湖养殖场 ',
      inviteLongitude: 111.900516,
      inviteLatitude: 30.480652,
      bgImg: "cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupH1.jpg"
    }
  } else {
    return {
      inviteName: 'Mr.余&Miss.张',
      inviteDateOne: '谨定于 2019年5月16日',
      inviteDateTwo: '农历 己亥年四月十二 举办婚礼',
      inviteAddress: '地址：额尔古纳市莫尔道嘎姐妹酒家',
      inviteLongitude: 120.778869,
      inviteLatitude: 51.260169,
      bgImg: "cloud://marry-6752d6.6d61-marry-6752d6/appMaterial/groupH1.jpg"
    }
  }
}
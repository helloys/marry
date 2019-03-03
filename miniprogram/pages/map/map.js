/**
 * 需要上传信息
 * inviteLongitude:经度
 * inviteLatitude:纬度
 */
let inviteName = 'Mr.余&Miss.张'
let inviteDateOne = '谨定于 2019年3月16日'
let inviteDateTwo = '农历 己亥年二月初十 举办婚礼'
let inviteAddress = '地址：湖北省枝江市陶家湖养殖场 '
let inviteLongitude = 111.900516
let inviteLatitude = 30.480652

Page({
  data: {
    inviteName: inviteName,
    inviteDateOne: inviteDateOne,
    inviteDateTwo: inviteDateTwo,
    inviteAddress: inviteAddress,
    inviteLongitude: inviteLongitude,
    inviteLatitude: inviteLatitude,
    bgImg: "cloud://marry-6752d6.6d61-marry-6752d6/2019-2-5-23-34-42_moment0.jpg"
  },


  onLoad: function () {
    this.getMapInfo()
  },

  /**
   * 地图导航
   */
  markertap(e) {
    wx.openLocation({
      latitude: this.data.inviteLatitude,
      longitude: this.data.inviteLongitude,
      scale: 18,
      name: '',
      address: ''
    })
  },

  getMapInfo() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getMapInfo',
      data: {},
      success: res => {
        const mapInfo = res.result
        this.setData({
          inviteName: mapInfo.inviteName,
          inviteDateOne: mapInfo.inviteDateOne,
          inviteDateTwo: mapInfo.inviteDateTwo,
          inviteAddress: mapInfo.inviteAddress,
          inviteLongitude: mapInfo.inviteLongitude,
          inviteLatitude: mapInfo.inviteLatitude,
          bgImg: mapInfo.bgImg
        })
      },
      fail: err => {
        console.error("getMapInfo fail")
      }
    })
  },

  test() {
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
        bgImg: "cloud://marry-6752d6.6d61-marry-6752d6/2019-2-5-23-34-42_moment0.jpg"
      }
    } else {
      return {
        inviteName: 'Mr.余&Miss.张',
        inviteDateOne: '谨定于 2019年5月16日',
        inviteDateTwo: '农历 己亥年二月初十 举办婚礼',
        inviteAddress: '地址：内蒙古 ',
        inviteLongitude: 111.900516,
        inviteLatitude: 30.480652,
        bgImg: "cloud://marry-6752d6.6d61-marry-6752d6/2019-2-5-23-34-42_moment0.jpg"
      }
    }
  }
})
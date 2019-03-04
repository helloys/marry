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

const app = getApp()

Page({
  data: {
    inviteName: inviteName,
    inviteDateOne: '',//inviteDateOne,
    inviteDateTwo: '',//inviteDateTwo,
    inviteAddress: '',//inviteAddress,
    inviteLongitude: inviteLongitude,
    inviteLatitude: inviteLatitude,
    bgImg: '',
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
    wx.showLoading({
      //title: '加载中',
    })

    setTimeout(() => {
      wx.hideLoading()
    }, 2000)


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
        wx.hideLoading()
      },
      fail: err => {
        console.error("getMapInfo fail")
      }
    })
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    app.globalData.bHomePage = false
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShare()
  }
})
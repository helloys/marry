/**
 * 需要上传信息
 * inviteLongitude:经度
 * inviteLatitude:纬度
 */
let inviteName = 'Mr.王&Miss.刘'
let inviteDateOne = '谨定于 2018年8月18日'
let inviteDateTwo = '农历 2018年七月初八 举办婚礼'
let inviteAddress = '地址：沧州市盐山县庆云镇前簸箕村(点击导航)'
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
    bgImg: ""
  },


  onLoad: function () {
  },

  /**
   * 地图导航
   */
  markertap(e) {
    wx.openLocation({
      latitude: inviteLatitude,
      longitude: inviteLongitude,
      scale: 18,
      name: '',
      address: ''
    })
  },
})
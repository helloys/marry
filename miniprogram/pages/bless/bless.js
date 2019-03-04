const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    moments: [],
    aaa: ""
  },

  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src
    let url = target.dataset.urls

    wx.previewImage({
      current: src,
      urls : url
    })
  },

  getMomentList() {
    var that = this
    const db = wx.cloud.database()
    db.collection('moments').get({
      success(res) {
        that.setData({
          moments: res.data.reverse() 
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.bHomePage = false
    
    this.getMomentList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShare()
  }
})

var musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
var imgUrlsDefault = [
  "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-22-57_moment2.png"
                      ]

const app = getApp()

Page({
  data: {
    autoplay: true,
    isPlayingMusic: false,
    music_url: "",

    swiperCurrentIndex: 0,
    imgUrls: [],
    imgDescs: null,
    indicatorDots: true,
    autoplay: true,
    interval: 3600,
    duration: 1800,
  },

  //生命周期函数--监听页面加载
  onLoad: function (data) {
    this.getHomeInfo()
    // this.play()
    // this.setData({
    //   imgUrls: imgUrlsDefault
    // })
  },

  play: function (event) {
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    } else {
      console.log('this.data.music_url', this.data.music_url)
      wx.playBackgroundAudio({
        dataUrl: this.data.music_url,
        title: '',
        coverImgUrl: ''
      })
      this.setData({
        isPlayingMusic: true
      })
    }
  },

  // 获取首页图片和背景音乐
  getHomeInfo() {
    wx.showLoading({
      //title: '加载中',
    })

    setTimeout(() => {
      wx.hideLoading()
    }, 2000)

    // 调用云函数
    wx.cloud.callFunction({
      name: 'getHomeInfo',
      data: {},
      success: res => {
        const homeInfo = res.result
        this.setData({
          music_url: homeInfo.musicUrl,
          imgUrls: homeInfo.imgUrls,
          imgTitles: homeInfo.imgTitles
        })
        wx.hideLoading()
        this.play()
      },
      fail: err => {
        console.error("getMapInfo fail")
        this.play()
      }
    })
  },

  onSwiperChange(e) {
    this.data.swiperCurrentIndex = e.detail.current

    if (app.globalData.bHomePage === true) {  
      this.updateTitle()
    }
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {
    app.globalData.bHomePage = true

    this.updateTitle()
  },

  updateTitle: function () {
    const imgTitles = this.data.imgTitles
    if (imgTitles != null && imgTitles !== undefined && imgTitles.length > 0) {
      const index = this.data.swiperCurrentIndex
      const curTitle = this.data.imgTitles[index]
      wx.setNavigationBarTitle({
        title: curTitle
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const info = app.onShare()
    console.log(info)
    return info
  }
})
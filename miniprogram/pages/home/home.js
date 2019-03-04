
var musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'
var imgUrlsDefault = ["cloud://marry-6752d6.6d61-marry-6752d6/2019-2-1-14-44-23_moment0.jpg",
  "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-16-27-48_moment0.png",
  "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-16-27-48_moment1.png",
  "cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-17-19-22_moment0.png"
                      ]

Page({
  data: {
    autoplay: true,
    isPlayingMusic: false,
    music_url: musicUrl,
    imgUrls: ["cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-15-42-0_moment0.png"]

    // swiperCurrentIndex: 0,
    // imgUrls: imgUrlsDefault,
    // indicatorDots: true,
    // autoplay: true,
    // interval: 3600,
    // duration: 1800,
  },

  //生命周期函数--监听页面加载
  onLoad: function (data) {
    this.play()
    this.setData({
      imgUrls: imgUrlsDefault
    })
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
  }
})
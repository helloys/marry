
var musicUrl = 'http://www.ytmp3.cn/down/49676.mp3'

Page({
  data: {
    autoplay: true,
    isPlayingMusic: false,
    music_url: musicUrl,
    imgUrls: ["cloud://marry-6752d6.6d61-marry-6752d6/2019-1-4-15-42-0_moment0.png"]
  },

  //生命周期函数--监听页面加载
  onLoad: function (data) {
    this.play()
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
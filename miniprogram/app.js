//app.js
const UNPROMPTED = 0
const UNAUTHORIZED = 1
const AUTHORIZED = 2

let userInfo
const cloudUrlHead = "cloud://marry-6752d6.6d61-marry-6752d6/"

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    this.globalData = {
      openid: null,
      shareBgImg: "http://img1.ph.126.net/yHFO54L8gGCjU4fUI7w60g==/6608193525799473199.png"
    }
  },


  data: {
    locationAuthType: UNPROMPTED,
    userInfo: null,
    headCloudPath: null
  },

  login({ success, error }) {
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] === false) {

          this.data.locationAuthType = UNAUTHORIZED
          // 已拒绝授权
          wx.showModal({
            title: '提示',
            content: '请授权我们获取您的用户信息',
            showCancel: false
          })
          error && error()
        } else {
          if (this.data.locationAuthType === UNAUTHORIZED) {
            this.data.locationAuthType = UNPROMPTED
            error && error()
          } else {
            this.getUserInfo({ success, error })
          }
        }
      }
    })
  },

  getUserInfo({ success, error }) {

     // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              userInfo = res.userInfo
              this.data.userInfo = userInfo
              success && success({
                userInfo
              })

              // 保存头像，防止失效
              this.saveHeadImg(userInfo)
            },
            fail: ()=> {
              error && error()
            }
          })
        }
      }
    })
  },

  checkSession({ success, error }) {
    if (userInfo) {
      return success && success({
        userInfo
      })
    }

    wx.checkSession({
      success: () => {
        this.getUserInfo({
          success: res => {
            this.data.locationAuthType = AUTHORIZED
            success && success({
              userInfo
            })
          },
          fail: () => {
            if (this.data.locationAuthType === AUTHORIZED) {
              this.data.locationAuthType = UNPROMPTED
            }
            error && error()
          }
        })
      },
      fail: () => {
        if (this.data.locationAuthType === AUTHORIZED) {
          this.data.locationAuthType = UNPROMPTED
        }
        error && error()
      }
    })
  },


  // 分享
  onShare() {
    const bgShare = this.globalData.shareBgImg
    return {
      title: '邀请您参加余爽张莒璇的婚礼',
      imageUrl: bgShare,
      path: "pages/index/index",
      success: function (res) {
        wx.showToast({
          title: '分享成功',
        })
      },
      fail: function (res) {
        // 转发失败
        wx.showToast({
          title: '分享取消',
        })
      }
    }
  },

  prefixInteger(num, n) {
    return (Array(n).join(0) + num).slice(-n);
  },

  saveHeadImg(userInfo) {
    let that = this

    let headUrl = userInfo.avatarUrl
    let nickName = userInfo.nickName
    // 把头像转存到云端，防止失效
    wx.downloadFile({
      url: headUrl,
      success(res) {
        if (res.statusCode === 200) {

          let headImg = res.tempFilePath

          wx.saveFile({
            tempFilePath: headImg,
            success (dres) {
              
              const d1 = new Date()
              const curTimeStr = `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}`
              const cloudPathEnd = headImg.match(/\.[^.]+?$/)[0]
              const cloudPath = `head/${curTimeStr}-${nickName}${cloudPathEnd}`

              that.data.headCloudPath = cloudUrlHead + cloudPath

              let filePath = dres.savedFilePath
              wx.cloud.uploadFile({
                cloudPath,
                filePath,
              })

            }
          })
        }
      }
    })
  }
})

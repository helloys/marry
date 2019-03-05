// pages/add-comment/add-comment.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,

    logged: false,

    commentValue: '',
    commentImages: [],
    imageVertical: [],

    bgShare: ''
  },

  onLoad: function () {
    // 同步授权状态
    this.onTapLogin()
    // // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           this.setData({
    //             userInfo: res.userInfo
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
  },

  onGetUserInfo: function (e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        userInfo: res.userInfo
      })
    }
  },

  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },




  uploadImage(cb) {
    let commentImages = this.data.commentImages
    let images = []
    let d1 = new Date()
    const curTimeStr = `${d1.getFullYear()}-${d1.getMonth()}-${d1.getDay()}-${d1.getHours()}-${this.prefixInteger(d1.getMinutes(), 2)}-${this.prefixInteger(d1.getSeconds(), 2)}`
    
    if (commentImages.length) {
      let length = commentImages.length
      for (let i = 0; i < length; i++) {
        const filePath = commentImages[i]
        const cloudPathEnd = filePath.match(/\.[^.]+?$/)[0] 
        const cloudPath = `${curTimeStr}_moment${i}${cloudPathEnd}`
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            images.push(res.fileID)
            length--
            if (length <= 0) {
              cb && cb(images)
            }
          },
          fail: () => {
            length--
          }
        })
      }
    } else {
      cb && cb(images)
    }
  },

  prefixInteger(num, n) {
    return(Array(n).join(0) + num).slice(-n);
  },

  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim()
    })
  },

  chooseImage() {
    let currentImages = this.data.commentImages
    let currentVerticals = this.data.imageVertical
    var that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: res => {
        wx.getImageInfo({
          src: res.tempFilePaths[0],
          success: function (res) {
            if (res.height > res.width) {
              currentVerticals = currentVerticals.concat(true)
            } else {
              currentVerticals = currentVerticals.concat(false)
            }
            that.data.imageVertical = currentVerticals
          }
        })
        currentImages = currentImages.concat(res.tempFilePaths)

        let end = currentImages.length
        let begin = Math.max(end - 3, 0)
        currentImages = currentImages.slice(begin, end)

        this.setData({
          commentImages: currentImages
        })

      },
    })
  },

  previewImg(event) {
    let target = event.currentTarget
    let src = target.dataset.src

    wx.previewImage({
      current: src,
      urls: this.data.commentImages
    })
  },

  addMoment(event) {
    let content = this.data.commentValue
    if (!content) return

    wx.showLoading({
      title: '正在发布'
    })

    const head = this.data.userInfo.avatarUrl || "/images/user-unlogin.png"
    const name = this.data.userInfo.nickName || "匿名"
    const d1 = new Date()
    const curTimeStr = `${d1.getFullYear()}-${d1.getMonth()}-${d1.getDay()} ${d1.getHours()}:${this.prefixInteger(d1.getMinutes(), 2)}:${this.prefixInteger(d1.getSeconds(), 2)}`
    let bVertical = false
    if (this.data.commentImages.length == 1 && this.data.imageVertical[0]) {
      bVertical = true
    } else if (this.data.commentImages.length == 2 && this.data.imageVertical[0] && this.data.imageVertical[1]) {
      bVertical = true
    }

    this.uploadImage( images => {
      const db = wx.cloud.database()
      db.collection('moments').add({
        data: {
          avatarUrl: head,
          nickName: name,
          time: curTimeStr,
          words: content,
          photos: images,
          oneVertical: bVertical,
          comments: []
        },
        success: res => {
          wx.hideLoading()

          wx.showToast({
            title: '发布成功'
          })

          setTimeout(() => {
            // todo_
            // wx.navigateBack()
          }, 1500)
          // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
        },
        fail: err => {
          wx.hideLoading()

          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
          // console.error('[数据库] [新增记录] 失败：', err)
        },
      })
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.bHomePage = false

    this.setData({
      comments: "",
      commentImages: [],
      imageVertical: []
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShare()
  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },
})
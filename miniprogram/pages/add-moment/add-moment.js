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
    compressedImages: [],
    waitUpload: 0,

    bgShare: '',

    canWidth: 512,
    canHeight: 512,


    // 未查看回复
    interactions: null,
    seenInteracts: {},
    notSeenInteracts: [],
    waitData: 0,

    bLoaded: false,

    // 回复
    bReply: false,
    targetName: '',
    currentInteract: null,
    replyValue: '',
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


  uploadImage(cb) {
    let commentImages = this.data.commentImages
    if (commentImages.length) {
      let waitUpload = this.data.waitUpload
      if (waitUpload === 0) {
        cb && cb(this.data.compressedImages)
        return
      }

      let curIndex = commentImages.length - waitUpload

      const filePath = commentImages[curIndex]
      // compress
      this.drawCanvas(filePath, ()=>{this.uploadImage(cb)})

    } else {
      let images = []
      cb && cb(images)
    }
  },


  //
  drawCanvas: function (file, cb) {  // 缩放图片
    const ctx = wx.createCanvasContext('attendCanvasId');
    let that = this;

    wx.getImageInfo({
      src: file,
      success: function (res) {
        if (res.width > 1024 || res.height > 1024) {//判断图片是否超过500像素
          let scale = res.width / res.height//获取原图比例
          if (scale > 1) {
            that.setData({//构造画板宽高
              canWidth: 1024,
              canHeight: 1024 / scale
            })
          } else {
            that.setData({//构造画板宽高
              canWidth: 1024 * scale,
              canHeight: 1024
            })
          } 


          let { pixelRatio } = wx.getSystemInfoSync()

          //画出压缩图片
          ctx.drawImage(file, 0, 0, that.data.canWidth, that.data.canHeight);
          ctx.draw();
          //等待压缩图片生成
          var st = setTimeout(function () {
            that.prodImageOpt(cb);
            clearTimeout(st);
          }, 3000);
        } else {
          //上传图片
          that.uploadFileOpt(file, cb);
        }
      }
    })
  },

  prodImageOpt: function (cb) {// 获取压缩图片路径
    var that = this;
    wx.canvasToTempFilePath({
      destWidth: that.data.canWidth,
      destHeight: that.data.canHeight,
      canvasId: 'attendCanvasId',
      success: function success(res) {
        // 上传图片
        that.uploadFileOpt(res.tempFilePath, cb);
      },
    });
  },

  uploadFileOpt: function (filePath, cb) {//上传图片
    let that = this;
    let images = this.data.compressedImages
    let waitLength = this.data.waitUpload
    const curIndex = this.data.commentImages.length - waitLength

    const d1 = new Date()
    const curTimeStr = `${d1.getFullYear()}-${d1.getMonth() + 1}-${d1.getDate()}-${d1.getHours()}-${this.prefixInteger(d1.getMinutes(), 2)}-${this.prefixInteger(d1.getSeconds(), 2)}`
    const cloudPathEnd = filePath.match(/\.[^.]+?$/)[0]
    const cloudPath = `${curTimeStr}_moment${curIndex}${cloudPathEnd}`

    wx.cloud.uploadFile({
      cloudPath,
      filePath,
      success: res => {
        images.push(res.fileID)
        waitLength--

        that.data.compressedImages = images
        that.data.waitUpload = waitLength
        
        cb && cb(images)
      },
      fail: () => {
        waitLength--
        that.data.waitUpload = waitLength
        cb && cb(images)
      }
    })
  },

  //



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

        // 分别获取图片是否竖直
        res.tempFilePaths.forEach( element => {
          wx.getImageInfo({
            src: element,
            success: function (res) {
              if (res.height > res.width) {
                currentVerticals = currentVerticals.concat(true)
              } else {
                currentVerticals = currentVerticals.concat(false)
              }
              let end2 = currentVerticals.length
              let begin2 = Math.max(end2 - 3, 0)
              currentVerticals = currentVerticals.slice(begin2, end2)
              that.data.imageVertical = currentVerticals
            }
          })
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
    let that = this
    let content = this.data.commentValue
    if (!content) return

    wx.showLoading({
      title: '正在发布'
    })

    const head = this.data.userInfo.avatarUrl || "/images/user-unlogin.png"
    const name = this.data.userInfo.nickName || "匿名"
    const d1 = new Date()
    const curTimeStr = `${d1.getFullYear()}-${d1.getMonth()+1}-${d1.getDate()} ${d1.getHours()}:${this.prefixInteger(d1.getMinutes(), 2)}:${this.prefixInteger(d1.getSeconds(), 2)}`
    let bVertical = false
    if (this.data.commentImages.length == 1 && this.data.imageVertical[0]) {
      bVertical = true
    } else if (this.data.commentImages.length == 2 && this.data.imageVertical[0] && this.data.imageVertical[1]) {
      bVertical = true
    }

    this.data.waitUpload = this.data.commentImages.length
    let headCloudUrl = app.data.headCloudPath
    //console.log(headCloudUrl)

    this.uploadImage( images => {

      const db = wx.cloud.database()

      db.collection('moments').add({
        data: {
          avatarUrl: headCloudUrl,
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
            wx.switchTab({
              url: '/pages/bless/bless',
            })
          }, 1500)
          // console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
          that.clearData()
        },
        fail: err => {
          wx.hideLoading()

          wx.showToast({
            icon: 'none',
            title: '发布失败'
          })
          // console.error('[数据库] [新增记录] 失败：', err)
          that.clearData()
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

    this.closeReply()
    
    if (this.data.bLoaded) {
      // 刷新 最新的未读 回复信息
      this.tryGetNotSeenReply()
    } else {
      this.data.bLoaded = true
    }
  },

  clearData: function () {
    this.setData({
      commentValue: "",
      commentImages: [],
      imageVertical: [],
      compressedImages: [],
      waitUpload: 0,
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
    let that = this
    app.login({
      success: ({ userInfo }) => {
        that.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })

        // 获取未查看 新的 回复
        that.getOpenid(()=>{
          that.tryGetNotSeenReply()
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
      }
    })
  },

  tryGetNotSeenReply: function() {
    // 获取openid，获取未查看 新的 回复
    if (!!app.globalData.openid) {
      this.setData({
        notSeenInteracts: []
      })

      this.data.waitData = 2
      this.getInteractionList()
      this.getHaveSeenInteract()
    }
  },

  getOpenid: function (success) {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        //console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        
        success && success()
        // wx.navigateTo({
        //   url: '../userConsole/userConsole',
        // })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },

  // 获得所有评论数据
  getInteractionList() {
    var that = this
    // 调用云函数
    wx.cloud.callFunction({
      name: 'getInteractions',
      data: {},
      success: res => {
        that.setData({
          interactions: res.result.data
        })
        that.tryGetNotSeenInteract()
      }
    })
  },

  // 获取已经查看过的 回复 列表
  getHaveSeenInteract() {
    var that = this
    const db = wx.cloud.database()
    db.collection('seenInteracts').get({
      success(res) {
        if (res.data.length > 0) {
          that.setData({
            seenInteracts: res.data[0]
          })
        }
      },
      complete() {
        that.tryGetNotSeenInteract()
      }
    })
  },

  // 获取为查看过的 回复 列表
  tryGetNotSeenInteract() {
    this.data.waitData = this.data.waitData - 1
    if (this.data.waitData == 0) {
      const interacts = this.data.interactions
      const seenInteracts = this.data.seenInteracts
      let haveSeens = null
      if (!!this.data.seenInteracts && !!seenInteracts.haveSeens) {
        haveSeens = seenInteracts.haveSeens
      }
    
      const myopenid = app.globalData.openid
      let allInteracts = []
      let notSeens = this.data.notSeenInteracts

      interacts.forEach( interactItem => {

        if (interactItem.toOpenid == myopenid) {
          const interactID = interactItem._id
          allInteracts.push(interactID)
          // 空 或者 包含
          if (!haveSeens || !haveSeens.includes(interactID)) {
            notSeens.push(interactItem)
          }
        }
        
      })
      // 显示未查看回复
      this.setData({
        notSeenInteracts: notSeens
      })

      // 更新存储，已查看到最新
      const db = wx.cloud.database()
      if (notSeens.length > 0) {
        if (!haveSeens) {
          db.collection('seenInteracts').add({
            data: {
              haveSeens: allInteracts
            }
          })
        } else {
          db.collection('seenInteracts').doc(seenInteracts._id).update({
            data: {
              haveSeens: allInteracts
            }
          })
        }
      }
    }
  },

  // 对别人的评论 进行 回复
  tryReplyOther(event) {
    const target = event.currentTarget
    const interact = target.dataset.src

    this.setData({
      bReply: true,
      targetName: interact.fromName,
      currentInteract: interact,
    })
  },
  
  onReplyInput(event) {
    this.setData({
      replyValue: event.detail.value.trim()
    })
  },

  // 回复
  onClickReply() {
    const replyWords = this.data.replyValue
    if (!replyWords) return;

    let that = this
    // fromOpenid 表里会自动生成
    const fromName = this.data.userInfo.nickName
    // 如果是回复评论
    let curInteract = this.data.currentInteract
    let momentid = curInteract.momentid
    let toOpenid = curInteract._openid
    let toName = curInteract.fromName
    let bToMoment = false
    let toInteracid = curInteract._id
    const replyTime = Date.now()

    wx.showLoading({
      title: '正在回复'
    })
    const db = wx.cloud.database()
    db.collection('interactions').add({
      data: {
        momentid: momentid,
        fromName: fromName,
        replyWords: replyWords,
        toOpenid: toOpenid,
        toName: toName,
        replyTime: replyTime,
        bToMoment: bToMoment,
        toInteracid: toInteracid
      },
      success: res => {
        wx.hideLoading()

        wx.showToast({
          title: '回复成功'
        })

        this.closeReply()
      },
      fail: err => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '回复失败'
        })
        that.closeReply()
      },
    })
  },

  // 隐藏回复
  closeReply() {
    this.setData({
      bReply: false,
      targetName: "",
      replyValue: "",
    })
  },
})
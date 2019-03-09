const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    moments: [],
    interactions: {},

    bReply: false,
    targetName: '',
    currentMoment: null,
    currentInteract: null,
    replyValue: '',
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
    this.onTapLogin()
  },

    /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.bHomePage = false
    this.data.userInfo = app.data.userInfo
    
    this.getMomentList()
    this.getInteractionList()

    this.closeReply()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShare()
  },


  // 点击动态回复 动态主体
  onClickMoment(event) {
    // 没有登陆，跳转登陆页面
    if (!this.data.userInfo) {
      wx.switchTab({
        url: '/pages/add-moment/add-moment'
      })
      return;
    }

    const target = event.currentTarget
    const moment = target.dataset.src
    this.setData({
      bReply: true,
      targetName: moment.nickName,
      currentMoment: moment,
      currentInteract: null,
      replyValue: ""
    })
  },

  onReplyInput(event) {
    this.setData({
      replyValue: event.detail.value.trim()
    })
  },

  // 对别人的评论 进行 回复
  tryReplyOther(event) {
    // 没有登陆，跳转登陆页面
    if (!this.data.userInfo) {
      wx.switchTab({
        url: '/pages/add-moment/add-moment'
      })
      return;
    }

    const target = event.currentTarget
    const interact = target.dataset.src

    // 自己的评论  1 客户端缓存
    if (interact._id === 0) return;
    if (interact.fromName === this.data.userInfo.nickName) return;

    this.setData({
      bReply: true,
      targetName: interact.fromName,
      currentMoment: null,
      currentInteract: interact,
      replyValue: ""
    })
  },

  // 回复
  onClickReply() {
    const replyWords = this.data.replyValue
    if (!replyWords) return;

    let that = this
    const curMoment = this.data.currentMoment
    let momentid = '0'
    // fromOpenid 表里会自动生成
    const fromName = this.data.userInfo.nickName
    let toOpenid = '0'
    let toName = '0'
    let bToMoment = true
    let toInteracid = '0'
    if (!!curMoment) {
      momentid = curMoment._id
      toOpenid = curMoment._openid
      toName = curMoment.fromName
      bToMoment = true
      toInteracid = '0'
    }
    // 如果是回复评论
    let curInteract = this.data.currentInteract
    if (!!curInteract) {
      momentid = curInteract.momentid
      toOpenid = curInteract._openid
      toName = curInteract.fromName
      bToMoment = false
      toInteracid = curInteract._id
    }

    this.addReply(momentid, fromName, replyWords, toOpenid, toName, bToMoment, toInteracid)

    // 临时数据填充，刷新UI
    let temp = {
      _id: 0,
      momentid: momentid,
      fromName: fromName,
      replyWords: replyWords,
      toOpenid: toOpenid,
      toName: toName,
      replyTime: '',
      bToMoment: bToMoment,
      toInteracid: toInteracid
    }
    let interacts = this.data.interactions
    if (momentid in interacts) {
      interacts[momentid].push(temp)
    } else {
      interacts[momentid] = [temp]
    }
    this.setData({
      interactions: interacts
    })
  },

  addReply(momentid, fromName, replyWords, toOpenid, toName, bToMoment, toInteracid) {

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

  // 获得所有评论数据
  getInteractionList() {
    var that = this
    const db = wx.cloud.database()
    db.collection('interactions').get({
      success(res) {

        const interacts = res.data
        let momentsReplay = {}
        interacts.forEach( interact => {
          const momentid = interact.momentid
          if (momentid in momentsReplay) {
            momentsReplay[momentid].push(interact)
          } else {
            momentsReplay[momentid] = [interact]
          }
        })
        that.setData({
          interactions: momentsReplay
        })
      }
    })
  },

  // 隐藏回复
  closeReply() {
    this.setData({
      bReply: false,
      targetName: "",
      currentMoment: null,
      replyValue: "",
    })
  },

  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
    })
  }
})
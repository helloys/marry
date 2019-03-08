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

    // todo_ 修改为moments

    db.collection('testMoments').get({
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
    
    this.getMomentList()
    this.getInteractionList()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return app.onShare()
  },


  // 点击动态回复 动态主体
  onClickMoment(event) {
    console.log("onClickMoment")
    const target = event.currentTarget
    const moment = target.dataset.src
    this.setData({
      bReply: true,
      targetName: moment.nickName,
      currentMoment: moment,
      replyValue: ""
    })
  },

  onReplyInput(event) {
    this.setData({
      replyValue: event.detail.value.trim()
    })
  },

  // 回复
  onClickReply() {
    console.log("onClickReply")
    const replyWords = this.data.replyValue
    if (!replyWords) return;

    let that = this
    const moment = this.data.currentMoment
    const momentid = moment._id
    // fromOpenid 表里会自动生成
    const fromName = this.data.userInfo.nickName
    const toOpenid = moment._openid
    const toName = moment.nickName
    const bToMoment = true
    const toInteracid = ''

    this.addReply(momentid, fromName, replyWords, toOpenid, toName, bToMoment, toInteracid)

    // 临时数据填充，刷新UI
    let temp = {
      bTemp: true,
      momentid: momentid,
      fromName: fromName,
      replyWords: replyWords,
      toOpenid: toOpenid,
      toName: toName,
      replyTime: '',
      bToMoment: bToMoment,
      toInteracid: toInteracid
    }
    let curInteract = this.data.interactions
    if (momentid in curInteract) {
      curInteract[momentid].push(temp)
    } else {
      curInteract[momentid] = [temp]
    }
    this.setData({
      interactions: curInteract
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

  // 对别人的评论 进行 回复
  tryReplyOther(event) {
    console.log("tryReplyOther")
    const target = event.currentTarget
    const interact = target.dataset.src
    console.log(interact)

    // 自己的评论  1 客户端缓存
    if (!!interact[bTemp]) return;
    if (interact[fromName] === this.data.userInfo.nickName) return;

    this.setData({
      bReply: true,
      targetName: interact.fromName,
      currentMoment: moment,
      replyValue: ""
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
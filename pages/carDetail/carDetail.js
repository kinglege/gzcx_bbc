const app = getApp();
// pages/carDetail/carDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    comment_focus: false,
    comment_content: ''

  },
  hideModal(e) {
    this.setData({
      modalName: null,
      comment_focus: false
    })
  },


  carDetail(e) {
    console.log(e)
    let series_id=e.currentTarget.dataset.series_id
    wx.navigateTo({
      url: '/pages/detail/detail?series_id=' + series_id,
    })
  },

  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/carDetail/carDetail?id=' + e.currentTarget.dataset.id,
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.news_id = options.id
    this.RefreshData()

  },

  RefreshData() {
    this.getComment()
    let that = this
    if (wx.getStorageSync('open_id')) {
      that.getDetail()
      return false
    }
    this.setData({
      loadModal: true
    })
    wx.login({
      success(res) {
        console.log(res)
        app.request({
          url: `wx/get_openid`,
          method: 'POST',
          data: {
            code: res.code
          }
        }).then((res) => {
          that.setData({
            loadModal: false
          })
          if (res.openid) {
            wx.setStorageSync('open_id', res.openid)
            app.session_key = res.session_key
            that.getDetail()
          } else {
            wx.showLoading({
              title: '服务器错误',
              icon: 'none'
            })
          }

        })
      }
    })

  },
  
  getDetail() {
    this.setData({
      loadModal: true
    })
    app.auth_request({
      url: 'news/' + this.news_id,
      params: {
        user_id: app.userInfo ? app.userInfo.id : 0
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        detail_info: res,
        loadModal: false
      })
    })
  },


  // 评论接口
  getComment() {
    app.auth_request({
      url: 'comment',
      params: {
        id: this.news_id,
        type: 1,
        user_id: app.userInfo ? app.userInfo.id : 0
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        getComment: res.data
      })
    })

  },


  // 点赞接口
  postZan() {
    app.auth_request({
      url: 'collection',
      method: "POST",
      data: {
        info_id: this.news_id,
        info_type: 1,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.detail_info.praise_num++
          this.data.detail_info.is_praise = 1
        this.setData({
          detail_info: this.data.detail_info
        })
        wx.showToast({
          title: '点赞成功',
        })
      }
    })
  },

  // 取消点赞
  cancelZan() {
    app.auth_request({
      url: 'collection/cancel',
      method: "POST",
      params: {
        info_id: this.news_id,
        info_type: 1,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.detail_info.praise_num--
          this.data.detail_info.is_praise = 0
        this.setData({
          detail_info: this.data.detail_info
        })
        wx.showToast({
          title: '取消点赞',
        })
      }
    })
  },


  // 评论点赞接口
  postZan2(e) {
    let index = e.currentTarget.dataset.index
    app.auth_request({
      url: 'collection',
      method: "POST",
      data: {
        info_id: e.currentTarget.dataset.id,
        info_type: 3,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.getComment[index].praise_num++
          this.data.getComment[index].is_praise = 1
        this.setData({
          getComment: this.data.getComment
        })
      }
    })
  },

  // 取消点赞
  cancelZan2(e) {
    let index = e.currentTarget.dataset.index
    app.auth_request({
      url: 'collection/cancel',
      method: "POST",
      params: {
        info_id: e.currentTarget.dataset.id,
        info_type: 3,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.getComment[index].praise_num--
          this.data.getComment[index].is_praise = 0
        this.setData({
          getComment: this.data.getComment
        })
      }
    })
  },

  // 回复点赞接口
  postZan3(e) {
    let index = e.currentTarget.dataset.index
    let index1 = e.currentTarget.dataset.index1
    app.auth_request({
      url: 'collection',
      method: "POST",
      data: {
        info_id: e.currentTarget.dataset.id,
        info_type: 3,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.getComment[index].children[index1].praise_num++
          this.data.getComment[index].children[index1].is_praise = 1
        this.setData({
          getComment: this.data.getComment
        })
      }
    })
  },

  // 取消点赞
  cancelZan3(e) {
    let index = e.currentTarget.dataset.index
    let index1 = e.currentTarget.dataset.index1
    app.auth_request({
      url: 'collection/cancel',
      method: "POST",
      params: {
        info_id: e.currentTarget.dataset.id,
        info_type: 3,
        type: 1,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.getComment[index].children[index1].praise_num--
          this.data.getComment[index].children[index1].is_praise = 0
        this.setData({
          getComment: this.data.getComment
        })
      }
    })
  },

  // 收藏
  collect() {
    app.auth_request({
      url: 'collection',
      method: "POST",
      data: {
        info_id: this.news_id,
        info_type: 1,
        type: 2,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.detail_info.is_collection = 1
        this.setData({
          detail_info: this.data.detail_info
        })
        wx.showToast({
          title: '收藏成功',
        })
      }
    })
  },


  // 取消收藏
  cancelCollect() {
    app.auth_request({
      url: 'collection/cancel',
      method: "POST",
      params: {
        info_id: this.news_id,
        info_type: 1,
        type: 2,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        // this.data.detail_info.praise_num--
        this.data.detail_info.is_collection = 0
        this.setData({
          detail_info: this.data.detail_info
        })
        wx.showToast({
          title: '取消收藏',
        })
      }

    })
  },





  check_reply(e) {
    console.log(e)
    let page_name = 'reply_page_' + e.currentTarget.dataset.item.id
    console.log(this[page_name])
    let comment_index = e.currentTarget.dataset.index
    if (this[page_name] != undefined) {
      this[page_name]++
    } else {
      this[page_name] = 0
    }
    app.auth_request({
      url: 'comment/reply_list',
      params: {
        top_id: e.currentTarget.dataset.item.id,
        page: this[page_name],
        user_id: app.userInfo ? app.userInfo.id : 0
      }
    }).then((res) => {
      this.data.getComment[comment_index].children = this.data.getComment[comment_index].children.concat(res.data)
      this.setData({
        getComment: this.data.getComment
      })
      console.log(this.data.getComment)
      // this.setData({
      //   getreply: res.data
      // })
    })
  },

  hide_reply(e) {
    let page_name = 'reply_page_' + e.currentTarget.dataset.item.id
    this[page_name] = undefined
    let comment_index = e.currentTarget.dataset.index
    this.data.getComment[comment_index].children = []
    this.setData({
      getComment: this.data.getComment
    })
  },
  commentInput(e) {
    this.setData({
      comment_content: e.detail.value
    })
  },

  top_comment() {
    this.setData({
      comment_focus: true,
      modalName: 'commentModal'
    })
    this.comment_pid = 0
    this.comment_top_id = 0
  },

  comment_reply(e) {
    this.setData({
      comment_focus: true,
      modalName: 'commentModal'
    })
    this.reply_comment_index = e.currentTarget.dataset.index
    this.comment_pid = e.currentTarget.dataset.pid
    this.comment_top_id = e.currentTarget.dataset.top_id
  },



  comment_post() {
    if (!this.data.comment_content.length) {
      wx.showToast({
        title: '评论内容不能为空！',
        icon: "none"
      })
      return false
    }
    app.auth_request({
      method: 'POST',
      url: 'comment',
      data: {
        main_id: this.news_id,
        content: this.data.comment_content,
        pid: this.comment_pid,
        top_id: this.comment_top_id
      }
    }).then((res) => {
      this.hideModal()
      if (res.status == 200) {
        this.setData({
          comment_content: ''
        })
        this.getDetail()

        console.log(res)
        if (this.comment_top_id) {
          this.data.getComment[this.reply_comment_index].children.unshift(res.data)
        } else {
          this.data.getComment.unshift(res.data)
        }
        this.setData({
          getComment: this.data.getComment
        })
      }
    })
  },

  previewImage: function(e) {
    console.log(e)
    let images = []
    this.data.detail_info.info.forEach((item) => {
      if (item.type == 1) {
        images.push(item.url)
      }
    })
    let index = 0
    images.forEach((item, idx) => {
      if (item == e.currentTarget.dataset.url) {
        index = idx
      }
    })
    wx.previewImage({
      //当前显示下表
      current: images[index],
      urls: images
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */


  onShareAppMessage: function(res) {
    if (res.from === "button") {

    }
    return {
      title: this.data.detail_info.title,
      imageUrl: this.data.detail_info.cover_url,
      path: '/pages/carDetail/carDetail?id=' + this.data.detail_info.id // 路径，传递参数到指定页面。
    }
  }

})
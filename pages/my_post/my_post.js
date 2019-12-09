// pages/my_post/my_post.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.RefreshData()
  },
  RefreshData() {
    this.getMyPost()
  },


  // 我的帖子
  getMyPost() {
    app.auth_request({
      url: 'news/my',
      params: {
        page: 0
      }

    }).then((res) => {
      console.log(res);
      this.setData({
        myPost: res
      })
    })
  },
  detail(e) {
    console.log(e)
    let news_id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/carDetail/carDetail?id=' + news_id,
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
  onShareAppMessage: function() {

  }
})
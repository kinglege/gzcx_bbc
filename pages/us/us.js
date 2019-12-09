const app = getApp()
// pages/information/information.js
Page({


  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    userInfo:{}
  },
  
  /**
   * 生命周期函数--监听页面加载
   */

  getSet(){
    wx.navigateTo({
      url: '/pages/set/set',
    })
  },
  collect(){
    wx.navigateTo({
      url: '/pages/collect/collect',
    })
  },
  myPost(){
    wx.navigateTo({
      url: '/pages/my_post/my_post',
    })
  },

  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onLoad: function (options) {
    
  },
  RefreshData() {
    this.getUserinfo()
  },


  getUserinfo() {
    this.setData({
      loadModal: true
    })
    app.auth_request({
      url: 'user/info_byopenid',
      params: {
        open_id: wx.getStorageSync('open_id')
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        userinfo: res
      })
      if (res.status == 200) {
        app.userInfo = res.data
        this.setData({
          auth: true
        })
      } else {
        this.setData({
          auth: false
        })
      }
    })
  },


  
  loginBtn(){
    wx.navigateTo({
      url: '/pages/auth/auth',
    })
  },
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.RefreshData()
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
    this.RefreshData()
    clearTimeout(this.PullDownTime)
    this.PullDownTime = setTimeout((function(){
      wx.stopPullDownRefresh()
    }),2000)
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
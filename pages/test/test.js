const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    goodsList: [{
      img: '../../images/info_left.png',
      dzzs: '22',
      collected: 1,
      id: 1
    },
    {
      img: '../../images/info_left.png',
      dzzs: '33',
      collected: 0,
      id: 2
    },
    {
      img: '../../images/info_left.png',
      dzzs: '44',
      collected: 1,
      id: 3
    },
    {
      img: '../../images/info_left.png',
      dzzs: '555',
      collected: 1,
      id: 4
    }
    ]
    
  },
  // 更改点赞状态
  onCollectionTap: function (event) {
    // 获取当前点击下标
    var index = event.currentTarget.dataset.index;
    // data中获取列表
    var message = this.data.goodsList;
    for (let i in message) { //遍历列表数据
      if (i == index) { //根据下标找到目标
        var collectStatus = false
        if (message[i].collected == 0) { //如果是没点赞+1
          collectStatus = true
          message[i].collected = parseInt(message[i].collected) + 1
        } else {
          collectStatus = false
          message[i].collected = parseInt(message[i].collected) - 1
        }
        wx.showToast({
          title: collectStatus ? '收藏成功' : '取消收藏',
        })
      }
    }
    this.setData({
      goodsList: message
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(){
    
  },
  

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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

  }
})
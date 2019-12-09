const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    TabCur: 0,
    scrollLeft: 0,
    keyword: "",
    select_topic: [],
    new_topic: false
  },

  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },


  // 获取当前页信息
  getTopic() {
    app.auth_request({
      url: 'topic',
      params: {
        keyword: this.data.keyword
      }
    }).then((res) => {
      console.log(res)

      this.setData({
        topic: res
      })

      if (this.data.select_topic.length) {
        this.data.topic.forEach((item, index) => {
          item.select = false
        })
        this.data.topic.forEach((item, index) => {
          this.data.select_topic.forEach((item2, index2) => {
            if (item.id == item2.id) {
              item.select = true
            }
          })
        })
      }
      this.setData({
        topic: this.data.topic
      })

      this.data.topic.forEach((item) => {
        this.setData({
          new_topic: true
        })
        if (item.title == this.data.topic_title) {
          this.setData({
            new_topic: false
          })
        }
      })
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      select_topic: JSON.parse(options.select_topic)
    })
    this.getTopic()
  },

  huati(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    this.data.select_topic.push(item)
    this.setData({
      select_topic: this.data.select_topic
    })
    console.log(this.data.select_topic)
    console.log(this.data.topic)

    if (this.data.select_topic.length) {
      this.data.topic.forEach((item, index) => {
        item.select = false
      })
      this.data.topic.forEach((item, index) => {
        this.data.select_topic.forEach((item2, index2) => {
          if (item.id == item2.id) {
            item.select = true
          }
        })
      })
    }
    this.setData({
      topic: this.data.topic
    })
    console.log(this.data)
  },



  del_topic(e) {
    this.data.select_topic.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      select_topic: this.data.select_topic
    })

    this.data.topic.forEach((item, index) => {
      item.select = false
    })
    this.data.topic.forEach((item, index) => {
      this.data.select_topic.forEach((item2, index2) => {
        if (item.id == item2.id) {
          item.select = true
        }
      })
    })
    this.setData({
      topic: this.data.topic
    })
    console.log(this.data)
  },

  search(e) {
    console.log(e)
    this.data.keyword = e.detail.value
    this.getTopic()
    this.setData({
      topic_title: e.detail.value
    })
  },
  addNewHuati() {
    let tmp = 1;
    for (let i in this.data.select_topic) {
      if (this.data.select_topic[i].title == this.data.topic_title) {
        tmp = 0;
        break
      }
    }
    if (tmp == 0) {
      return
    }
    let item = {
      attention_num: "0",
      title: this.data.topic_title,
      topic_use_count: "0",
      type: 1
    }
    this.data.select_topic.push(item)
    this.setData({
      select_topic: this.data.select_topic
    })
  },
  back() {
    var pages = getCurrentPages(); //获取页面栈
    if (pages.length > 1) {
      //上一个页面实例对象
      var prePage = pages[pages.length - 2];
      //调用上一个页面的onShow方法
      console.log(prePage)
      prePage.setData({
        select_topic: this.data.select_topic
      })
    }
    wx.navigateBack({
      delta: 1
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
  // onShareAppMessage: function () {

  // }
})
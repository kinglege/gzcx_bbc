const app = getApp()
import utils from '../../utils/util.js'
const VodUploader = require('../../lib/vod-wx-sdk-v2.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    title: '',
    content: '',
    posts_elements: [],
    select_topic: []
  },


  back: function() {
    wx.showActionSheet({
      itemList: ['存为草稿', '不保存'],
      success: function(res) {
        wx.navigateBack({
          delta: 1
        })
      },
      fail: function(res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let data = JSON.parse(options.data)
    this.setData({
      posts_elements: data
    })
    console.log(this.data.posts_elements)
  },
  onAddImage() {
    let that = this
    wx.chooseImage({
      success: (res) => {
        res.tempFilePaths.forEach((item2) => {
          let item = {}
          item.type = 1
          item.tempFilePath = item2
          item.remark = ''
          that.data.posts_elements.push(item)
        })
        that.setData({
          posts_elements: that.data.posts_elements
        })
        that.pageScrollToBottom()
      }
    })
  },
  onAddVideo() {
    let that = this
    wx.chooseVideo({
      sourceType: ['album', 'camera'],
      compressed: true,
      maxDuration: 60,
      success: (res) => {
        console.log(res)

        let item = {}
        item.type = 3
        item.tempFilePath = res.tempFilePath
        item.thumbTempFilePath = res.thumbTempFilePath
        item.remark = ''
        that.data.posts_elements.push(item)
        that.setData({
          posts_elements: that.data.posts_elements
        })
        console.log(this.data.posts_elements)
        that.pageScrollToBottom()
      }
    })
  },
  downward_elements(e) {
    let index = e.currentTarget.dataset.index
    if (index + 1 != this.data.posts_elements.length) {
      this.setData({
        posts_elements: this.swapArray(this.data.posts_elements, index, index + 1)
      })
    }
  },
  del_topic(e) {
    this.data.select_topic.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      select_topic: this.data.select_topic
    })
  },
  upward_elements(e) {
    let index = e.currentTarget.dataset.index
    if (index != 0) {
      this.setData({
        posts_elements: this.swapArray(this.data.posts_elements, index, index - 1)
      })
    }

  },
  show_delete_elements_model(e) {
    this.setData({
      modalName: 'bottomModal'
    })
    this.delete_elements_index = e.currentTarget.dataset.index
  },
  delete_elements(e) {
    this.data.posts_elements.splice(this.delete_elements_index, 1)
    console.log(this.data)
    this.setData({
      posts_elements: this.data.posts_elements,
      modalName: null
    })
  },
  hideModel() {
    this.setData({
      modalName: null
    })
  },
  onAddText() {
    let item = {}
    item.text = ''
    item.type = 2
    this.data.posts_elements.push(item)
    this.setData({
      posts_elements: this.data.posts_elements
    })
    this.pageScrollToBottom()
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function() {
    var that = this;
    var height = wx.getSystemInfoSync().windowHeight;
    wx.createSelectorQuery().select('#page').boundingClientRect(function(rect) {
      console.log(rect)
      if (rect) {
        that.setData({
          scrollTop: 100000
        })
      }
    }).exec()
  },

  //上移 将当前数组index索引与后面一个元素互换位置，向数组后面移动一位
  zIndexUp(arr, index, length) {

  },
  //下移 将当前数组index索引与前面一个元素互换位置，向数组前面移动一位
  zIndexDown(arr, index, length) {
    if (index + 1 != length) {
      return this.swapArray(arr, index, index + 1);
    }

  },
  swapArray(arr, index1, index2) {
    arr[index1] = arr.splice(index2, 1, arr[index1])[0];
    return arr;
  },

  remark_input(e) {
    console.log(e)
    this.data.posts_elements[e.currentTarget.dataset.index].remark = e.detail.value
    console.log(this.data.posts_elements)
  },
  text_input(e) {
    this.data.posts_elements[e.currentTarget.dataset.index].text = e.detail.value
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var height = wx.getSystemInfoSync().windowHeight;
    this.setData({
      windowHeight: height
    })
    console.log(this.data)
  },


  toCoverEditor(e) {
    console.log(e)
    this.data.posts_elements.forEach((res, index) => {
      if (res.type == 2 && !res.text) {
        this.data.posts_elements.splice(index, 1)
      }
    })
    this.setData({
      posts_elements: this.data.posts_elements
    })
    if (this.data.posts_elements.length <= 0) {
      wx.showToast({
        title: '帖子内容不能为空哦',
        icon: 'none'
      })
      return
    }
    let data = {}
    data.title = this.data.title
    data.content = this.data.content
    data.posts_elements = this.data.posts_elements
    let tmp = JSON.stringify(data)
    wx.navigateTo({
      url: '/pages/cover_editor/index?data=' + tmp + '&select_topic=' + JSON.stringify(this.data.select_topic),
    })
  },


  onAddTopic() {
    wx.navigateTo({
      url: '/pages/huati/huati?select_topic=' + JSON.stringify(this.data.select_topic),
    })
  },



  titleInput(e) {
    console.log(e.detail.value)
    this.setData({
      title: e.detail.value,
    })
  },
  contentInput(e) {
    console.log(e.detail.value)
    this.setData({
      content: e.detail.value,
    })
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
  // onPullDownRefresh: function() {

  // },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage: function() {

  // }
})
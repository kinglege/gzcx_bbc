const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar, 
    currentTab: 0,
    TabCur: 0,
    scrollLeft:0

  },
  /**
    * tab点击切换
    */
  changTab: function (event) {
    this.setData({
      currentTab: event.target.dataset.current
    })
  },


  imgSum(){
    wx.navigateTo({
      url: '/pages/pho/pho',
    })
  },

  btnAsk(){
    wx.navigateTo({
      url: '/pages/ask/ask',
    })
  },
  
  Detail(){
    wx.navigateTo({
      url: '/pages/type/type',
    })
  },

  carsContent(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/carDetail/carDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let series_id = options.series_id
    this.setData({
      series_id
    })
    this.RefreshData()
  },

  RefreshData() {
    this.getDetail()
  },

  // 详情接口
  getDetail() {
    app.auth_request({
      url: 'car/series_detail',
      params:{
        series_id:this.data.series_id
      },
    }).then((res) => {
      console.log(res);
      this.setData({
        seriesDetail: res
      })
    this.init()
    })
  },


  // 将一维数组转为二维数组
  init() {
    let arr = this.data.seriesDetail.model//拿到对象中对象
    console.log(arr)
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]);//数组合并
      // console.log(ai)
      ai.series = [];
      if (!map[ai.model_year]) {
        dest.push({
          model_year: ai.model_year,
          data: [ai]
        });
        map[ai.model_year] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.model_year == ai.model_year) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    this.setData({
      yearCar: dest,
      listYearCar: dest[0].model_year
    })
    console.log(this.data.yearCar)
  },


  // 汽车年份排序
  yearSort(){
    let arr = this.data.seriesDetail.model
    arr.sort(function (a, b) {
      return b - a;
    })
    console.log(arr);

  },


// 全部车型
  tabSelect(e) {
    console.log(e)
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

// 拨打电话联系我们
  tel(){
    wx.makePhoneCall({
      phoneNumber: '0551-123456789',
    })
  },

  // 收藏
  collect(e) {
    console.log(e)
    let series_id = e.currentTarget.dataset.series_id
    app.auth_request({
      url: 'collection',
      method: "POST",
      data: {
        info_id: series_id,
        info_type: 2,
        type: 2,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        this.data.seriesDetail.is_collection = 1
        this.setData({
          seriesDetail: this.data.seriesDetail
        })
        wx.showToast({
          title: '收藏成功',
        })
      }
    })
  },

  // 取消收藏
  cancelCollect(e) {
    let series_id = e.currentTarget.dataset.series_id
    app.auth_request({
      url: 'collection/cancel',
      method: "POST",
      params: {
        info_id: series_id,
        info_type: 2,
        type: 2,
      }
    }).then((res) => {
      console.log(res)
      if (res.status == 200) {
        // this.data.detail_info.praise_num--
        this.data.seriesDetail.is_collection = 0
        this.setData({
          seriesDetail: this.data.seriesDetail
        })
        wx.showToast({
          title: '取消收藏',
        })
      }

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
  onShareAppMessage: function (res) {
    if (res.from === "button") {

    }
    return {
      title: this.data.seriesDetail.series_name,
      // imageUrl: this.data.detail_info.cover_url,
      path: '/pages/detail/detail?series_id=' + this.data.seriesDetail.series_id // 路径，传递参数到指定页面。
    }
  }
})
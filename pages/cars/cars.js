const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    currentTab: 0,


  },
  /**
   * tab点击切换
   */
  changTab: function(event) {
    this.setData({
      currentTab: event.target.dataset.current
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    this.setData({
      brand_id: options.brand_id
    })
    this.RefreshData()
  },
  RefreshData() {
    this.getSeries()
  },


  carsDetail(e) {
    console.log(e)
    let series_id = e.currentTarget.dataset.series_id
    wx.navigateTo({
      url: '/pages/detail/detail?series_id=' + series_id,
    })
  },


  // 在售/停售
  getSeries() {
    app.request({
      url: "car/series",
      params: {
        brand_id: this.data.brand_id
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        serieCar: res,
      })

      // ------------------
      // var car_titlt = []
      // if (res.on_sale.length > 0) {
      //   for (var i = 0; i < res.on_sale.length; i++) {
      //     car_titlt.push(res.on_sale[i].series_group_name)
      //   }
      //   var car_titlt = [...new Set(car_titlt)]
      //   //  res.on_sale.push(car_titlt)
      //   console.log(res.on_sale)
      // }
      this.init()
    })
  },

  
  // 将一维数组转为二维数组
  init() {
    let arr = this.data.serieCar.on_sale//拿到对象中对象
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]);//数组合并
      // console.log(ai)
      ai.series = [];
      if (!map[ai.series_group_name]) {
        dest.push({
          series_group_name: ai.series_group_name,
          data: [ai]
        });
        map[ai.series_group_name] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.series_group_name == ai.series_group_name) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    this.setData({
      brand: dest,
      listCur: dest[0].series_group_name
    })
    console.log(this.data.brand)
    let arr1 = this.data.serieCar.un_sale

    var map1 = {},
      dest1 = [];
    for (var i = 0; i < arr1.length; i++) {
      var ai1 = Object.assign({}, arr1[i]);
      if (!map1[ai1.series_group_name]) {
        dest1.push({
          series_group_name: ai1.series_group_name,
          data: [ai]
        });
        map1[ai1.series_group_name] = ai1;
      } else {
        for (var j = 0; j < dest1.length; j++) {
          var dj1= dest1[j];
          if (dj1.series_group_name == ai1.series_group_name) {
            dj1.data.push(ai);
            break;
          }
        }
      }
    }
    this.data.brand_all = dest1
    console.log(dest1)
    this.setData({
      brand_all: dest1,
      listCur1: dest1[0].series_group_name
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
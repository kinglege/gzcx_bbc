const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    carcord:[],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    hidden: true,
    id: 0,
    TabCur: 0,
    scrollLeft: 0,

    change: false, // 当两个slider在最右端重合时，将change设置为true，从而隐藏slider2，才能继续操作slider1
    max: 10000, // 两个slider所能达到的最大值
    min: 0, // 两个slider所能取的最小值
    rate: 100, // slider的最大最小值之差和100（或1000）之间的比率
    scale: 1, // 比例系数。页面显示值的时候，需要将slider1Value(slider2Value)乘以比例系数scale
    slider1Max: 10000, // slider1的最大取值
    slider1Value: 0, // slider1的值
    slider2Value: 10000, // slider2的值
    slider2Min: 0, // slider2的最小取值
    slider1W: 100, // slider1的宽度
    slider2W: 0, // slider2的宽度
    leftSliderPriceWidthX: '-1.5%',
    rightSliderPriceWidthX: '-21%',
    hidden: true

  },

  // 开始滑动
  changeStart: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    if (idx === 1) {
      // dW是当前操作的slider所能占据的最大宽度百分数
      var dW = (this.data.slider2Value - this.data.min) / this.data.rate
      this.setData({
        slider1W: dW,
        slider2W: 100 - dW,
        slider1Max: this.data.slider2Value,
        slider2Min: this.data.slider2Value,
        change: false
      })
    } else if (idx === 2) {
      var dw = (this.data.max - this.data.slider1Value) / this.data.rate
      this.setData({
        slider2W: dw,
        slider1W: 100 - dw,
        slider1Max: this.data.slider1Value,
        slider2Min: this.data.slider1Value,
        change: false
      })
    }
  },
 
  // 正在滑动
  changing: function (e) {
    var idx = parseInt(e.currentTarget.dataset.idx)
    var value = e.detail.value
    let rightSliderPriceWidthX = (this.data.max-value)/116-21
    let leftSliderPriceWidthX = value/116
    if (idx === 1) {
      this.setData({
        slider1Value: value,
        leftSliderPriceWidthX:leftSliderPriceWidthX+'%'
      })
    } else if (idx === 2) {
      this.setData({
        slider2Value: value,
        rightSliderPriceWidthX: rightSliderPriceWidthX+'%'
      })
    }
  },
  changed: function (e) {
    if (this.data.slider1Value === this.data.slider2Value && this.data.slider2Value === this.data.max) {
      this.setData({
        change: true
      })
    }
  },




  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },

  
  carSum() {
    wx.navigateTo({
      url: '/pages/xuanche/xuanche',
    })
  },


  btnDetail(e){
    var series_id = e.currentTarget.dataset.series_id
    console.log(e)
    wx.navigateTo({
      url: '/pages/detail/detail?series_id=' + series_id,
    })
  },


  carMore(){
    wx.navigateTo({
      url: '/pages/choose/choose',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  RefreshData(){
    this.getHotCar()
    this.getBrand()
  },

  // 热门车型
  getHotCar(){
    app.auth_request({
      url: 'car/hot_series'
    }).then((res) => {
    console.log(res);
     this.setData({
       hotCar:res
     })
    })
  },



  // 选品牌
  getBrand(){
    app.auth_request({
      url: 'car/brand'
    }).then((res) => {
      // console.log(res);
      this.setData({
        carcord:res
      })
      let list = [];
      for (let i = 0; i < 26; i++) {
        list[i] = String.fromCharCode(65 + i)
      }
      this.init()
    })
  },

  init() {
    let arr = this.data.carcord
    var map = {},
      dest = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]);
      // console.log(ai)
      ai.series = [];
      if (!map[ai.initial]) {
        dest.push({
          initial: ai.initial,
          data: [ai]
        });
        map[ai.initial] = ai;
      } else {
        for (var j = 0; j < dest.length; j++) {
          var dj = dest[j];
          if (dj.initial == ai.initial) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }


    console.log(dest)
    this.setData({
      brand: dest,
      listCur: dest[0].initial
    })
    // console.log(this.data.brand)
    var map1 = {},
      dest1 = [];
    for (var i = 0; i < arr.length; i++) {
      var ai = Object.assign({}, arr[i]);
      if (!map1[ai.initial]) {
        dest1.push({
          initial: ai.initial,
          data: [ai]
        });
        map1[ai.initial] = ai;
      } else {
        for (var j = 0; j < dest1.length; j++) {
          var dj = dest1[j];
          if (dj.initial == ai.initial) {
            dj.data.push(ai);
            break;
          }
        }
      }
    }
    this.data.brand_all = dest1
  },


  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.brand[e.target.id].initial,
    })
  },

  setCur(e) {
    console.log(e)
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.brand[num].initial
      })
    };
  },


  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  toConfiguration(e) {
    let info = JSON.stringify(e.currentTarget.dataset.item.info)
    this.cur_series_name = e.currentTarget.dataset.item.series_name
    wx.setStorageSync('cur_brand_name', this.cur_brand_name)
    wx.setStorageSync('cur_brand_img', this.cur_brand_img)
    wx.setStorageSync('cur_series_name', this.cur_series_name)
    wx.redirectTo({
      url: '/pages/information/all_car/configuration/configuration?info=' + info,
    })
  },
 
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.brand;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i].initial,
          movableY: i * 20
        })
        return false
      }
    }
  },
  toCar(e){
    wx.navigateTo({
      url: '/pages/cars/cars?brand_id=' + e.currentTarget.dataset.brand_id,
    })
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
  // onShareAppMessage: function () {

  // },


  // 索引
  onLoad() {
    this.RefreshData()


  },
  onReady() {
    let that = this;
    wx.createSelectorQuery().select('.indexBar-box').boundingClientRect(function (res) {
      that.setData({
        boxTop: res.top
      })
    }).exec();
    wx.createSelectorQuery().select('.indexes').boundingClientRect(function (res) {
      that.setData({
        barTop: res.top
      })
    }).exec()
  },
  //获取文字信息
  getCur(e) {
    this.setData({
      hidden: false,
      listCur: this.data.brand[e.target.id].initial,
    })
  },

  setCur(e) {
    this.setData({
      hidden: true,
      listCur: this.data.listCur
    })
  },
  //滑动选择Item
  tMove(e) {
    let y = e.touches[0].clientY,
      offsettop = this.data.boxTop,
      that = this;
    //判断选择区域,只有在选择区才会生效
    if (y > offsettop) {
      let num = parseInt((y - offsettop) / 20);
      this.setData({
        listCur: that.data.brand[num].initial
      })
    };
  },

  //触发全部开始选择
  tStart() {
    this.setData({
      hidden: false
    })
  },

  //触发结束选择
  tEnd() {
    this.setData({
      hidden: true,
      listCurID: this.data.listCur
    })
  },
  toConfiguration(e) {
    let info = JSON.stringify(e.currentTarget.dataset.item.info)
    this.cur_series_name = e.currentTarget.dataset.item.series_name
    wx.setStorageSync('cur_brand_name', this.cur_brand_name)
    wx.setStorageSync('cur_brand_img', this.cur_brand_img)
    wx.setStorageSync('cur_series_name', this.cur_series_name)
    wx.redirectTo({
      url: '/pages/information/all_car/configuration/configuration?info=' + info,
    })
  },
  indexSelect(e) {
    let that = this;
    let barHeight = this.data.barHeight;
    let list = this.data.brand;
    let scrollY = Math.ceil(list.length * e.detail.y / barHeight);
    for (let i = 0; i < list.length; i++) {
      if (scrollY < i + 1) {
        that.setData({
          listCur: list[i].initial,
          movableY: i * 20
        })
        return false
      }
    }
  }
})
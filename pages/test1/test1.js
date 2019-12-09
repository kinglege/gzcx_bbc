const app = getApp()
var leftImg = [];//左容器图片
var rightImg = [];//右容器图片
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    imgList: [
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car1.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car2.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car3.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car1.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car3.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car2.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car1.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car1.png'
  
    ],
    imgLeft: [],//左容器图片
    imgRight: [],//右容器图片
    lHeight: 0,//左容器高
    rHeight: 0,//右容器高
    imgWidth: 0,//图片宽

  },
  imgLoad: function (e) {
    //图片原始宽度
    let beforeWidth = e.detail.width;
    //图片原始高度
    let beforeHeight = e.detail.height;
    //图片显示的宽度
    let nowWidth = this.data.imgWidth;
    //比例=图片原始宽度/图片显示的宽度
    let wProportion = beforeWidth / nowWidth;
    //图片显示的高度=图片原始高度/比例
    let imgHeight = beforeHeight / wProportion;

    //当左区域高=右区域高   或   当左区域高<右区域高
    if (this.data.lHeight == this.data.rHeight || this.data.lHeight < this.data.rHeight) {
      leftImg.push(e.target.dataset.url)
      this.setData({
        lHeight: this.data.lHeight + imgHeight
      })
      //当左区域高>右区域高
    } else if (this.data.lHeight > this.data.rHeight) {
      rightImg.push(e.target.dataset.url)
      this.setData({
        rHeight: this.data.rHeight + imgHeight
      })
    }
    //当完成最后一次分组时        
    if (e.target.dataset.index == this.data.imgList.length - 1) {
      this.setData({
        imgLeft: leftImg,
        imgRight: rightImg,
        imgList: []
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取设备参数
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          imgWidth: res.windowWidth * 0.48,
        })
      },
    })
  },
  onReady: function () { },
  onShow: function () { },
  onHide: function () { },
  onUnload: function () { },
  onPullDownRefresh: function () { },
  onReachBottom: function () { },
  onShareAppMessage: function () {

  }
})
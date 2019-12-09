const app = getApp()
Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar, 
    currentTab: 0,
    imgArr: [
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg'
    ],
    imgArr2: [
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car2.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car2.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg'

    ],
    imgArr3: [
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car3.png',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/detail-car.jpg',
      'https://buybuycar.oss-cn-beijing.aliyuncs.com/car3.png'
    ]
  },
  /**
 * tab点击切换
 */
  changTab: function (event) {
    this.setData({
      currentTab: event.target.dataset.current
    })
  },



  waiguan: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr = this.data.imgArr;
    wx.previewImage({
      current: imgArr[index],     //当前图片地址
      urls: imgArr,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  neishi: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr2 = this.data.imgArr2;
    wx.previewImage({
      current: imgArr2[index],     //当前图片地址
      urls: imgArr2,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  kongjian: function (e) {
    console.log(e.currentTarget.dataset.index);
    var index = e.currentTarget.dataset.index;
    var imgArr3 = this.data.imgArr3;
    wx.previewImage({
      current: imgArr3[index],     //当前图片地址
      urls: imgArr3,               //所有要预览的图片的地址集合 数组形式
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  askPrice(){
    wx.navigateTo({
      url: '/pages/ask/ask',
    })
  },

})
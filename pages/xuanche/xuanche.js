const app = getApp();
Page({
  /* 页面的初始数据*/
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,

    // 获取设备高度
    appHeight: '',

    // 筛选导航栏数据
    msgList: [{
        key: 1,
        name: '类型'
      },
      {
        key: 2,
        name: '价格'
      },
      {
        key: 3,
        name: '排序'
      },
      {
        key: 4,
        name: '更多'
      }
    ],

    // 判断导航栏列表是否显示
    meunShow: [{
        isShows: true
      },
      {
        isShows: true
      },
      {
        isShows: true
      },
      {
        isShows: true
      }
    ],


    // 区域右侧是否显示
    rigShow: true,

    // 售价
    type: [{
        id: 0,
        name: '轿车'
      },
      {
        id: 1,
        name: '新能源'
      },
      {
        id: 2,
        name: '轿车'
      },
      {
        id:3,
        name: 'SUV'
      },
      {
        id: 3,
        name: 'MVP'
      },
    ],

    price: [{
        id: 0,
        name: '5万以下'
      },
      {
        id: 1,
        name: '5-10万'
      },
      {
        id: 2,
        name: '10-15万'
      },
      {
        id: 3,
        name: '15-20万'
      },
      {
        id: 4,
        name: '20-25万'
      },
      {
        id: 5,
        name: '25-30万'
      },
      {
        id: 6,
        name: '30-35万'
      },
      {
        id: 7,
        name: '35-40万'
      },
    ],

  },
  // Choose(){
  //   wx.navigateTo({
  //     url: '/pages/detail/detail',
  //   })
  // },
  onLoad: function(options) {
    // 获取设备高度
    var res = wx.getSystemInfoSync();
    this.setData({
      appHeight: res.windowHeight
    });

    console.log(this.data.appHeight)
  },

  // 筛选导航栏事件
  menuClick: function(e) {
    // 获取通过wxml  data-hi="{{ idx }}" 传过来的索引
    var menuNum = e.currentTarget.dataset.hi;

    // 拼接 ，使我们可以获取到menuShow里面每一个isSHows
    var menuSrc = "meunShow[" + menuNum + "].isShows";

    // 循环data中设置的meunShow
    for (var n = 0; n < this.data.meunShow.length; n++) {
      // 拼接 ，使我们可以获取到menuShow里面每一个isSHows
      var menuSrcs = "meunShow[" + n + "].isShows";
      // 解决重复点击不能隐藏的问题
      if (n != menuNum) {
        // 初始化，每次点击时先全部隐藏，但是重复点击不会隐藏
        this.setData({
          [menuSrcs]: true
        });
      };
    };

    // 给当前点击的去反data中设置的meunShow，使之显示， 只写此处只会显示不能隐藏
    this.setData({
      [menuSrc]: !this.data.meunShow[e.currentTarget.dataset.hi].isShows
    });
  },


});
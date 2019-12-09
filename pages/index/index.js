const app = getApp()
const VodUploader = require('../../lib/vod-wx-sdk-v2.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    currentTab: 0,
    progress: 0,
    vidio_progress: 0,
    imgWidth: 0,
    imgHeight: 0,
    loadModal: false,
    note: [],
    data:[],
    page:-1
  },
  /**
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (wx.getStorageSync('open_id')) {
      that.RefreshData()
      return false
    }
    that.setData({
      loadModal: true
    })
    wx.login({
      success(res) {
        console.log(res)
        app.request({
          url: `wx/get_openid`,
          method: 'POST',
          data: {
            code: res.code
          }
        }).then((res) => {
          that.setData({
            loadModal: false
          })
          if (res.openid) {
            wx.setStorageSync('open_id', res.openid)
            app.session_key = res.session_key
            app.request({
              url: "user/login_log",
              method: "POST",
              data: {
                open_id: res.openid
              }
            }).then((res) => {
              console.log(res)
            })
            that.RefreshData()
          } else {
            wx.showLoading({
              title: '服务器错误',
              icon: 'none'
            })
          }

        })
      }
    })
  },
  search() {
    wx.navigateTo({
      url: '/pages/suosou/suosou',
    })
  },

  detail(e) {
    console.log(e)
    wx.navigateTo({
      url: '/pages/carDetail/carDetail?id=' + e.currentTarget.dataset.id,
    })
  },
  
  roughDraft(){
    wx.navigateTo({
      url: '/pages/post/post',
    })
  },


  // 弹框
  showModal(e) {
    console.log(e)
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  /**
   * tab点击切换
   */
  changTab: function(event) {
    this.setData({
      currentTab: event.target.dataset.current
    })
  },


  RefreshData() {
    this.getNews()
    this.getUserinfo()
  },
  getNews() {
    this.setData({
      loadModal: true
    })
    let {
      data,
      page
    } = this.data
    page++
    app.auth_request({
      url: 'news',
      params:{
        page,
      }
    }).then((res) => {
      console.log(res)
      this.setData({
        // note: res.data,
        data: [...data, ...res.data],
        page_count: res.pagination.page_count,
        page,
        loadModal: false,
        hasMore: page < Math.ceil(res.pagination.total / 10) ? true : false
      })
    })
  },

 
  onAddPublish() {
    this.setData({
      modalName: 'bottomModal'
    })
  },
  /**
   * 添加图片
   */
  onAddImage() {
    let that = this
    if(!that.data.auth){
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return false;
    }
    if (!this.data.useradmin.level==1){
      wx.showToast({
        title: "只有管理员才能发帖！",
        icon:"none"
      })
      return
    }
    wx.chooseImage({
      success: (res) => {
        let data = []
        console.log(res)
        res.tempFilePaths.forEach((item2) => {
          let item = {}
          item.type = 1
          item.tempFilePath = item2
          item.remark = ''
          data.push(item)
        })
        that.hideModel()
        wx.navigateTo({
          url: '/pages/news_editor/index?data=' + JSON.stringify(data),
        })
      }
    })
  },

  hideModel() {
    this.setData({
      modalName: null
    })
  },


  onAddVideo() {
    let that = this
    if (!that.data.auth) {
      wx.navigateTo({
        url: '/pages/auth/auth',
      })
      return false;
    } 
    if (!this.data.useradmin.level == 1) {
      wx.showToast({
        title: "只有管理员才能发帖！",
        icon: "none"
      })
      return
    }
    wx.chooseVideo({
      success: (res) => {
        console.log(res)
        let data = []
        let item = {}
        item.type = 3
        item.tempFilePath = res.tempFilePath
        item.thumbTempFilePath = res.thumbTempFilePath
        item.remark = ''
        data.push(item)
        that.hideModel()
        wx.navigateTo({
          url: '/pages/news_editor/index?data=' + JSON.stringify(data),
        })
      }
    })
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
        useradmin:res.data,
        loadModal: false
      })
      if(res.status==200){
        app.userInfo = res.data
        this.setData({
          auth: true
        })
      }else{
        this.setData({
          auth: false
        })
      }
    })
  },


  getSignature: function(callback) {
    app.auth_request({
      baseURL: app.globalData.api_url2,
      url: 'tecent/get_signature'
    }).then((res) => {
      if (res) {
        callback(res)
      } else {
        return '签名计算错误'
      }
    })
  },
  
  publish() {
    if (this.invitation) {
      let that = this
      let i = 0;
      let posts_length = 1
      this.invitation.posts_elements.forEach((item) => {
        if (item.type == 1 || item.type == 3) {
          posts_length++
        }
      })
      let progress = 0;
      console.log(that.invitation)
      wx.uploadFile({
        url: app.globalData.api_url2 + '/oss/upload', //仅为示例，非真实的接口地址
        filePath: that.invitation.cover_tmp_ur,
        name: 'file',
        success: function({
          data
        }) {
          i++
          let res = JSON.parse(data)
          that.invitation.cover_url = res.data.url
          progress = Math.ceil(progress + 100 / posts_length) > 100 ? 100 : Math.ceil(progress + 100 / posts_length)
          that.setData({
            progress: progress
          })
          console.log(progress)
          if (i >= posts_length) {
            wx.showModal({
              title: '上传完成'
            })
            that.setData({
              upload_finish: true
            })
            that.post_invitation()
          }
        }
      })
      that.invitation.posts_elements.forEach((item) => {
        console.log(item)
        if (item.type == 1) {
          wx.uploadFile({
            url: app.globalData.api_url2 + '/oss/upload', //仅为示例，非真实的接口地址
            filePath: item.tempFilePath,
            name: 'file',
            success: function({
              data
            }) {
              i++
              let res = JSON.parse(data)
              item.img_url = res.data.url
              progress = Math.ceil(progress + 100 / posts_length) > 100 ? 100 : Math.ceil(progress + 100 / posts_length)
              that.setData({
                progress: progress
              })
              console.log(progress)
              if (i >= posts_length) {
                wx.showModal({
                  title: '上传完成'
                })
                that.setData({
                  upload_finish: true
                })
                that.post_invitation()

              }

            }
          })
        }
        if (item.type == 3) {
          VodUploader.start({
            mediaFile: item, //必填，把chooseVideo回调的参数(file)传进来
            getSignature: that.getSignature, //必填，获取签名的函数

            mediaName: '测试视频', //选填，视频名称，强烈推荐填写(如果不填，则默认为“来自微信小程序”)
            success: function(result) {

            },
            error: function(result) {
              // console.log('error');
              // console.log(result);
              // wx.showModal({
              //   title: '上传失败',
              //   content: JSON.stringify(result),
              //   showCancel: false
              // });
            },
            progress: function(result) {
              let vidio_progress = Math.ceil(result.percent * 100 / posts_length)
              console.log(vidio_progress)
              that.setData({
                vidio_progress: vidio_progress
              })

            },
            finish: function(result) {
              console.log(result)
              i++
              item.fileId = result.fileId
              item.coverUrl = result.coverUrl
              item.videoName = result.videoName
              item.videoUrl = result.videoUrl
              if (i >= posts_length) {
                wx.showModal({
                  title: '上传完成'
                })
                that.setData({
                  upload_finish: true
                })
                that.post_invitation()
              }
            }
          })
        }
      })
    }
  },
  post_invitation() {
    if (this.invitation) {
      app.auth_request({
        baseURL: app.globalData.api_url,
        url: 'news',
        method: 'POST',
        data: {
          title: this.invitation.title,
          content: this.invitation.content,
          cover_url: this.invitation.cover_url,
          data: JSON.stringify(this.invitation.posts_elements),
          topic: JSON.stringify(this.select_topic)
        }
      }).then((res) => {
        this.RefreshData()
        console.log(res)
      })
    }
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

    this.RefreshData()
    clearTimeout(this.PullDownTime)
    wx.stopPullDownRefresh()
    // this.PullDownTime = setTimeout((function() {
    //   wx.stopPullDownRefresh()
    // }), 2000)

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.page <= this.data.page_count) {
      this.getNews()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})
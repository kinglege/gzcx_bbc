const app = getApp()
import CanvasDrag from '../../components/canvas-drag/canvas-drag';
const VodUploader = require('../../lib/vod-wx-sdk-v2.js');

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    graph: {},
    box_height: 938,
    c_width: 690,
    c_height: 938,
    focus: false,
  },
  onLoad(options) {
    this.setData({
      posts_elements: JSON.parse(options.data).posts_elements,
      invitation: JSON.parse(options.data),
      select_topic:JSON.parse(options.select_topic)
    })

    for (let i in this.data.posts_elements) {
      if (this.data.posts_elements[i].type == 1) {
        this.changeBgImage(this.data.posts_elements[i].tempFilePath);
        break;
      }
    }
    let image = 0;
    for (let i in this.data.posts_elements) {
      if (this.data.posts_elements[i].type == 1) {
        image++
      }
    }
    if (image == 0){
      this.onChangeBgImage()
    }

  },
  /**
   * 添加测试图片
   */
  onAddTest() {
    this.setData({
      graph: {
        w: 120,
        h: 120,
        type: 'image',
        url: '../../assets/images/test.jpg',
      }
    });
  },

  /**
   * 添加图片
   */
  onAddImage() {
    wx.chooseImage({
      success: (res) => {
        this.setData({
          graph: {
            w: 200,
            h: 200,
            type: 'image',
            url: res.tempFilePaths[0],
          }
        });
      }
    })
  },

  /**
   * 添加文本
   */
  onAddText() {
    let text_count = 0;
    let draw_arr = CanvasDrag.getSelect()
    draw_arr.forEach((item) => {
      if (item.type == 'text') {
        text_count++
      }
    })
    if (text_count >= 1) {
      return false;
    }
    this.setData({
      graph: {
        type: 'text',
        text: '你想编写',
      },
    });
    this.focus()
  },
  onEditorText() {
    let text_count = 0;
    let draw_arr = CanvasDrag.getSelect()
    draw_arr.forEach((item) => {
      if (item.type == 'text') {
        text_count++
      }
    })
    if (text_count <= 0) {
      this.setData({
        graph: {
          type: 'text',
          text: '你想编写',
        },
      });
    } else {
      CanvasDrag.select()
    }
    this.focus()
  },
  focus() {
    this.setData({
      focus: true
    })
  },
  /**
   * 导出图片
   */
  onExport() {

    var FSM = wx.getFileSystemManager();
    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        // wx.previewImage({
        //     urls: [filePath]
        // })
        wx.uploadFile({
          url: 'http://api.mocar.gzcxjt.com' + '/oss/upload', //仅为示例，非真实的接口地址
          filePath: filePath,
          name: 'file',
          success: function({
            data
          }) {
            let res = JSON.parse(data)
            console.log(res)
            if (res.error === 0) {
              that.data.images.push(res.url)
              that.setData({
                images: that.data.images
              })
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'none'
              })
            }
          }
        })
      })
      .catch((e) => {
        console.error(e);
      })
  },

  /**
   * 改变文字颜色
   */
  onChangeColor() {
    CanvasDrag.changFontColor('blue');
  },

  /**
   * 改变文字
   */
  onChangeText(e) {
    console.log(e)
    CanvasDrag.changFontText(e.detail.value);
  },

  /**
   * 改变背景颜色
   */
  onChangeBgColor() {
    CanvasDrag.changeBgColor('yellow');
  },

  // 上传背景图片
  onChangeBgImage() {
    let that = this
    wx.chooseImage({
      count: 1,
      success: (res) => {
        console.log(res)
        that.changeBgImage(res.tempFilePaths[0])
      }
    })
  },
  setBg(e) {
    this.changeBgImage(e.currentTarget.dataset.tempfilepath)
  },
  /**
   * 改变背景照片
   */
  changeBgImage(url) {
    let that = this
    wx.getImageInfo({
      src: url,
      success: function(res) {
        console.log(res.width)
        console.log(res.height)
        let draw_start_height = 0
        let draw_start_width = 0
        let bg_width = 690
        let bg_hieght = that.data.box_height
        if (res.height > res.width || res.height < res.width) {
          if (res.height > res.width) {
            that.setData({
              c_width: 690,
              c_height: that.data.box_height
            })
          } else {
            that.setData({
              c_width: 690,
              c_height: 400
            })
          }

          let scale = res.width / that.data.c_width;
          console.log('scale:' + scale)
          bg_hieght = Math.ceil(res.height / scale)
          bg_width = that.data.c_width
          draw_start_height = -(bg_hieght - that.data.c_height) / 4
          // let 
        } else {
          bg_width = 690
          bg_hieght = 690
          that.setData({
            c_width: 690,
            c_height: 690
          })
        }

        wx.showLoading({
          mask: true
        })
        let time = 0;
        that.draw_interval = setInterval((function() {
          time++
          if (time >= 10) {
            clearInterval(that.draw_interval)
            wx.hideLoading()
          }
          CanvasDrag.changeBgImage(url, draw_start_width, draw_start_height, bg_width, bg_hieght);
        }), 100)
      }
    })
  },
  getSignature: function(callback) {
    app.auth_request({
      url: 'tecent/get_signature'
    }).then((res) => {
      console.log(this.data.posts_elements[0])
      if (res) {
        callback(res)
      } else {
        return '签名计算错误'
      }
    })
  },
  blur() {
    this.setData({
      focus: false
    })
  },

  publish() {
    let that = this
    var FSM = wx.getFileSystemManager();

    CanvasDrag.export()
      .then((filePath) => {
        console.log(filePath);
        this.data.invitation.cover_tmp_ur = filePath
        var pages = getCurrentPages();//获取页面栈
        if (pages.length > 1) {
          //上一个页面实例对象
          var prePage = pages[pages.length - 3];
          //调用上一个页面的onShow方法
          console.log(prePage)
          prePage.invitation = this.data.invitation
          prePage.select_topic = this.data.select_topic
          prePage.publish()
        }
        wx.navigateBack({
          delta: 2
        })
      })
   

  }
})
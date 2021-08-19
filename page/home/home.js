// miniprogram/pages/my/my.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import $api from '../../util/httputils.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isShow: true,
    clicKmask: true,
    list: [],
  },

  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      // console.log(res.detail.userInfo)
      // this.setData({
      //   userInfo: res.detail.userInfo,
      //   isShow: false,
      // });
      wx.switchTab({
        url: 'home',
      })
   
   
    }  else {
      //用户按了拒绝按钮
      wx.showModal({
          title: '警告',
          content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
          showCancel: false,
          confirmText: '返回授权',
          success: function(res) {
              // 用户没有授权成功，不需要改变 isHide 的值
              if (res.confirm) {
                  console.log('用户点击了“返回授权”');
              }
          }
      });
  }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    wx.getStorage({
      key: 'userInfo',
      success: function (res) {
        // success
        // console.log(res)
        that.setData({
          userInfo: res.data,
          isShow: false
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userInfo']) {
          // console.log('已授权')

          wx.getUserInfo({
            success: function (res) {
              // success
              // console.log(res);
              that.setData({
                isShow: false,
                userInfo: res.userInfo
              })
              wx.setStorage('userInfo', res.userInfo)
              const userInfo = res.userInfo

              wx.login({
                success (res) {
                  if (res.code) {
                    //发起网络请求
                    // 登录 或 注册
                    $api._get(`/userInfo/register?code=${res.code}`).then(result => {
                      console.log(userInfo)
                      if(result.code == 200) {
                        const openId = result.res;
                       
                        const userInfoBo = {};
                        userInfoBo.nickName = userInfo.nickName;
                        userInfoBo.gender = userInfo.gender;
                        userInfoBo.openId = openId;
                        userInfoBo.country = userInfo.country;
                        userInfoBo.city = userInfo.city;
                        userInfoBo.province = userInfo.province;

                        $api._post("/userInfo/saveOrUpdate", userInfoBo).then(res2 => {
                          
                        })
                      }
                    })
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })

            },
            fail: function () {
              // fail
            },
            complete: function () {
              // complete
            }
          })

        } else {
          console.log('未授权');
        }
      },
      fail: () => { },
      complete: () => { }
    });

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
  onShareAppMessage: function () {

  }
})
// miniprogram/pages/my/my.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import $api from '../../util/httputils.js';

import {mGet, mPost} from "../../util/request/HttpUtil"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUseGetUserProfile: false,
  },

  bindGetUserInfo(res) {
    console.log('授权')
    if (res.detail.userInfo) {
      let that = this
      wx.getSetting({
        success: (res) => {
          if (res.authSetting['scope.userInfo']) {
            console.log('已授权')
  
            wx.getUserProfile ({
              desc: "huo qu xin xi",
              success: function (res) {
                // success
                // console.log(res);
                that.setData({
                  isShow: false,
                  userInfo: res.userInfo
                })

                wx.setStorageSync("userInfo", that.data.userInfo)

                wx.login({
                  success (res) {
                    if (res.code) {
                      //发起网络请求
                      // 登录 或 注册
                      mGet('/userInfo/register',{"code":res.code}).then(result => {
                        if(result.code == 200) {
                          const openId = result.res;
                          const userInfoBo = that.data.userInfo;
                          userInfoBo.openId = openId
  
                          mPost("/userInfo/saveOrUpdate", userInfoBo).then(res2 => {
                            const userId = res2.res;
                            wx.setStorageSync("userId", userId);
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

      wx.switchTab({  
        url: '/page/home/home',
      })
      // console.log("ttttt")
   
    } else {
      // console.log("jujuju")
    }
  },

  getUserProfile(e) {
    let that = this;
    // 推荐使用wx.getUserProfile获取用户信息，开发者每次通过该接口获取用户个人信息均需用户确认
    // 开发者妥善保管用户快速填写的头像昵称，避免重复弹窗
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })

        wx.setStorageSync("userInfo", that.data.userInfo)

        wx.login({
          success (res) {
            if (res.code) {
              //发起网络请求
              // 登录 或 注册
              mGet('/userInfo/register', {"code":res.code}).then(result => {
                if(result.code == 200) {
                  const openId = result.res;
                  const userInfoBo = that.data.userInfo;
                  userInfoBo.openId = openId

                  mPost("/userInfo/saveOrUpdate", userInfoBo).then(res2 => {
                    const userId = res2.res;
                    wx.setStorageSync("userId", userId);

                  })
                }
              })
            } else {
              console.log('登录失败！' + res.errMsg)
            }
          }
        })

      }
    })
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

    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
    }

    wx.getSetting({
      success: (res) => {
        console.log('授权11')
        if (res.authSetting['scope.userInfo']) {
          console.log('已授权')

          wx.getUserProfile ({
            desc: "ss",
            success: function (res) {
              // success
              // console.log(res);
              that.setData({
                isShow: false,
                userInfo: res.userInfo
              })
              
            
              wx.setStorageSync("userInfo", that.data.userInfo)

              wx.login({
                success (res) {
                  if (res.code) {
                    //发起网络请求
                    // 登录 或 注册
                    mGet('/userInfo/register', {"code":res.code}).then(result => {
                      if(result.code == 200) {
                        const openId = result.res;
                        const userInfoBo = that.data.userInfo;
                        userInfoBo.openId = openId

                        mPost("/userInfo/saveOrUpdate", userInfoBo).then(res2 => {
                          const userId = res2.res;
                          wx.setStorageSync("userId", userId);

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
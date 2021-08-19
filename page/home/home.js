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
    isShow: true,
    clicKmask: true,
    list: [],
  },

  bindGetUserInfo(res) {
    if (res.detail.userInfo) {
      let that = this
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
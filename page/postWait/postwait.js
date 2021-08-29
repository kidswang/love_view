// const db = wx.cloud.database()
// const postCollection = db.collection('post')
// const sourceType = [['camera'], ['album'], ['camera', 'album']]

import {mGet ,mPost} from '../../util/request/HttpUtil'

Page({

  onLoad: function(option) {
    let id = option.id;
    if(id) {
      mGet("/keepsake/selectById", {"id": id}).then(res => {
        let data = res.res;
        console.log(data.message)
        this.setData({
          id: data.id,
          happenDate: data.happenDate,
          inputValue: data.message
        })
      })
    }
  },


  data: {
    id: '',
    openId : '',
    inputValue: '',
    happenDate: ''
  },

  getNowDate() {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const date = [year, month,day].map(formatNumber).join('-')
    this.setData({
      happenDate: date
    })
  },
  
  bindDateChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      happenDate: e.detail.value
    })
  },

  bindKeyInput(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },


  // onShow() {
  //   wx.reportAnalytics('enter_home_programmatically', {})
  // },

  onGotUserInfo(e) {

    let that = this;

    console.dir(e)
    if (e.detail.errMsg != "getUserInfo:ok") {
      wx.showToast({
        title: '未授权登录无法发布',
        icon: 'none',
        duration: 2000
      })
      return
    }
    let currentData = {}
    const inputValue = that.data.inputValue
    currentData.message = inputValue;
    currentData.happenDate = that.data.happenDate
    currentData.id = that.data.id
    console.log(currentData)
    wx.showLoading({
      title: 'uploading...',
    })
    
  
    mPost("/keepsake/addInfo", currentData).then(result => {
        console.log(result.res)
        wx.hideLoading()
        wx.navigateBack()
    })

  }
})
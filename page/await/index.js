
import {mGet, mPost} from "../../util/request/HttpUtil"

Page({
  onShow() {
    // wx.reportAnalytics('enter_home_programmatically', {})
    // const endSecond = 1598665600

    // const totalDay = Math.floor((endSecond - new Date().getTime() / 1000) / 3600 / 24)
    // const totalMarryDay = Math.floor((new Date().getTime() / 1000 - marrrySecond) / 3600 / 24)
    mGet("/keepsake/listAll").then((result) => {
      console.log(result)
      if(result.res) {
        const list = result.res
        console.log(list)
        this.setData({
          list: list
        })
      }
      
    }).catch((err) => {
      
    });
  },
  onShareAppMessage() {
    return {
      title: '纪念日',
      path: 'page/component/index'
    }
  },

  onPullDownRefresh: function() {
    this.setData({
      list: [],
    
    })
    this.loadData()
  },

  onload() {
    this.loadData()

  },

  loadData() {
    mGet("/keepsake/listAll").then((result) => {
      console.log(result)
      if(result.res) {
        const list = result.res
        console.log(list)
        this.setData({
          list: list
        })
      }
      wx.stopPullDownRefresh();
    }).catch((err) => {
      
    });

  },

  data: {
    list: []
  },

  clickTap(e) {
    let id = e.currentTarget.dataset.index;
    let that = this
    wx.navigateTo({
      url: '../postWait/postwait?id=' + id,
      success: function(res) {
        that.setData({
          list: [],
        
        })
        that.loadData()
      },
      fail: function(res) {},
      complete: function(res) {},
    })
    // console.log(id);
  },

  deleteTap(e) {
    let id = e.currentTarget.dataset.index;
    let that = this;
    wx.showModal({
      title: '提示',
      content: '确定要删除此记录吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          mGet("/keepsake/deleteInfo", {"id":id}).then(result => {
            if(result.res) {
              that.setData({
                list: [],
              })
              that.loadData()
            }
          })
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
      }
    })
  },

})

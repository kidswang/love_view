// const db = wx.cloud.database()

const { mPost } = require("../../util/request/HttpUtil")

// const postCollection = db.collection('post')
const MAX_LIMIT = 6
const FIRST_PAGE = 1

Page({
  onShow() {
    // wx.reportAnalytics('enter_home_programmatically', {})

    if (this.data.list != null) {
       return
    }


    wx.showLoading({
      title: 'loading...',
    })

    this.onPullDownRefresh()

    // postCollection.count().then(res => {
    //   console.log(res)
    //   this.totalCount = res.total

    // this.onPullDownRefresh()
    // })
  },

  upper(e) {
    console.log(e)
  },

  onPullDownRefresh: function() {
    this.setData({
      page: FIRST_PAGE,
      list: [],
      
    })
    this.loadData()
  },

  onReachBottom: function() {
    this.loadData()
  },

  loadData: function () {
    if (this.totalCount <= (this.data.page - 1) * MAX_LIMIT) {
      wx.showToast({
        title: '都加载完成了',
        icon: 'loading',
        duration: 500
      })
      return
    }

    if (this.loading == true) {
      return
    }

    this.loading = true

    // wx.showToast({
    //   title: 'loading',
    //   icon: 'loading',
    //   duration: 5000
    // })

    console.log("this.page = " + this.data.page)

    const contentInfoParameter = {};
    contentInfoParameter.page = this.data.page;
    contentInfoParameter.size = this.data.size;


    mPost("/noteContent/listContentInfo", contentInfoParameter).then(res => {
      this.loading = false;
      console.log(res.res)

      var originList = this.data.list;
      var newList = originList.concat(res.res.contentInfoBos);

      for (let i = 0, len = newList.length; i < len; ++i) {
          let ss = newList[i]
          if(ss.url) {

          } else {
            
          }
      }

      this.setData({
        list: newList
      })

      this.totalCount = res.res.totalCount

      this.data.page += 1

      // wx.hideToast()
      wx.hideLoading()
      wx.stopPullDownRefresh();

    })

    // postCollection
    //   .orderBy('createTime', 'desc')
    //   .skip(this.data.page * MAX_LIMIT).limit(MAX_LIMIT)
    //   .get()
    //   .then(res => {
    //     this.loading = false;
    //     console.log(res.data)

    //     // res.data.forEach(item => {
    //     //   item.dateStr = this.formatDateStr(item.createTime)
    //     // })

    //     var originList = this.data.list;
    //     var newList = originList.concat(res.data);

    //     this.setData({
    //       list: newList
    //     })
    //     this.data.page += 1

    //     wx.hideToast()
    //     wx.hideLoading()
    //     wx.stopPullDownRefresh();
    //   })
  },

  formatDateStr: function (createTime) {
    const date = new Date(createTime)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    // const hour = date.getHours()
    // const minute = date.getMinutes()
    // const second = date.getSeconds()

    return (year + "-" + month + "-" + day)
    // + " " + hour + ":" + minute + ":" + second
  },

  data: {
    page: FIRST_PAGE,
    hasMoreData: true,
    loading: false,
    size: MAX_LIMIT,
    totalCount: MAX_LIMIT * 2 + 1,
    list: null
  },

  previewImage(e) {
    const current = e
    console.log(e)
    console.log(e.target)
    console.log(e.target.dataset)
    console.log(e.target.dataset.name)

    wx.previewImage({
      current,
      urls: [e.target.dataset.name]
    })
  },
})

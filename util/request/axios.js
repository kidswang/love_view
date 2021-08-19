/**
 * Copyright © 2020-present LiuDanYang. All rights Reserved.
 */

/**
 * defaults设置
 *
 * axios.defaults = {
 *   baseUrl:"http://rap2.taobao.org:38080/",
 *   timeout: 60000
 * };
 * 参数参照
 * wx.request https://developers.weixin.qq.com/miniprogram/dev/api/network/request/wx.request.html
 *
 * 属性	类型	默认值	必填	说明	最低版本
 * url	string		是	开发者服务器接口地址
 * data	string/object/ArrayBuffer		否	请求的参数
 * header	Object		否	设置请求的 header，header 中不能设置 Referer。 content-type 默认为 application/json
 * timeout	number		否	超时时间，单位为毫秒	2.10.0
 * method	string	GET	否	HTTP 请求方法
 * dataType	string	json	否	返回的数据格式
 * responseType	string	text	否	响应的数据类型	1.7.0
 * enableHttp2	boolean	false	否	开启 http2	2.10.4
 * enableQuic	boolean	false	否	开启 quic	2.10.4
 * enableCache	boolean	false	否	开启 cache	2.10.4
 *
 * 对于 POST 方法且 header['content-type'] 为 application/json 的数据，会对数据进行 JSON 序列化
 * 对于 POST 方法且 header['content-type'] 为 application/x-www-form-urlencoded 的数据，会将数据转换成 query string
 *
 * 请求拦截器设置
 * axios.interceptors.request.use(function(config) {
 *    return config
 * })
 *
 * 响应拦截器
 * axios.interceptors.response.use(function(response) {
 *    return response
 * })
 *
 * get请求
 * axios.get('/article/list', {page:1}).then(res=>{}).catch(err=>{});
 *
 * post请求
 * axios.post('/article/detail', {id: 1}).then(res=>{}).catch(err=>{});
 *
 * 并发请求
 * Promise.all([axios.get('/article/list', {page:1}), axios.post('/article/detail', {id: 1})]).then(resArr=>{}).catch(err=>{})
 **/

const axios = (function () {
  class Axios {
    constructor() {
      this.defaults = {
        baseUrl: "",
      };
      this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager(),
      };
    }

    wxRequest(c) {
      return new Promise((resolve, reject) => {
        c = this.interceptors.request.func(c);
        c.url = c.url.startsWith("http") ? c.url : c.baseUrl + c.url;
        c.success = (res) => {
          resolve(this.interceptors.response.func(res));
        };
        c.fail = (res) => {
          reject(this.interceptors.response.func(res));
        };
        wx.request(c);
      });
    }
  }

  Array.prototype.forEach.call(
    ["options", "get", "head", "post", "put", "delete", "trace", "connect"],
    function (m) {
      Axios.prototype[m] = function (url, data, config) {
        return this.wxRequest(
          merge(
            this.defaults,
            {
              url: url,
              method: m,
              data: data,
            },
            config || {}
          )
        );
      };
    }
  );

  class InterceptorManager {
    constructor() {
      this.func = function (data) {
        return data;
      };
    }
    use(fn) {
      this.func = fn;
    }
  }

  function merge(axiosDefaultConfig, data, config) {
    let cloneAxios = deepClone(axiosDefaultConfig);
    let cloneData = deepClone(data);
    let cloneConfig = deepClone(config);
    return Object.assign(cloneAxios, cloneData, cloneConfig);
  }

  // 深拷贝
  function deepClone(obj) {
    let _obj = JSON.stringify(obj),
      objClone = JSON.parse(_obj);
    return objClone;
  }

  return new Axios();
})();

export default axios;

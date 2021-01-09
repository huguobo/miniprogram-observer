const Dep = require('./utils/store/Dep');
const Watcher = require('./utils/store/Watcher');

// app.js
App({
  onLaunch() {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // defineReactive the global data
    this.observe(this.globalData);
  },
  Observe(data) {
    let _this = this
    for (let key in data) {
      let val = data[key]
      this.observe(data[key])
      let dep = new Dep()
      Object.defineProperty(data, key, {
        configurable: true,
        enumerable: true,
        get() {
          Dep.target && dep.addSubs(Dep.target);
          return val;
        },
        set(newValue) {
          if (val === newValue) {
            return;
          }
          console.log('newValue', newValue);
          val = newValue;
          _this.observe(newValue);
          dep.notify();
        }
      })
    }
  },
  observe(data) {
    if(!data || typeof data !== 'object') return;
    this.Observe(data);
  },
  globalData: {
    userInfo: null
  },
  addWatcher(key, source, cb) {
    // the method create watcher instance used in specific pages
    new Watcher(key, source, cb);
  }
})

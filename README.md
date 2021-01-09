# 小程序原生简单实现状态管理

## 背景
小程序本身没提供状态管理功能，可能因为初衷是实现简单的功能，引入类似vuex或者redux等完备状态管理可能会增加包体积。

## 解决的问题
解决是简单的状态管理需求，比如跨页面状态共享，通信等，处于包体积的原因又不想引入额外的状态管理包。

## 解决方式
简单参考 vue 响应式的实现，使用 `Object.defineProperty` 或者 `Proxy` 对 globalData 实现 get 和 set 的劫持，通过页面 load 时创建对相应属性的 Watcher 来触发回调（在小程序里一般是 setData）来实现状态和UI的绑定。

## 一些实现
### Observer
```javascript
// 在 app.js 的 onload 方法中调用，使得 globalData 变为响应式
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
```

### Watcher
```javascript
class Watcher {
  constructor(key, source, cb ){
    this.key = key;
    this.source = source;
    this.cb = cb;
    let arr = key.split('.');
    let val = this.source;
    Dep.target = this;
    arr.forEach(key => {
      val = val[key];
    });
    Dep.target = undefined;
  }

  update() {
    let arr = this.key.split('.');
    let val = this.source;
    arr.forEach(key => {
      val = val[key]
    })
    this.cb(val)  
  }
}
```

### Dep
```javascript
class Dep {
  constructor() {
    this.subs = []
  }
  addSubs(watcher) {
    this.subs.push(watcher)
  }
  notify() {
    this.subs.forEach(watcher => {
      watcher.update()
    })
  }
}
```

### 在页面中添加对globalData中某个字段的响应式更新
```javascript
Page({
  data: {
    userInfo: {}
  }
  onLoad() {
    let _this = this;
    // 实例化观察者
    app.addWatcher('userInfo', app.globalData, function(newVal){
      console.log('newVal', newVal);
      _this.setData({
        userInfo: newVal
      });
    })
    // balabala...
  }
});
```

## todo
小程序本身的设计感觉风格还是偏 `vue`，所以这次参考了 `vue` 响应式的实现, 其实如果想用 `redux` 的模式也是可以的，但是需要改造更多小程序的 api，来实现 `immutable`, 如果用 `taro` 等跨平台框架使用 `react` 风格编写，可以写个简单的小程序版本的 `redux`
const Dep  = require('./Dep'); 
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

module.exports = Watcher;
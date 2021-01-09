
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
 
module.exports = Dep;
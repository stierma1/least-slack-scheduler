
class Task{
  constructor(data){
    this._newTarget = new.target;
    this.delegate = data.delegate;
    this.constructionData = data;
  }

  clone(){
    return new (this._newTarget)(this.constructionData);
  }

  bindDelegateToScheduler(scheduler){
    this.delegate = this.delegate.bind(scheduler);
  }

  spawnJob(){
    throw new Error("Needs to be implemented")
  }

  getUtilization(){
    throw new Error("Needs to be implemented")
  }
}

module.exports = Task;

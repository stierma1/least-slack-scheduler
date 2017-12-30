var Uuid = require("uuid")

class Job{
  constructor({deadline, utilization, executionTime, delegate, params}){
    this.deadline = deadline;
    this.utilization = utilization;
    this.executionTime = executionTime;
    this.delegate = delegate;
    this.params = params;
    this.id = Uuid.v4();
    this.state = "Pending";
    var res = null;
    var rej = null;
    var prom = new Promise((resolve, reject) => {
      res = resolve;
      rej = reject;
    });
    this.res = res;
    this.rej = rej;
    this.returnValue = prom;
  }

  getDeadline(){
    return this.deadline;
  }

  currentSlack(currentTime){
    return this.deadline - currentTime - this.executionTime;
  }

  execute(){
    return Promise.resolve(this.delegate(this.params)).then((data) => {
      this.res(data);
      return data;
    }).catch((err) => {
      this.rej(err);
      throw err;
    })
  }
}

module.exports = Job;

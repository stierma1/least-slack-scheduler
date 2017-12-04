
var HardJob = require("./jobs/hard-job");

class Sporadic{
  constructor({executionTime, deadlineTime, delegate}){
    this.utilization = executionTime / deadlineTime;
    this.delegate = delegate;
    this.executionTime = executionTime;
    this.deadlineTime = deadlineTime;
  }

  spawnJob(periodStart, params){
    return new HardJob({params,utilization: this.utilization, deadline: this.deadlineTime + periodStart, delegate:this.delegate, executionTime:this.executionTime});
  }

  getUtilization(){
    return this.utilization;
  }
}

module.exports = Sporadic;

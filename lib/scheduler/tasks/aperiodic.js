
var SoftJob = require("./jobs/soft-job");

class Aperiodic{
  constructor({executionTime, deadlineTime, delegate}){
    this.utilization = executionTime / deadlineTime;
    this.delegate = delegate;
    this.executionTime = executionTime;
    this.deadlineTime = deadlineTime;
  }

  spawnJob(periodStart){
    return new SoftJob({utilization: this.utilization, deadline: this.deadlineTime + periodStart, delegate:this.delegate, executionTime:this.executionTime});
  }

  getUtilization(){
    return this.utilization;
  }
}

module.exports = Aperiodic;

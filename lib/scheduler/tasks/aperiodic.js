
var SoftJob = require("./jobs/soft-job");
var Task = require("./task");

class Aperiodic extends Task{
  constructor({executionTime, deadlineTime, delegate}){
    super({executionTime, deadlineTime, delegate});
    this.utilization = executionTime / deadlineTime;
    this.executionTime = executionTime;
    this.deadlineTime = deadlineTime;
  }

  spawnJob(periodStart, params){
    return new SoftJob({params,utilization: this.utilization, deadline: this.deadlineTime + periodStart, delegate:this.delegate, executionTime:this.executionTime});
  }

  getUtilization(){
    return this.utilization;
  }

}

module.exports = Aperiodic;

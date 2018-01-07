var HardJob = require("./jobs/hard-job");
var Task = require("./task");

class Periodic extends Task{
  constructor({releaseTime, period, executionTime, delegate}){
    super({releaseTime, period, executionTime, delegate});
    this.utilization = executionTime / period;
    this.executionTime = executionTime;
    this.releaseTime = releaseTime;
    this.interval = null;
    this.period = period;
    this.endTimer = false;
    this.timeout = null;
  }

  spawnJob(periodStart, params){
    return new HardJob({params, utilization: this.utilization, deadline: this.period + periodStart, delegate:this.delegate, executionTime:this.executionTime});
  }

  endTimers(){
    clearInterval(this.interval);
    clearTimeout(this.timeout);
    this.endTimer = true;
  }

  getUtilization(){
    return this.utilization;
  }

  setUpTimers(parentScheduler){
    this.timeout = setTimeout(() => {
      if(this.endTimer){
        return
      }
      parentScheduler.releaseJob(this);
      this.interval = setInterval(() => {

        if(this.endTimer){
          clearInterval(this.interval);
          return;
        }
        parentScheduler.releaseJob(this);
      }, this.period)
    }, this.releaseTime)
  }
}

module.exports = Periodic;

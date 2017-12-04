var Processor = require("./processor");
var Periodic = require("./tasks/periodic");
var Aperiodic = require("./tasks/aperiodic");
var Sporadic = require("./tasks/sporadic");

class LeastSlackScheduler{
  constructor(config){
    this.releasedHardJobs = [];
    this.releasedSoftJobs = [];
    this.tasks = {};
    this.processors = [];
    var numProcs = (config && config.maxConcurrent) || 2;
    for(var i = 0; i < numProcs; i++){
      this.processors.push(new Processor({}, LeastSlackScheduler));
    }
  }

  addTask(name, task){
    this.tasks[name] = task;
    if(task instanceof Periodic){
      task.setUpTimers(this);
    }
  }

  releaseJob(task, params){
    if(typeof(task) === "string"){
      task = this.tasks[task];
    }
    var util = task.getUtilization();
    if(util + this.currentUtilization > 1){
      console.log(`Scheduler is overutilized and will likely miss deadlines.  Utilization: ${util + this.currentUtilization}`);
    }

    var job = task.spawnJob(Date.now(), params);
    if(task instanceof Aperiodic){
      this.releasedSoftJobs.push(job);
    } else {
      this.releasedHardJobs.push(job);
    }

    this.executeLeastSlackJob();
  }

  currentUtilization(){
    if(this.releasedJobs.length === 0){
      return 0;
    }
    return this.releasedJobs.reduce((red, job) => {
      red += job.getUtilization();
      return red;
    }, 0)
  }

  getLeastSlackJob(){
    if(this.releasedHardJobs.length === 0){
      if(this.releasedSoftJobs.length === 0){
        return null;
      } else {
        return this.releasedSoftJobs.reduce((leastJob, job) => {
          if(leastJob.currentSlack() > job.currentSlack()){
            return job;
          }

          return leastJob;
        }, this.releasedSoftJobs[0])
      }
    } else {
      return this.releasedHardJobs.reduce((leastJob, job) => {
        if(leastJob.currentSlack() > job.currentSlack()){
          return job;
        }

        return leastJob;
      }, this.releasedHardJobs[0])
    }

  }

  getFreeProcessor(){
    for(var i in this.processors){
      var proc = this.processors[i];
      if(proc.currentJob === null){
        return proc;
      }
    }

    return false;
  }

  hasFreeProcessor(){
    return this.getFreeProcessor() !== null;
  }

  executeLeastSlackJob(){
    if(!this.hasFreeProcessor()){
      return;
    }
    var leastJob = this.getLeastSlackJob();
    if(leastJob === null){
      return;
    }

    var indexOf = this.releasedHardJobs.indexOf(leastJob);
    if(indexOf < 0){
      indexOf = this.releasedSoftJobs.indexOf(leastJob);
      this.releasedSoftJobs.splice(indexOf, 1);
    } else {
      this.releasedHardJobs.splice(indexOf, 1);
    }

    var freeProc = this.getFreeProcessor();

    freeProc.execute(leastJob).then((val) => {
      leastJob.state = "complete";
      freeProc.currentJob = null;
      this.executeLeastSlackJob();
    }).catch((err) => {
      leastJob.state = "error";
      freeProc.currentJob = null;
      console.log(err);
      this.executeLeastSlackJob();
    })
    return;
  }
}

module.exports = LeastSlackScheduler;

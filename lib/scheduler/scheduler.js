var Processor = require("./processor");
var Periodic = require("./tasks/periodic");
var Aperiodic = require("./tasks/aperiodic");
var Sporadic = require("./tasks/sporadic");
var Heap = require("qheap");

class LeastSlackScheduler{
  constructor(config){
    var opts = {comparBefore:(a, b) => {
      return a.currentSlack() < b.currentSlack();
    }}
    this.releasedHardJobs = new Heap(opts);
    this.releasedSoftJobs = new Heap(opts);
    this.tasks = {};
    this.processors = [];
    var numProcs = (config && config.maxConcurrent) || 2;
    for(var i = 0; i < numProcs; i++){
      this.processors.push(new Processor({}, LeastSlackScheduler));
    }
  }

  addTask(name, task){
    var taskClone = task.clone();
    taskClone.bindDelegateToScheduler(this);
    this.tasks[name] = taskClone;
    if(task instanceof Periodic){
      taskClone.setUpTimers(this);
    }
  }

  removeTask(name){
    var task = this.tasks[name];
    if(task === undefined){
      return;
    }
    delete this.tasks[name];
    if(task instanceof Periodic){
      task.endTimers();
    }
  }

  releaseJob(task, params){
    if(typeof(task) === "string"){
      task = this.tasks[task];
    }
    //var util = task.getUtilization();
    //if(util + this.currentUtilization > 1){
    //  console.log(`Scheduler is overutilized and will likely miss deadlines.  Utilization: ${util + this.currentUtilization}`);
    //}

    var job = task.spawnJob(Date.now(), params);
    if(task instanceof Aperiodic){
      this.releasedSoftJobs.push(job);
    } else {
      this.releasedHardJobs.push(job);
    }

    this.executeLeastSlackJob();
    
    return job.returnValue;
  }
  /*
  currentUtilization(){
    console.log(thi)
    if(this.releasedJobs.length === 0){
      return 0;
    }

    return this.releasedJobs.reduce((red, job) => {
      red += job.getUtilization();
      return red;
    }, 0)
  }
  */
  getLeastSlackJob(){
    if(this.releasedHardJobs.length === 0){
      if(this.releasedSoftJobs.length === 0){
        return null;
      } else {
        return this.releasedSoftJobs.peek();
      }
    } else {
      return this.releasedHardJobs.peek();
    }

  }

  getFreeProcessor(){
    for(var i in this.processors){
      var proc = this.processors[i];
      if(proc.currentJob === null){
        return proc;
      }
    }

    return null;
  }

  hasFreeProcessor(){
    return this.getFreeProcessor() !== null;
  }

  executeLeastSlackJob(){
    if(!this.hasFreeProcessor()){
      return;
    }
    var leastJob = this.getLeastSlackJob();
    if(leastJob === undefined || leastJob === null){
      return;
    }
    if(leastJob === this.releasedHardJobs.peek()){
      this.releasedHardJobs.remove()
    } else {
      this.releasedSoftJobs.remove()
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

  getJobs(){
    var hardJobs = this.releasedHardJobs._list.reduce((red, job) => {
      if(job !== null && job !== undefined && job !== 0){
        red.push(job);
      }
      return red;
    }, [])
    var softJobs = this.releasedSoftJobs._list.reduce((red, job) => {
      if(job !== null && job !== undefined && job !== 0){
        red.push(job);
      }
      return red;
    }, []);

    return {hardJobs, softJobs};
  }
}

module.exports = LeastSlackScheduler;

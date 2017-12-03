
class Processor{
  constructor(config, parentScheduler){
    this.config = config;
    this.parentScheduler = parentScheduler;
    this.currentJob = null;
  }

  execute(job){
    this.currentJob = job;
    return job.execute();
  }
}

module.exports = Processor;



class Job{
  constructor({deadline, utilization, executionTime, delegate}){
    this.deadline = deadline;
    this.utilization = utilization;
    this.executionTime = executionTime;
    this.delegate = delegate;
    this.state = "Pending";
  }

  getDeadline(){
    return this.deadline;
  }

  currentSlack(currentTime){
    return this.deadline - currentTime - this.executionTime;
  }

  execute(){
    return Promise.resolve(this.delegate());
  }
}

module.exports = Job;

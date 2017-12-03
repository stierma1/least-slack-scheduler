var Job = require("./job");

class SoftJob extends Job{
  constructor({deadline, utilization, executionTime, delegate}){
    super({deadline, utilization, executionTime, delegate});
  }

  isHardDeadline(){
    return false;
  }
}

module.exports = SoftJob;

var Job = require("./job");

class HardJob extends Job{
  constructor({deadline, utilization, executionTime, delegate}){
    super({deadline, utilization, executionTime, delegate});
  }

  isHardDeadline(){
    return true;
  }
}

module.exports = HardJob;

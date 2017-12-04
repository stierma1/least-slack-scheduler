var Job = require("./job");

class HardJob extends Job{
  constructor({deadline, utilization, executionTime, delegate, params}){
    super({deadline, utilization, executionTime, delegate, params});
  }

  isHardDeadline(){
    return true;
  }
}

module.exports = HardJob;

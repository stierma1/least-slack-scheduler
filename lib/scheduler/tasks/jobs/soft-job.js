var Job = require("./job");

class SoftJob extends Job{
  constructor({deadline, utilization, executionTime, delegate, params}){
    super({deadline, utilization, executionTime, delegate,params});
  }

  isHardDeadline(){
    return false;
  }
}

module.exports = SoftJob;

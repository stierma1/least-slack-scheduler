var LeastSlackScheduler = require("../lib/scheduler/scheduler");
var Periodic = require("../lib/scheduler/tasks/periodic");
var Sporadic = require("../lib/scheduler/tasks/sporadic");
var Aperiodic = require("../lib/scheduler/tasks/aperiodic");
var Utils = require("../lib/scheduler/utils");

var helloLogger = () => {
  console.log("Hello World");
}

var goodbyeDelegate = (moreString) => {
  console.log("Goodbye " + moreString);
}

var helloLoggerTask  = new Periodic({releaseTime:1000, executionTime:1, period: 2000, delegate:helloLogger});
var goodbyeTask = new Sporadic({executionTime:1, deadlineTime: 2000, delegate:goodbyeDelegate});
var leastScheduler = new LeastSlackScheduler();

leastScheduler.addTask("helloLogger", helloLoggerTask);
leastScheduler.addTask("goodbye", goodbyeTask);

leastScheduler.releaseJob("goodbye", "world");

var goodbyeTask = new Sporadic({executionTime:1, deadlineTime: 2000, delegate:goodbyeDelegate});

var timeTask = new Aperiodic({executionTime:1, deadlineTime: 2000, delegate:() => {
  return Date.now();
}});

var logItTask = new Aperiodic({executionTime:1, deadlineTime: 2000, delegate:(params) => {
  console.log(params);
}});

var logTimeTask = Utils.taskCompose(timeTask, logItTask);
leastScheduler.addTask("logTime", logTimeTask);
leastScheduler.releaseJob("logTime");

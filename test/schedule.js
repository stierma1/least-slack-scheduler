var LeastSlackScheduler = require("../lib/scheduler/scheduler");
var Periodic = require("../lib/scheduler/tasks/periodic");
var Sporadic = require("../lib/scheduler/tasks/sporadic");

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

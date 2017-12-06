
module.exports = {
  LeastSlackScheduler: require("./lib/scheduler/scheduler"),
  Tasks: {
    Periodic: require("./lib/scheduler/tasks/periodic"),
    Aperiodic: require("./lib/scheduler/tasks/aperiodic"),
    Sporadic: require("./lib/scheduler/tasks/sporadic")
  },
  Utils: require("./lib/scheduler/utils")
}

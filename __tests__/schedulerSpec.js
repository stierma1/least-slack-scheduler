
var LeastSlackScheduler = require("../index").LeastSlackScheduler;
var Periodic = require("../index").Tasks.Periodic;

test("must construct", () => {
  var scheduler = new LeastSlackScheduler({maxConcurrent:4});
  expect(scheduler).not.toBe(null);
});


test("must take periodic task", () => {
  var scheduler = new LeastSlackScheduler({maxConcurrent:4});
  var period  = new Periodic({releaseTime:1000, executionTime:1, period: 2000, delegate:() => {}});
  scheduler.addTask("period", period);
  expect(scheduler.tasks["period"]).not.toBe(undefined);
  expect(scheduler.tasks["period"]).not.toBe(null);
});

test("must be able to remove periodic task", () => {
  var scheduler = new LeastSlackScheduler({maxConcurrent:4});
  var period  = new Periodic({releaseTime:1000, executionTime:1, period: 2000, delegate:() => {}});
  scheduler.addTask("period", period);
  expect(scheduler.tasks["period"]).not.toBe(undefined);
  expect(scheduler.tasks["period"]).not.toBe(null);
  scheduler.removeTask("period");
  expect(scheduler.tasks["period"]).toBe(undefined);
});

# LeastSlackScheduler

Scheduler that processes jobs in order of slack

## Terminology

### Task

Task is an abstraction that represents a category of work.  Tasks spawn jobs that the scheduler will work on.  There are 3 subtypes of tasks.

#### Periodic

Periodic Tasks will spawn jobs based on a 'period'.  This period is unique to each periodic task.  It will start spawning jobs after a release time.  The type of jobs it spawn is Hard.

#### Aperiodic

Aperiodic Tasks will spawn jobs based on some external request.  The type of jobs it spawn is Soft.

#### Sporadic

Sporadic Tasks will spawn jobs based on some external request.  The type of jobs it spawn is Hard.

### Job

Job is a unit of work that contains a deadline that the scheduler will try to meet.  Jobs have 2 subtypes.

#### Soft
SoftJobs have deadlines that are allowed to be missed therefore the scheduler will treat these as low priority.

#### Hard
HardJobs have deadlines that are not allowed to be missed therefore the scheduler will treat these as high priority.

### Slack
Slack is the amount between job completion and deadline of the same job.  Generally it is computed as
```js
var slack = deadline - currentTime - estimatedComputationTime;
```
Slack can be negative meaning the deadline will be missed.

### LeastLackFirstScheduling

LeastSlackScheduling will run the jobs with the least amount of slack first.  Note all hard jobs will be prioritized over all soft jobs.  Therefore soft jobs will not be run until the hard job queue is empty.


## Example
```js
var LeastSlackScheduler = require("least-slack-scheduler").LeastSlackScheduler;
var Periodic = require("least-slack-scheduler").Tasks.Periodic;
var Sporadic = require("least-slack-scheduler").Tasks.Sporadic;

var helloLogger = () => {
  console.log("Hello World");
}

var goodbyeDelegate = () => {
  console.log("Goodbye");
}

var helloLoggerTask  = new Periodic({releaseTime:1000, executionTime:1, period: 2000, delegate:helloLogger});
var goodbyeTask = new Sporadic({executionTime:1, deadlineTime: 2000, delegate:goodbyeDelegate});
var leastScheduler = new LeastSlackScheduler({maxConcurrent:2});

leastScheduler.addTask("helloLogger", helloLoggerTask);
leastScheduler.addTask("goodbye", goodbyeTask);

leastScheduler.releaseJob("goodbye");

```

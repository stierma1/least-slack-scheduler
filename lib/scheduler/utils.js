var Aperiodic = require("./tasks/aperiodic");
var Sporadic = require("./tasks/sporadic");
var Periodic = require("./tasks/periodic");

function funcCompose(f, g){
  return function(params){
    return Promise.resolve(g(params)).then(f);
  }
}

function funcComposeWithParamDecomposition(f, g){
  return function(params){
    var [par1, par2] = params;
    return Promise.resolve(g(par1)).then(() => {return f(par2)});
  }
}

function taskComposition(task1, task2){
  if(task1 instanceof Periodic || task2 instanceof Periodic){
    throw new Error("Cannot compose periodic tasks");
  }
  var delegate = funcCompose(task2.delegate, task1.delegate);

  if(task1 instanceof Sporadic && task2 instanceof Sporadic){
    return new Sporadic({executionTime:task1.executionTime + task2.executionTime ,
      deadlineTime: task1.deadlineTime + task2.deadlineTime,
      delegate:delegate});
  }
  return new Aperiodic({executionTime:task1.executionTime + task2.executionTime ,
    deadlineTime: task1.deadlineTime + task2.deadlineTime,
    delegate:delegate});
}

function multiTaskComposition(tasks){
  var tasksToComp = [];
  if(!(tasks instanceof Array)){
    for(var i = 0; i < arguments.length; i++){
      tasksToComp.push(arguments[i]);
    }
  } else {
    tasksToComp = tasks;
  }
  return tasksToComp.reduce((task1, task) => {
    if(task1 === null){
      return task;
    } else {
      return taskComposition(task1, task);
    }
  }, null);
}

function taskCompositionWithParamDecomposition(task1, task2){
  if(task1 instanceof Periodic || task2 instanceof Periodic){
    throw new Error("Cannot compose periodic tasks");
  }
  var delegate = funcComposeWithParamDecomposition(task2.delegate, task1.delegate);

  if(task1 instanceof Sporadic && task2 instanceof Sporadic){
    return new Sporadic({executionTime:task1.executionTime + task2.executionTime ,
      deadlineTime: task1.deadlineTime + task2.deadlineTime,
      delegate:delegate});
  }
  return new Aperiodic({executionTime:task1.executionTime + task2.executionTime ,
    deadlineTime: task1.deadlineTime + task2.deadlineTime,
    delegate:delegate});
}

module.exports = {
  taskCompose: taskComposition,
  funcCompose:funcCompose,
  taskComposeWithParamDecomposition:taskCompositionWithParamDecomposition,
  funcComposeWithParamDecomposition: funcComposeWithParamDecomposition,
  multiTaskComposition: multiTaskComposition
}

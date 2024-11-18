const express = require('express');
const cors = require('cors');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

// *********************************************************
let tasks = [
  { taskId: 1, text: 'Fix bug #101', priority: 2 },
  { taskId: 2, text: 'Implement feature #202', priority: 1 },
  { taskId: 3, text: 'Write documentation', priority: 3 },
];

// Endpoint 1. Add a Task to the Task List
function addToTasks(tasks, taskId, text, priority) {
  let taskObj = { taskId: taskId, text: text, priority: priority };
  tasks.push(taskObj);
  return tasks;
}

app.get('/tasks/add', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let priority = parseInt(req.query.priority);
  let results = addToTasks(tasks, taskId, text, priority);
  res.json({ tasks: results });
});

// Endpoint 2. Read All Tasks in the Task List
app.get('/tasks', (req, res) => {
  res.json({ tasks: tasks });
});

// Endpoint 3. Sort Tasks by Priority
function sortByPriority(t1, t2) {
  return t1.priority - t2.priority;
}

app.get('/tasks/sort-by-priority', (req, res) => {
  let tasks_copy = tasks.slice();
  tasks_copy.sort(sortByPriority);
  res.json({ tasks: tasks_copy });
});

// Endpoint 4. Edit Task Priority
function editTaskPriority(tasks, taskId, priority) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].priority = priority;
    }
  }
  return tasks;
}

app.get('/tasks/edit-priority', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let priority = parseInt(req.query.priority);
  let results = editTaskPriority(tasks, taskId, priority);
  res.json({ tasks: tasks });
});

// Endpoint 5. Edit/Update Task Text
function editTaskText(tasks, taskId, text) {
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].taskId === taskId) {
      tasks[i].text = text;
    }
  }
  return tasks;
}

app.get('/tasks/edit-text', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let text = req.query.text;
  let results = editTaskText(tasks, taskId, text);
  res.json({ tasks: tasks });
});

// Endpoint 6. Delete a Task from the Task List
function deleteTaskByTaskId(task, taskId) {
  return task.taskId != taskId;
}

app.get('/tasks/delete', (req, res) => {
  let taskId = parseInt(req.query.taskId);
  let results = tasks.filter((taskObj) => deleteTaskByTaskId(taskObj, taskId));
  res.json({ tasks: results });
});

// Endpoint 7. Filter Tasks by Priority
function filterByPriority(task, priority) {
  return task.priority === priority;
}

app.get('/tasks/filter-by-priority', (req, res) => {
  let priority = parseInt(req.query.priority);
  let results = tasks.filter((taskObj) => filterByPriority(taskObj, priority));
  res.json({ tasks: results });
});

// *********************************************************
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

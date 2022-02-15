const tasksEndpoint = "http://localhost:3000/lists/5195/tasks";

function getTasksFromServer() {
  return fetch(tasksEndpoint + "?all=true").then((res) => res.json());
}

function deleteTaskFromServer(taskId) {
  fetch(tasksEndpoint + `/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function updateTask(editedTask) {
  fetch(tasksEndpoint + `/${editedTask.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedTask),
  });
}

function createTask(newTask) {
  return fetch(tasksEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  }).then((res) => {
    return res.json();
  });
}

const taskListElement = document.getElementById("taskList");

// DOM:only
function addTaskToDom(task) {
  const { id, text, done, dueDate } = task;
  const taskDate = new Date(dueDate);
  const isExpired = isDateExpired(taskDate);

  const browserSupportsTemplate =
    "content" in document.createElement("template");

  if (browserSupportsTemplate) {
    const template = document.querySelector("#taskTemplate");
    const taskElement = template.content.cloneNode(true).children[0];
    const checkbox = taskElement.querySelector(".todolist__task-input");
    const nameField = taskElement.querySelector(".todolist__task-name");
    const descriptionField = taskElement.querySelector(
      ".todolist__task-description"
    );
    const dateField = taskElement.querySelector(".todolist__task-date");

    taskElement.setAttribute("id", id);
    taskElement.setAttribute("done", done);
    taskElement.setAttribute("onclick", "handleClick(this)");

    checkbox.checked = done;

    nameField.textContent = "name";
    descriptionField.textContent = text;

    dateField.setAttribute("expired", isExpired);
    dateField.textContent =
      taskDate.getFullYear() +
      "-" +
      (taskDate.getMonth() + 1) +
      "-" +
      taskDate.getDate();

    taskListElement.appendChild(taskElement);
  }
}

function isDateExpired(date) {
  if (date) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);
    return date < now;
  } else {
    return false;
  }
}

// EVENT
function handleClick(taskElem) {
  const allClasses = event.target.classList;
  allClasses.includes = [].includes;

  if (allClasses.includes("form-check-input")) {
    changeTaskState(taskElem);
  } else if (allClasses.includes("todolist__task-delete")) {
    // COMB
    deleteTask(taskElem);
  }
}

// COMB
function deleteTask(taskElem) {
  const taskId = parseInt(taskElem.getAttribute("id"));
  deleteTaskFromServer(taskId);

  taskElem.remove();
}

// COMB : update task
function changeTaskState(taskElem) {
  const name = taskElem.querySelector(".todolist__task-name").textContent;
  const text = taskElem.querySelector(
    ".todolist__task-description"
  ).textContent;
  const date = taskElem.querySelector(".todolist__task-date").textContent;
  const done = taskElem.getAttribute("done") === "true";
  const id = parseInt(taskElem.getAttribute("id"));

  const newDoneValue = !done;

  const editedTask = {
    id,
    name,
    text,
    done: newDoneValue,
    dueDate: new Date(date),
  };
  updateTask(editedTask);
  console.log(editedTask);

  taskElem.setAttribute("done", newDoneValue);

  displayTasksAccordingToQuery();
}

// DOM
function displayTasksAccordingToQuery() {
  if (showOnlyCompletedButton.checked) {
    hideCompletedTasks();
  } else {
    showAllTasks();
  }
}

function hideCompletedTasks() {
  const allTasks = taskListElement.children;
  allTasks.forEach = [].forEach;
  allTasks.forEach(hideUndoneTask);
}

function hideUndoneTask(task) {
  const isDone = task.getAttribute("done") === "true";
  if (isDone) {
    task.classList.toggle("none", true);
  }
}

function showAllTasks() {
  const allTasks = taskListElement.children;
  allTasks.forEach = [].forEach;
  allTasks.forEach(makeTaskVisible);
}

function makeTaskVisible(task) {
  task.classList.toggle("none", false);
}

// SERVER
getTasksFromServer().then((res) => res.forEach((task) => addTaskToDom(task)));

// EVENT
const showOnlyCompletedButton = document.getElementById("show-all");
showOnlyCompletedButton.addEventListener("click", (event) => {
  displayTasksAccordingToQuery();
});

// COMB
const createTaskForm = document.forms.createTask;
createTaskForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = Object.fromEntries(new FormData(createTaskForm));

  const nameInput = document.getElementById("taskNameInput");

  if (isFormValid(formData)) {
    nameInput.classList.toggle("invalid", false);
    createTaskForm.reset();

    const createdTask = Object.assign(formData);
    createdTask.dueDate = formData.dueDate ? new Date(formData.dueDate) : null;

    // SERVER
    const newTask = await createTask(createdTask);
    addTaskToDom(newTask);
  } else {
    nameInput.classList.toggle("invalid", true);
  }
});

function isFormValid(formData) {
  return formData.name;
}

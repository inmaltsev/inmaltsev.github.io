const tasksEndpoint = "http://localhost:3000/lists/5448/tasks";

// DB
function getTasksFromServer() {
  return fetch(tasksEndpoint + "?all=true").then((res) => res.json());
}

function deleteTaskFromServer(taskId) {
  return fetch(tasksEndpoint + `/${taskId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });
}

function updateTaskOnServer(editedTask) {
  return fetch(tasksEndpoint + `/${editedTask.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(editedTask),
  }).then((res) => res.json());
}

function createTask(newTask) {
  return fetch(tasksEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTask),
  }).then((res) => res.json());
}

const taskListElement = document.getElementById("taskList");

// DOM
function renderTaskElement(task) {
  const { id, text, done, dueDate, name } = task;
  const taskDate = getDateOrNull(dueDate);
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
    if (taskDate) {
      taskElement.setAttribute("date", taskDate.toLocaleDateString());
    }
    taskElement.setAttribute("onclick", "handleClick(this)");

    checkbox.checked = done;

    nameField.textContent = name;
    descriptionField.textContent = text;

    dateField.setAttribute("expired", isExpired);
    dateField.textContent = formatDate(taskDate);

    return taskElement;
  }
}

function addTaskToDom(htmlTask) {
  taskListElement.appendChild(htmlTask);
}

function formatDate(date) {
  if (date) {
    return (
      date.getDate() + "-" + (date.getMonth() + 1) + "-" + date.getFullYear()
    );
  } else {
    return "";
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
    changeTaskElementState(taskElem).then(() => displayTasksAccordingToQuery());
  } else if (allClasses.includes("todolist__task-delete")) {
    deleteTask(taskElem);
  }
}

// COMB
function deleteTask(taskElem) {
  const taskId = parseInt(taskElem.getAttribute("id"));
  deleteTaskFromServer(taskId).then((_) => taskElem.remove());
}

// COMB : update task
async function changeTaskElementState(taskElement) {
  const task = getTaskFromElement(taskElement);

  task.done = !task.done;

  const updatedTask = await updateTaskOnServer(task);

  const updatedTaskElement = renderTaskElement(updatedTask);
  taskElement.parentNode.replaceChild(updatedTaskElement, taskElement);
}

function getTaskFromElement(taskElement) {
  const name = taskElement.querySelector(".todolist__task-name").textContent;
  const text = taskElement.querySelector(
    ".todolist__task-description"
  ).textContent;
  const dueDate = taskElement.getAttribute("date");
  const done = taskElement.getAttribute("done") === "true";
  const id = parseInt(taskElement.getAttribute("id"));

  return {
    id,
    name,
    text,
    done,
    dueDate,
  };
}

function getDateOrNull(dateString) {
  return dateString ? new Date(dateString) : null;
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

// DOM
getTasksFromServer().then((res) =>
  res.map(renderTaskElement).forEach(addTaskToDom)
);

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

    const newTask = convertFormDataToTask(formData);

    const createdTask = await createTask(newTask);
    addTaskToDom(renderTaskElement(createdTask));
  } else {
    nameInput.classList.toggle("invalid", true);
  }
});

function convertFormDataToTask(formData) {
  const task = Object.assign(formData);
  task.dueDate = getDateOrNull(formData.dueDate);
  return task;
}

function isFormValid(formData) {
  return formData.name;
}

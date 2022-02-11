const list = [
  {
    id: 1,
    listId: 2,
    name: "Name for task",
    text: "uncompleted task for today",
    done: false,
    dueDate: new Date("2022-02-11T00:00:00.000Z"),
  },
  {
    id: 2,
    listId: 2,
    name: "Another big task",
    text: "completed task for today",
    done: true,
    dueDate: new Date("2022-02-11T00:00:00.000Z"),
  },
  {
    id: 3,
    listId: 2,
    name: "Name for task",
    text: "completed task for tomorrow",
    done: true,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 4,
    listId: 2,
    name: "Name for task",
    text: "uncompleted task for tomorrow",
    done: false,
    dueDate: new Date("2022-02-12T00:00:00.000Z"),
  },
  {
    id: 5,
    listId: 2,
    name: "Name for task",
    text: "completed task for yesterday",
    done: true,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
  {
    id: 6,
    listId: 2,
    name: "Name for task",
    text: "uncompleted task for yesterday",
    done: false,
    dueDate: new Date("2022-02-10T00:00:00.000Z"),
  },
];

const taskListElement = document.getElementById("taskList");

function generateTaskDomObject(task) {
  const { name, text, done, dueDate } = task;
  taskListElement.innerHTML += `
    <li class="form-check container todolist__task">
        <input
          type="checkbox"
          class="form-check-input todolist__task-input" ${done ? "checked" : ""}
          onclick="changeTaskStatus(this)"
          done="${done}"
        />
        
        <label class="form-check-label todolist__task"> 
          <p class="todolist__task-name">${name}</p>
          <p class="todolist__task-description">${text}</p>
        </label>

        <span
        class="todolist__task-date badge rounded-pill bg-primary"
        expired="${isDateExpired(dueDate)}"
        >
        ${
          dueDate.getFullYear() +
          "-" +
          dueDate.getMonth() +
          "-" +
          dueDate.getDate()
        }
        </span>
    </li>
  `;
}

function changeTaskStatus(taskElem) {
  const oldValue = taskElem.getAttribute("done") === "true";
  taskElem.setAttribute("done", !oldValue);
}

function isDateExpired(date) {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  date.setHours(0, 0, 0, 0);
  return date < now;
}

list.forEach((task) => generateTaskDomObject(task));

const registerBtn = document.getElementById("registerBtn");
const loginBtn = document.getElementById("loginBtn");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

// Register button
registerBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
});

// Login button
loginBtn.addEventListener("click", async () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  localStorage.setItem("token", data.token);
  document.getElementById("auth").style.display = "none";
  document.getElementById("tasks").style.display = "block";
  loadTasks(); // Load tasks after login
});

// Add Task button
addTaskBtn.addEventListener("click", async () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const deadline = document.getElementById("deadline").value;
  const priority = document.getElementById("priority").value;
  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, description, deadline, priority }),
  });
  const task = await res.json();
  addTaskToUI(task);
});

// Function to load tasks from the backend
const loadTasks = async () => {
  const res = await fetch("http://localhost:5000/api/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
  });
  const tasks = await res.json();
  taskList.innerHTML = ""; // Clear task list before adding new tasks
  tasks.forEach(addTaskToUI);
};

// Function to add a task to the UI
const addTaskToUI = (task) => {
  const li = document.createElement("li");
  li.innerHTML = `
    ${task.title} - ${task.priority}
    <button onclick="editTask('${task._id}')">Edit</button>
    <button onclick="deleteTask('${task._id}')">Delete</button>
  `;
  taskList.appendChild(li);
};

// Edit Task
const editTask = async (taskId) => {
  const title = prompt("Enter new task title:");
  const description = prompt("Enter new task description:");
  const deadline = prompt("Enter new deadline (YYYY-MM-DD):");
  const priority = prompt("Enter new priority (low, medium, high):");

  const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, description, deadline, priority }),
  });
  const updatedTask = await res.json();
  loadTasks(); // Reload tasks to show the updated task
};

// Delete Task
const deleteTask = async (taskId) => {
  const res = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
    method: "DELETE",
    headers: {
      Authorization: localStorage.getItem("token"),
    },
  });
  const data = await res.json();
  if (data.message === "Task deleted successfully") {
    loadTasks(); // Reload tasks to remove the deleted task
  }
};

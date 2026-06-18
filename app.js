// State when page loads 
let tasks = loadTasks();

//  show the tasks that are loaded if there's any.
renderTasks();

//  Add Task 
function addTask() {
  const input = document.getElementById('task-input');
  const text = input.value.trim();

  if (!text) return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();

  input.value = '';
  input.focus();
}

// Allow pressing Enter to add a task
document.getElementById('task-input').addEventListener('keydown', function (e) {
  if (e.key === 'Enter') addTask();
});

// ── Toggle Complete ──
function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}

// ── Delete Task ──
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

// show tasks in the list, if there are no tasks, show empty state message
function renderTasks() {
  const list = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');

  list.innerHTML = '';

  if (tasks.length === 0) {
    emptyState.style.display = 'block';
    updateProgress(0, 0);
    return;
  }

  emptyState.style.display = 'none';

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item' + (task.completed ? ' completed' : '');

    li.innerHTML = `
      <input
        type="checkbox"
        class="task-checkbox"
        ${task.completed ? 'checked' : ''}
        onchange="toggleTask(${task.id})"
        aria-label="Mark task complete"
      />
      <span class="task-text">${escapeHTML(task.text)}</span>
      <button class="delete-btn" onclick="deleteTask(${task.id})" aria-label="Delete task">✕</button>
    `;

    list.appendChild(li);
  });

  const completed = tasks.filter(t => t.completed).length;
  updateProgress(completed, tasks.length);
}

// ── Progress Bar ──
function updateProgress(completed, total) {
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  document.getElementById('progress-bar').style.width = percent + '%';
  document.getElementById('progress-text').textContent =
    `${completed} of ${total} task${total !== 1 ? 's' : ''} complete`;
  document.getElementById('progress-percent').textContent = percent + '%';
}

// ── Persist with localStorage ──
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// check if any task are saved previously in local storage, task is the single source of truth
function loadTasks() {
    // 
  try {
// Get the saved tasks string from the browser and convert it back to a JS array
    return JSON.parse(localStorage.getItem('tasks')) || [];
  } catch {
    return [];
  }
}

// ── Security: prevent XSS ──
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
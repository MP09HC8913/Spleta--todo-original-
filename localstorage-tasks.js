document.addEventListener('DOMContentLoaded', () => {
    const STORAGE_KEY = 'todo-tasks';
    const RESET_KEY = 'last-reset-date';
    const tasklist = document.querySelector("#task-list");

    // ⏰ Check if it's time to auto-reset
    const now = new Date();
    const lastReset = localStorage.getItem(RESET_KEY);
    const today9am = new Date();
    today9am.setHours(9, 0, 0, 0);
    const todayStr = now.toDateString();

    if (lastReset !== todayStr && now >= today9am) {
        const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
        // Get only incomplete (unchecked) tasks
        const uncompletedTasks = tasks.filter(task => !task.completed);
    
        // Load existing history or empty
        const history = JSON.parse(localStorage.getItem("todo-history")) || [];
    
        if (uncompletedTasks.length > 0) {
            history.push({
                date: todayStr,
                tasks: uncompletedTasks
            });
            localStorage.setItem("todo-history", JSON.stringify(history));
        }
    
        // Reset for the day
        localStorage.removeItem(STORAGE_KEY);
        localStorage.setItem(RESET_KEY, todayStr);
    }
    

    // 📥 Load existing tasks
    const savedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    savedTasks.forEach(task => {
        if (window.addtask) {
            window.addtask(task.text, task.completed, false);
        }
    });

    if (window.updateprogress) window.updateprogress(false);
    if (window.toogleemptyimage) window.toogleemptyimage();

    // 💾 Save tasks to localStorage
    const saveTasksToStorage = () => {
        const tasks = Array.from(tasklist.children).map(li => ({
            text: li.querySelector("span").textContent,
            completed: li.querySelector(".checkbox").checked
        }));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    };

    // 🖱️ Save on checkbox, delete, or edit
    tasklist.addEventListener('change', saveTasksToStorage);
    tasklist.addEventListener('click', (e) => {
        if (e.target.closest('.delete-btn') || e.target.closest('.edit-btn')) {
            saveTasksToStorage();
        }
    });

    // ✅ Hook into `addtask()` to save
    if (window.addtask) {
        const originalAddTask = window.addtask;
        window.addtask = function (...args) {
            originalAddTask(...args);
            saveTasksToStorage();
        };
    }

    tasklist.addEventListener('change', saveTasksToStorage);

});

document.addEventListener('DOMContentLoaded', () => {
  const taskinput = document.querySelector("#task-input-text");
  const addtaskbtn = document.querySelector("#submit-it");
  const tasklist = document.querySelector("#task-list");
  const emptyimage = document.querySelector(".empty-image");
  const todocont = document.querySelector(".todo-container");
  const progressbar = document.querySelector("#progress");
  const progreenum = document.querySelector("#numbers");
  const viewHistoryTasksBtn = document.getElementById("viewHistoryTasksBtn");
  


const toogleemptyimage = () => {
  emptyimage.style.display = tasklist.children.length === 0 ? 'block' : 'none';
  // no direct style.width manipulation here
};



  // const updateprogress = (checkcompletion = true) => {
  //   const totaltask = tasklist.children.length;
  //   const completedtask = tasklist.querySelectorAll(".checkbox:checked").length

  //   progressbar.style.width = totaltask ? `${(completedtask / totaltask) * 100}%` : "0%";

  //   progreenum.textContent = `${completedtask}/${totaltask}`;

  //   if (checkcompletion && totaltask > 0 && completedtask === totaltask) {
  //     launchConfetti();

  //   }
  // }
  const updateprogress = (checkcompletion = true) => {
    const totaltask = tasklist.children.length;
    const completedtask = tasklist.querySelectorAll(".checkbox:checked").length;
    const motivation = document.querySelector("#motivational-text");
    const sound = new Audio("sounds/success.mp3");

    progressbar.style.width = totaltask ? `${(completedtask / totaltask) * 100}%` : "0%";
    progreenum.textContent = `${completedtask}/${totaltask}`;

    if (motivation) {
        // Animate text
        motivation.classList.add("fade");

        setTimeout(() => {
            // Set new message after fade
            if (totaltask > 0 && completedtask === totaltask) {
                motivation.textContent = "keep it up!";
                sound.play(); // 🔊 Play sound
            } else {
                motivation.textContent = "Finish your work";
            }

            motivation.classList.remove("fade");
        }, 200);
    }

    if (checkcompletion && totaltask > 0 && completedtask === totaltask) {
        launchConfetti();
    }
};



  


  const addtask = (text, complete = false, checkcompletion = true) => {
    const tasktext = text || taskinput.value.trim();
    if (!tasktext) {
      return;
    }

    const li = document.createElement('li');
    li.innerHTML = `
        <input type="checkbox" class="checkbox" ${complete ? 'checked' : ''}/>
        <span>${tasktext}</span>

        <div class="task-button">
        <button class="edit-btn"><i class = "fa-solid fa-pen"></i></button>
        <button class="delete-btn"><i class = "fa-solid fa-trash"></i></button>
        </div>

        `;

    const checkbox = li.querySelector('.checkbox');
    const editbtn = li.querySelector('.edit-btn');

    if (complete) {
      li.classList.add("completed");
      editbtn.disabled = true;
      editbtn.style.opacity = '0.5';
      editbtn.style.pointerEvents = "none";
    }

    checkbox.addEventListener('change', () => {
      const ischecked = checkbox.checked;
      li.classList.toggle('completed', ischecked);
      editbtn.disabled = ischecked;
      editbtn.style.opacity = ischecked ? '0.5' : '1';
      editbtn.style.pointerEvents = ischecked ? 'none' : 'auto';
      updateprogress();
    });

    li.querySelector(".delete-btn").addEventListener('click', () => {
      li.remove();
      toogleemptyimage();
      updateprogress();
    })

    editbtn.addEventListener('click', () => {
      if (!checkbox.checked) {
        taskinput.value = li.querySelector
          ("span").textContent;
        li.remove();
        toogleemptyimage();
        updateprogress(false);

      }
    })



    tasklist.appendChild(li);
    taskinput.value = "";
    toogleemptyimage();
    updateprogress(checkcompletion);
    saveTasksToStorage(); // Save task right after adding

  }


  const form = document.querySelector(".input-area");
form.addEventListener("submit", (e) => {
    e.preventDefault(); // Prevent refresh
    addtask();
});

  taskinput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addtask();
    }
  });


  
  // for local storage
  window.addtask = addtask;
  window.updateprogress = updateprogress;
  window.toogleemptyimage = toogleemptyimage;

  const splash = document.getElementById("splash-screen");
setTimeout(() => {
  splash.style.opacity = "0";
  splash.style.display = "none";
}, 1000); // Hide after 1 second

window.saveTasksToStorage = function() {
  const taskList = document.getElementById("task-list");
  const tasks = Array.from(taskList.children).map(li => ({
    text: li.querySelector("span").textContent,
    completed: li.querySelector(".checkbox").checked
  }));
  localStorage.setItem("todo-tasks", JSON.stringify(tasks));
};






const historyBtn = document.getElementById("historyBtn");
const historyPanel = document.getElementById("historyPanel");
const historyList = document.getElementById("historyList");
const overlayBlur = document.getElementById("overlayBlur");

historyBtn.addEventListener("click", () => {
  showHistory(); // Load history content
  historyPanel.style.right = "0"; // Slide in
  overlayBlur.style.display = "block"; // Show blur
});

// Close panel when overlay is clicked
overlayBlur.addEventListener("click", () => {
  historyPanel.style.right = "-320px"; // Slide out
  overlayBlur.style.display = "none";  // Hide blur
});

function showHistory() {
  historyList.innerHTML = "";
  const history = JSON.parse(localStorage.getItem("todo-history")) || [];

  if (history.length === 0) {
    historyList.innerHTML = "<li>No past uncompleted tasks</li>";
    return;
  }

  history.forEach(entry => {
    const dateItem = document.createElement("li");
    dateItem.innerHTML = `<strong>${entry.date}</strong>`;
    const subList = document.createElement("ul");
    entry.tasks.forEach(task => {
      const taskItem = document.createElement("li");
      taskItem.textContent = task.text;
      subList.appendChild(taskItem);
    });
    historyList.appendChild(dateItem);
    historyList.appendChild(subList);
  });
}

// Hide history button when panel is visible
function openHistoryPanel() {
  historyPanel.style.right = "0";         // Slide in panel
  overlayBlur.style.display = "block";    // Show background blur
  historyBtn.style.display = "none";      // Hide history button
  if (viewHistoryTasksBtn) viewHistoryTasksBtn.style.display = "block";
  // Show the Delete All button when history panel opens
const deleteAllBtn = document.getElementById("deleteAllBtn");
if (deleteAllBtn) deleteAllBtn.style.display = "block";

}

// Show button when panel is closed
function closeHistoryPanel() {
  historyPanel.style.right = "-320px";    // Slide out panel
  overlayBlur.style.display = "none";     // Hide blur
  historyBtn.style.display = "block";     // Show button again
  if (viewHistoryTasksBtn) viewHistoryTasksBtn.style.display = "none";
  // Hide the Delete All button when panel closes
if (deleteAllBtn) deleteAllBtn.style.display = "none";

}

// Replace these in your previous click handlers:
historyBtn.addEventListener("click", () => {
  showHistory();
  openHistoryPanel();
});

overlayBlur.addEventListener("click", () => {
  closeHistoryPanel();
});



// document.getElementById("darkToggle").addEventListener("click", () => {
//   document.body.classList.toggle("dark-mode");
// });


function loadHistory() {
  const panel = document.getElementById("historyPanel");
  const list = document.getElementById("historyList");
  list.innerHTML = "";

  const history = JSON.parse(localStorage.getItem("todo-history")) || [];
  history.reverse().forEach(entry => {
    const dateTitle = document.createElement("li");
    dateTitle.innerHTML = `<strong>${entry.date}</strong>`;
    list.appendChild(dateTitle);
    entry.tasks.forEach(task => {
      const li = document.createElement("li");
      li.textContent = task.text;
      list.appendChild(li);
    });
  });
}



// Force Reset and Save Incomplete Tasks to History
const resetBtn = document.getElementById("forceResetBtn");
if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    const taskList = document.getElementById("task-list");
    const tasks = Array.from(taskList.children).map(li => ({
      text: li.querySelector("span").textContent,
      completed: li.querySelector(".checkbox").checked
    }));

    const incompleteTasks = tasks.filter(task => !task.completed);

    // Save to history
    const oldHistory = JSON.parse(localStorage.getItem("todo-history")) || [];
    const today = new Date().toLocaleDateString();
    if (incompleteTasks.length > 0) {
      oldHistory.push({
        date: today,
        tasks: incompleteTasks
      });
      localStorage.setItem("todo-history", JSON.stringify(oldHistory));
    }

    // Clear all tasks
    localStorage.removeItem("todo-tasks");

    // Clear UI
    taskList.innerHTML = "";
    toogleemptyimage();
    updateprogress();

    // Reload history
    showHistory();
    alert("Force reset complete. Incomplete tasks saved to history.");
  });
}


viewHistoryTasksBtn.addEventListener("click", () => {
  const page = document.getElementById("historyTasksPage");
  const list = document.getElementById("viewTaskList");
  const deleteBtn = document.getElementById("deleteAllBtn");

  const history = JSON.parse(localStorage.getItem("todo-history")) || [];

  list.innerHTML = "";
  history.forEach(entry => {
    entry.tasks.forEach((task, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" onchange="completeTaskFromHistory(${index})" />
        <span>${task.text}</span>
      `;
      list.appendChild(li);
    });
  });

  page.style.display = "block"; // Show the full screen view
});




const deleteAllBtn = document.getElementById("deleteAllBtn");
if (deleteAllBtn) {
  deleteAllBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to delete all history tasks?")) {
      localStorage.removeItem("todo-history");
      alert("All history tasks deleted.");
      closeViewTaskPage();
    }
  });
}



window.completeTaskFromHistory = (taskIndex) => {
  const history = JSON.parse(localStorage.getItem("todo-history")) || [];
  if (history.length > 0) {
    // Remove task from the latest entry
    history[history.length - 1].tasks.splice(taskIndex, 1);

    // If that date has no more tasks, remove the date entry
    if (history[history.length - 1].tasks.length === 0) {
      history.pop();
    }

    localStorage.setItem("todo-history", JSON.stringify(history));
    // Refresh task view
    viewHistoryTasksBtn.click();
  }
};

window.closeViewTaskPage = () => {
  document.getElementById("historyTasksPage").style.display = "none";
};

document.getElementById("viewHistoryTasksBtn").addEventListener("click", () => {
  window.location.href = "view-tasks.html";
});


});



const launchConfetti = () => {
  const count = 200,
    defaults = {
      origin: { y: 0.7 },
    };

  function fire(particleRatio, opts) {
    confetti(
      Object.assign({}, defaults, opts, {
        particleCount: Math.floor(count * particleRatio),
      })
    );
  }

  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const deleteBtn = document.getElementById("deleteAllBtn");
  if (deleteBtn && window.location.href.includes("history-tasks.html")) {
    deleteBtn.style.display = "block";

    // Attach click event
    deleteBtn.addEventListener("click", () => {
      if (confirm("Are you sure you want to delete all incomplete tasks from history?")) {
        localStorage.removeItem("todo-history");
        alert("All incomplete tasks deleted from history.");
        location.reload();
      }
    });
  }
});



// ✅ Fix: Show Delete All Tasks only in view task screen
viewHistoryTasksBtn.addEventListener("click", () => {
  const page = document.getElementById("historyTasksPage");
  const list = document.getElementById("viewTaskList");
  const deleteBtn = document.getElementById("deleteAllBtn");

  const history = JSON.parse(localStorage.getItem("todo-history")) || [];

  list.innerHTML = "";
  history.forEach((entry, entryIndex) => {
    entry.tasks.forEach((task, taskIndex) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <input type="checkbox" onchange="completeTaskFromHistory(${entryIndex}, ${taskIndex})" />
        <span>${task.text}</span>
      `;
      list.appendChild(li);
    });
  });

  if (deleteBtn) {
    deleteBtn.style.display = "block";
    deleteBtn.onclick = () => {
      if (confirm("Are you sure you want to delete all history tasks?")) {
        localStorage.removeItem("todo-history");
        alert("All history tasks deleted.");
        closeViewTaskPage();
      }
    };
  }

  page.style.display = "block";
});

// ✅ Function: Remove completed task from history
window.completeTaskFromHistory = (entryIndex, taskIndex) => {
  const history = JSON.parse(localStorage.getItem("todo-history")) || [];
  if (history[entryIndex]) {
    history[entryIndex].tasks.splice(taskIndex, 1);
    if (history[entryIndex].tasks.length === 0) {
      history.splice(entryIndex, 1);
    }
    localStorage.setItem("todo-history", JSON.stringify(history));
    document.getElementById("viewHistoryTasksBtn").click(); // Refresh screen
  }
};

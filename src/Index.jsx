import React, { useState, useEffect } from "react";
import axios from "axios";
import "../src/Index.css";

function Index() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [editedText, setEditedText] = useState("");

  useEffect(() => {
    axios
      .get("https://todo-backend-1-oexb.onrender.com/tasks")
      .then((response) => setTasks(response.data))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  const handleAddTask = () => {
    if (newTask.trim() === "") return;
    axios
      .post("https://todo-backend-1-oexb.onrender.com/tasks", { text: newTask, completed: false })
      .then((response) => {
        setTasks([...tasks, response.data]);
        setNewTask("");
      })
      .catch((error) => console.error("Error adding task:", error));
  };

  const handleToggleTask = (id, completed) => {
    axios
      .put(`https://todo-backend-1-oexb.onrender.com/tasks/${id}`, { completed: !completed })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, completed: !completed } : task
          )
        );
      })
      .catch((error) => console.error("Error updating task:", error));
  };

  const handleDeleteTask = (id) => {
    axios
      .delete(`https://todo-backend-1-oexb.onrender.com/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((error) => console.error("Error deleting task:", error));
  };

  const handleEditTask = (task) => {
    setEditingTask(task._id);
    setEditedText(task.text);
  };

  const handleSaveEdit = (id) => {
    axios
      .put(`https://todo-backend-1-oexb.onrender.com/tasks/${id}`, { text: editedText })
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, text: editedText } : task
          )
        );
        setEditingTask(null);
        setEditedText("");
      })
      .catch((error) => console.error("Error editing task:", error));
  };

  return (
    <div className="todo-container">
      <div className="todo-box">
        <h2>My Tasks ✅</h2>
        <div className="input-section">
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <button onClick={handleAddTask}>Add Task</button>
        </div>
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task._id}>
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleTask(task._id, task.completed)}
              />
              {editingTask === task._id ? (
                <input
                  type="text"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                />
              ) : (
                <span className={`task-text ${task.completed ? "completed" : ""}`}>
                  {task.text}
                </span>
              )}
              <div className="buttons">
                {editingTask === task._id ? (
                  <button onClick={() => handleSaveEdit(task._id)}>💾</button>
                ) : (
                  <button onClick={() => handleEditTask(task)}>✏️</button>
                )}
                <button className="delete-btn" onClick={() => handleDeleteTask(task._id)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
        <p className="status">
          Tasks Completed: <span>{tasks.filter(task => task.completed).length}</span> |
          Pending: <span>{tasks.filter(task => !task.completed).length}</span>
        </p>
      </div>
    </div>
  );
}

export default Index;

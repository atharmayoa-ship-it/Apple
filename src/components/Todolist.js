import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faEdit, faSave } from "@fortawesome/free-solid-svg-icons";
import "./Todolist.css";

function Todolist() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [textarea, setTextarea] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Editing states
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [editingTextarea, setEditingTextarea] = useState("");
  const [editingStartDate, setEditingStartDate] = useState("");
  const [editingEndDate, setEditingEndDate] = useState("");

  // Drag & drop
  const dragStartIndex = useRef(null);
  const dragOverIndex = useRef(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    setTasks(storedTasks);
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  // Add task
  const addTask = () => {
    if (!input.trim() && !textarea.trim()) return;

    const newTask = {
      id: Date.now(), // unique ID for local storage
      text: input.trim(),
      textarea: textarea.trim(),
      completed: false,
      startDate,
      endDate,
    };

    setTasks([...tasks, newTask]);
    setInput("");
    setTextarea("");
    setStartDate("");
    setEndDate("");
  };

  // Delete task
  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Start editing
  const startEditingTask = (index) => {
    const task = tasks[index];
    setEditingIndex(index);
    setEditingText(task.text);
    setEditingTextarea(task.textarea);
    setEditingStartDate(task.startDate || "");
    setEditingEndDate(task.endDate || "");
  };

  // Save task
  const saveTask = (index) => {
    const updatedTask = {
      ...tasks[index],
      text: editingText,
      textarea: editingTextarea,
      startDate: editingStartDate,
      endDate: editingEndDate,
    };

    const updatedTasks = [...tasks];
    updatedTasks[index] = updatedTask;
    setTasks(updatedTasks);

    cancelEditing();
  };

  // Cancel editing
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditingText("");
    setEditingTextarea("");
    setEditingStartDate("");
    setEditingEndDate("");
  };

  // Toggle completed
  const toggleCompleted = (index) => {
    const updatedTasks = [...tasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTasks(updatedTasks);
  };

  // Drag & drop
  const handleSort = () => {
    const updatedTasks = [...tasks];
    const [movedTask] = updatedTasks.splice(dragStartIndex.current, 1);
    updatedTasks.splice(dragOverIndex.current, 0, movedTask);
    setTasks(updatedTasks);
  };

  return (
    <div className="todo-container">
      <h1>To Do List</h1>

      {/* Add Task */}
      <div className="todo-inputs">
        <div>
          <label>Title</label>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Add title"
          />
        </div>

        <div>
          <label>Description</label>
          <input
            value={textarea}
            onChange={(e) => setTextarea(e.target.value)}
            placeholder="Add description"
          />
        </div>

        <div className="date-box">
          <label>Start</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <label>End</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="add-btn" onClick={addTask}>
          <FontAwesomeIcon icon={faPlus} /> Add
        </button>
      </div>

      {/* Search */}
      <input
        className="search-box"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {/* Task List */}
      <ul className="task-list">
        {tasks
          .filter((task) =>
            task.text.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((task, index) => (
            <li
              key={task.id}
              className={`task-item ${task.completed ? "task-completed" : ""}`}
              onDragEnter={() => (dragOverIndex.current = index)}
              onDragEnd={handleSort}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleCompleted(index)}
              />

              <div className="task-info">
                {editingIndex === index ? (
                  <>
                    <input
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      placeholder="Edit title"
                    />
                    <input
                      value={editingTextarea}
                      onChange={(e) => setEditingTextarea(e.target.value)}
                      placeholder="Edit description"
                    />
                    <input
                      type="date"
                      value={editingStartDate}
                      onChange={(e) => setEditingStartDate(e.target.value)}
                    />
                    <input
                      type="date"
                      value={editingEndDate}
                      onChange={(e) => setEditingEndDate(e.target.value)}
                    />

                    {/* Buttons below inputs */}
                    <div className="edit-buttons">
                      <button
                        onClick={() => saveTask(index)}
                        className="save-btn"
                      >
                        <FontAwesomeIcon icon={faSave} /> Save
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="cancel-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3>{task.text}</h3>
                    <p>{task.textarea}</p>
                    <p>
                      {task.startDate
                        ? new Date(task.startDate).toLocaleDateString()
                        : ""}{" "}
                      -{" "}
                      {task.endDate
                        ? new Date(task.endDate).toLocaleDateString()
                        : ""}
                    </p>
                  </>
                )}
              </div>

              <div className="task-actions">
                {editingIndex !== index && (
                  <button onClick={() => startEditingTask(index)}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                )}
                <button onClick={() => deleteTask(task.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              <div
                className="drag-handle"
                draggable
                onDragStart={() => (dragStartIndex.current = index)}
              >
                ☰
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}

export default Todolist;

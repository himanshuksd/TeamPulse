import { useEffect, useState } from "react";
import api from "../api";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // Load projects
  useEffect(() => {
    api.get("/projects")
      .then(res => setProjects(res.data))
      .catch(err => console.error(err));
  }, []);

  // Load tasks when project changes
  useEffect(() => {
    if (!selectedProject) return;

    api.get(`/projects/${selectedProject}/tasks`)
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, [selectedProject]);

  // Create task
  const addTask = () => {
    if (!newTask || !selectedProject) return;

    api.post("/tasks", {
      title: newTask,
      project_id: selectedProject
    }).then(() => {
      setNewTask("");
      return api.get(`/projects/${selectedProject}/tasks`);
    }).then(res => setTasks(res.data))
      .catch(err => console.error(err));
  };

  // Update task status
  const markDone = (taskId) => {
    api.put(`/tasks/${taskId}`)
      .then(() => api.get(`/projects/${selectedProject}/tasks`))
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  };

  return (
    <div className="dashboard">
      <div className="header">
        <h1>TeamPulse Dashboard</h1>
        <p>Project & Task Management</p>
      </div>

      <div className="section">
        <h2>Select Project</h2>
        <select
          value={selectedProject}
          onChange={e => setSelectedProject(e.target.value)}
        >
          <option value="">-- Select Project --</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="section">
        <h2>Add Task</h2>
        <input
          type="text"
          placeholder="Task title"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          style={{ padding: "6px", width: "200px" }}
        />
        <button onClick={addTask} style={{ marginLeft: "10px" }}>
          Add
        </button>
      </div>

      <div className="section">
        <h2>Tasks</h2>
        {selectedProject === "" ? (
          <p className="empty">Select a project first</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No tasks found</p>
        ) : (
          <ul className="list">
            {tasks.map(task => (
              <li key={task.id}>
                {task.title} — <strong>{task.status}</strong>
                {task.status === "TODO" && (
                  <button
                    onClick={() => markDone(task.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    Mark Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}



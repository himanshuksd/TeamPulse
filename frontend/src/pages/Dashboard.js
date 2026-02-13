import { useEffect, useState } from "react";
import api from "../api";
import {
  Container,
  Typography,
  Select,
  MenuItem,
  TextField,
  Button,
  Card,
  CardContent,
  Box,
  Grid,
  AppBar,
  Toolbar
} from "@mui/material";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newProject, setNewProject] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      fetchTasks(selectedProject);
    }
  }, [selectedProject]);

  const fetchProjects = async () => {
    const res = await api.get("/projects");
    setProjects(res.data);
  };

  const fetchTasks = async (projectId) => {
    const res = await api.get(`/projects/${projectId}/tasks`);
    setTasks(res.data);
  };

  const createProject = async () => {
    if (!newProject) return;

    await api.post("/projects", {
      name: newProject,
      owner_id: 1
    });

    setNewProject("");
    fetchProjects();
  };

  const createTask = async () => {
    if (!newTask) return;

    await api.post("/tasks", {
      title: newTask,
      project_id: selectedProject
    });

    setNewTask("");
    fetchTasks(selectedProject);
  };

  const updateStatus = async (taskId) => {
    await api.put(`/tasks/${taskId}`);
    fetchTasks(selectedProject);
  };

  const deleteTask = async (taskId) => {
    await api.delete(`/tasks/${taskId}`);
    fetchTasks(selectedProject);
  };

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <>
      {/* NAVBAR */}
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            TeamPulse
          </Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Projects</Button>
          <Button color="inherit">Logout</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>

        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        {/* Create Project */}
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="New Project"
            value={newProject}
            onChange={(e) => setNewProject(e.target.value)}
            fullWidth
          />
          <Button variant="contained" onClick={createProject}>
            Add
          </Button>
        </Box>

        {/* Select Project */}
        <Box sx={{ mb: 4 }}>
          <Select
            fullWidth
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            displayEmpty
          >
            <MenuItem value="">Select Project</MenuItem>
            {projects.map((project) => (
              <MenuItem key={project.id} value={project.id}>
                {project.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        {/* Only show tasks if project selected */}
        {selectedProject && (
          <>
            {/* Add Task */}
            <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
              <TextField
                label="New Task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                fullWidth
              />
              <Button variant="contained" onClick={createTask}>
                Add Task
              </Button>
            </Box>

            {/* Kanban Board */}
            <Grid container spacing={4}>

              {/* TODO COLUMN */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, backgroundColor: "#fff3e0", borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    TODO ({todoTasks.length})
                  </Typography>

                  {todoTasks.map((task) => (
                    <Card key={task.id} sx={{ mb: 2 }}>
                      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>{task.title}</Typography>

                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => updateStatus(task.id)}
                          >
                            Done
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => deleteTask(task.id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>

              {/* DONE COLUMN */}
              <Grid item xs={12} md={6}>
                <Box sx={{ p: 3, backgroundColor: "#e8f5e9", borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    DONE ({doneTasks.length})
                  </Typography>

                  {doneTasks.map((task) => (
                    <Card key={task.id} sx={{ mb: 2 }}>
                      <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography>{task.title}</Typography>

                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => deleteTask(task.id)}
                        >
                          Delete
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              </Grid>

            </Grid>
          </>
        )}

      </Container>
    </>
  );
}



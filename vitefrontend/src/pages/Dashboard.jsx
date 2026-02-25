import { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
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
  Toolbar,
  CircularProgress,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState("");
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [newProject, setNewProject] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) fetchTasks(selectedProject);
  }, [selectedProject]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTasks = async (projectId) => {
    try {
      setLoading(true);
      const res = await api.get(`/projects/${projectId}/tasks`);
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async () => {
    if (!newProject.trim()) return;
    try {
      await api.post("/projects", { name: newProject });
      setNewProject("");
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async () => {
    if (!newTask.trim() || !selectedProject) return;
    try {
      await api.post("/tasks", {
        title: newTask,
        project_id: selectedProject,
      });
      setNewTask("");
      fetchTasks(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (taskId) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: "DONE" });
      fetchTasks(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      fetchTasks(selectedProject);
    } catch (err) {
      console.error(err);
    }
  };

  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doneTasks = tasks.filter((t) => t.status === "DONE");

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#f6f8fb" }}>
      {/* NAVBAR */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backdropFilter: "blur(10px)",
          bgcolor: "rgba(15,23,42,0.85)",
        }}
      >
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 700 }}>
            TeamPulse
          </Typography>
          <Button color="inherit">Dashboard</Button>
          <Button color="inherit">Projects</Button>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            Project Dashboard
          </Typography>
        </motion.div>

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", my: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Project Controls */}
        <Card sx={{ mb: 3, borderRadius: 3 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="New Project"
                  value={newProject}
                  onChange={(e) => setNewProject(e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ height: "56px", borderRadius: 2 }}
                  onClick={createProject}
                >
                  Add
                </Button>
              </Grid>
              <Grid item xs={12} md={4}>
                <Select
                  fullWidth
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  displayEmpty
                  sx={{ height: "56px" }}
                >
                  <MenuItem value="">Select Project</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Tasks Section */}
        {selectedProject && (
          <>
            {/* Add Task */}
            <Card sx={{ mb: 4, borderRadius: 3 }}>
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={9}>
                    <TextField
                      label="New Task"
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      fullWidth
                    />
                  </Grid>
                  <Grid item xs={12} md={3}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ height: "56px", borderRadius: 2 }}
                      onClick={createTask}
                    >
                      Add Task
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            {/* Kanban */}
            <Grid container spacing={3}>
              {/* TODO */}
              <Grid item xs={12} md={6}>
                <KanbanColumn
                  title="TODO"
                  count={todoTasks.length}
                  color="#fff7ed"
                >
                  {todoTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onDone={updateStatus}
                      onDelete={deleteTask}
                      showDone
                    />
                  ))}
                </KanbanColumn>
              </Grid>

              {/* DONE */}
              <Grid item xs={12} md={6}>
                <KanbanColumn
                  title="DONE"
                  count={doneTasks.length}
                  color="#ecfdf5"
                >
                  {doneTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onDelete={deleteTask} />
                  ))}
                </KanbanColumn>
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

function KanbanColumn({ title, count, color, children }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Box
        sx={{
          p: 2.5,
          borderRadius: 3,
          bgcolor: color,
          minHeight: 300,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Typography fontWeight={700}>{title}</Typography>
          <Chip label={count} size="small" />
        </Box>
        {children}
      </Box>
    </motion.div>
  );
}

function TaskCard({ task, onDone, onDelete, showDone }) {
  return (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Card sx={{ mb: 2, borderRadius: 2 }}>
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>{task.title}</Typography>
          <Box sx={{ display: "flex", gap: 1 }}>
            {showDone && (
              <Button
                size="small"
                variant="contained"
                color="success"
                onClick={() => onDone(task.id)}
              >
                Done
              </Button>
            )}
            <Button
              size="small"
              variant="outlined"
              color="error"
              onClick={() => onDelete(task.id)}
            >
              Delete
            </Button>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
}

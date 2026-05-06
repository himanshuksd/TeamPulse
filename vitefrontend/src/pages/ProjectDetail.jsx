// // import { useParams } from "react-router-dom";
// // import { useEffect, useState } from "react";
// // import api from "../services/api";

// // export default function ProjectDetail() {
// //     const { projectId } = useParams();

// //     const [tasks, setTasks] = useState([]);
// //     const [project, setProject] = useState(null);

// //     useEffect(() => {
// //         loadProject();
// //         loadTasks();
// //     }, []);

// //     const loadProject = async () => {
// //         try {
// //             const res = await api.get("/projects");
// //             const proj = res.data.find(p => p.id === Number(projectId));
// //             setProject(proj);
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     const loadTasks = async () => {
// //         try {
// //             const res = await api.get(`/projects/${projectId}/tasks`);
// //             setTasks(res.data);
// //         } catch (err) {
// //             console.error(err);
// //         }
// //     };

// //     const todo = tasks.filter(t => t.status === "TODO");
// //     const progress = tasks.filter(t => t.status === "IN_PROGRESS");
// //     const done = tasks.filter(t => t.status === "DONE");

// //     return (
// //         <div className="p-6">

// //             {/* Header */}
// //             <div className="mb-6">
// //                 <h1 className="text-2xl font-bold">{project?.name}</h1>
// //                 <p className="text-gray-500">Project ID: {projectId}</p>
// //             </div>

// //             {/* Board */}
// //             <div className="grid grid-cols-3 gap-6">

// //                 {/* TODO */}
// //                 <div className="bg-gray-100 p-4 rounded-lg">
// //                     <h2 className="font-semibold mb-4">TODO</h2>
// //                     {todo.map(task => (
// //                         <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
// //                             {task.title}
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* IN PROGRESS */}
// //                 <div className="bg-gray-100 p-4 rounded-lg">
// //                     <h2 className="font-semibold mb-4">IN PROGRESS</h2>
// //                     {progress.map(task => (
// //                         <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
// //                             {task.title}
// //                         </div>
// //                     ))}
// //                 </div>

// //                 {/* DONE */}
// //                 <div className="bg-gray-100 p-4 rounded-lg">
// //                     <h2 className="font-semibold mb-4">DONE</h2>
// //                     {done.map(task => (
// //                         <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
// //                             {task.title}
// //                         </div>
// //                     ))}
// //                 </div>

// //             </div>
// //         </div>
// //     );
// // }


// import { useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import api from "../services/api";

// const COLUMNS = [
//     { key: "TODO", label: "TODO", color: "bg-gray-100", badge: "bg-gray-300 text-gray-700" },
//     { key: "IN_PROGRESS", label: "IN PROGRESS", color: "bg-blue-50", badge: "bg-blue-200 text-blue-800" },
//     { key: "DONE", label: "DONE", color: "bg-green-50", badge: "bg-green-200 text-green-800" },
// ];

// export default function ProjectDetail() {
//     const { projectId } = useParams();

//     const [tasks, setTasks] = useState([]);
//     const [project, setProject] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [dragging, setDragging] = useState(null); // task being dragged

//     useEffect(() => {
//         loadProject();
//         loadTasks();
//     }, [projectId]);

//     // ✅ FIX: Now calls GET /projects/{id} directly instead of fetching all projects and filtering
//     const loadProject = async () => {
//         try {
//             const res = await api.get(`/projects/${projectId}`);
//             setProject(res.data);
//         } catch (err) {
//             console.error("Failed to load project:", err);
//         }
//     };

//     const loadTasks = async () => {
//         try {
//             const res = await api.get(`/projects/${projectId}/tasks`);
//             setTasks(res.data);
//         } catch (err) {
//             console.error("Failed to load tasks:", err);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ Drag-and-drop: move task to new column and call backend
//     const handleDrop = async (newStatus) => {
//         if (!dragging || dragging.status === newStatus) return;

//         // Optimistic update
//         setTasks(prev =>
//             prev.map(t => t.id === dragging.id ? { ...t, status: newStatus } : t)
//         );

//         try {
//             await api.put(`/tasks/${dragging.id}`, { status: newStatus });
//         } catch (err) {
//             console.error("Failed to update task status:", err);
//             // Rollback on failure
//             setTasks(prev =>
//                 prev.map(t => t.id === dragging.id ? { ...t, status: dragging.status } : t)
//             );
//         }
//         setDragging(null);
//     };

//     const tasksByStatus = (status) => tasks.filter(t => t.status === status);

//     const totalTasks = tasks.length;
//     const doneTasks = tasks.filter(t => t.status === "DONE").length;
//     const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

//     return (
//         <div className="p-6 min-h-screen bg-white">

//             {/* Header */}
//             <div className="mb-6">
//                 {loading ? (
//                     <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2" />
//                 ) : (
//                     <>
//                         <h1 className="text-2xl font-bold text-gray-800">
//                             {project?.name || "Unnamed Project"}
//                         </h1>
//                         <p className="text-sm text-gray-500 mt-1">
//                             {totalTasks} tasks &nbsp;·&nbsp; {doneTasks} completed &nbsp;·&nbsp; {progress}% done
//                         </p>

//                         {/* Progress bar */}
//                         <div className="mt-3 w-full max-w-sm bg-gray-200 rounded-full h-2">
//                             <div
//                                 className="bg-blue-500 h-2 rounded-full transition-all duration-300"
//                                 style={{ width: `${progress}%` }}
//                             />
//                         </div>
//                     </>
//                 )}
//             </div>

//             {/* Kanban Board */}
//             <div className="grid grid-cols-3 gap-6">
//                 {COLUMNS.map(col => (
//                     <div
//                         key={col.key}
//                         className={`${col.color} p-4 rounded-lg min-h-[300px] border-2 border-transparent transition-colors`}
//                         onDragOver={(e) => e.preventDefault()}
//                         onDrop={() => handleDrop(col.key)}
//                         onDragEnter={(e) => e.currentTarget.classList.add("border-blue-400")}
//                         onDragLeave={(e) => e.currentTarget.classList.remove("border-blue-400")}
//                     >
//                         {/* Column header */}
//                         <div className="flex items-center justify-between mb-4">
//                             <h2 className="font-semibold text-gray-700">{col.label}</h2>
//                             <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
//                                 {tasksByStatus(col.key).length}
//                             </span>
//                         </div>

//                         {/* Task cards */}
//                         {loading ? (
//                             [1, 2].map(i => (
//                                 <div key={i} className="bg-white p-3 rounded shadow mb-2 h-14 animate-pulse bg-gray-200" />
//                             ))
//                         ) : tasksByStatus(col.key).length === 0 ? (
//                             <p className="text-xs text-gray-400 text-center mt-8">No tasks here</p>
//                         ) : (
//                             tasksByStatus(col.key).map(task => (
//                                 <div
//                                     key={task.id}
//                                     draggable
//                                     onDragStart={() => setDragging(task)}
//                                     onDragEnd={() => setDragging(null)}
//                                     className="bg-white p-3 rounded shadow mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
//                                 >
//                                     <p className="text-sm font-medium text-gray-800">{task.title}</p>
//                                     <div className="flex items-center justify-between mt-1">
//                                         {task.assigned_user && (
//                                             <span className="text-xs text-gray-500">
//                                                 👤 {task.assigned_user.name}
//                                             </span>
//                                         )}
//                                         {task.deadline && (
//                                             <span className={`text-xs ${new Date(task.deadline) < new Date() && task.status !== "DONE" ? "text-red-500" : "text-gray-400"}`}>
//                                                 📅 {new Date(task.deadline).toLocaleDateString()}
//                                             </span>
//                                         )}
//                                     </div>
//                                     {task.complexity_score && (
//                                         <span className="text-xs text-purple-500 mt-1 block">
//                                             Complexity: {task.complexity_score}
//                                         </span>
//                                     )}
//                                 </div>
//                             ))
//                         )}
//                     </div>
//                 ))}
//             </div>
//         </div>
//     );
// }

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useTeam } from "../context/TeamContext";
import api from "../services/api";
import { Plus, Trash2, X, Calendar, User, Zap, ArrowLeft } from "lucide-react";

const COLUMNS = [
    { key: "TODO", label: "TODO", color: "bg-gray-50", badge: "bg-gray-200 text-gray-700" },
    { key: "IN_PROGRESS", label: "IN PROGRESS", color: "bg-blue-50", badge: "bg-blue-200 text-blue-800" },
    { key: "DONE", label: "DONE", color: "bg-green-50", badge: "bg-green-200 text-green-800" },
];

export default function ProjectDetail() {
   
    const { id: projectId } = useParams();
    const navigate = useNavigate();
    const { activeTeamId } = useTeam();

    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dragging, setDragging] = useState(null);
    const [myRole, setMyRole] = useState(null);

    // Add-task form
    const [showForm, setShowForm] = useState(false);
    const [taskTitle, setTaskTitle] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [deadline, setDeadline] = useState("");
    const [complexity, setComplexity] = useState(1);
    const [creating, setCreating] = useState(false);

    useEffect(() => {
        loadAll();
    }, [projectId]);

    const loadAll = async () => {
        setLoading(true);
        try {
            const [projRes, taskRes] = await Promise.all([
                api.get(`/projects/${projectId}`),
                api.get(`/projects/${projectId}/tasks`),
            ]);
            setProject(projRes.data);
            setTasks(taskRes.data);

            // Load team members for assignment dropdown
            // ✅ fix
            const teamId = projRes.data?.team_id || activeTeamId;
            if (teamId) {
                const [membersRes, roleRes] = await Promise.all([
                    api.get(`/teams/${teamId}/members`),
                    api.get(`/teams/${teamId}/my-role`),
                ]);
                setMembers(membersRes.data);
                setMyRole(roleRes.data?.role);
                // Always set first member as default assignee
                if (membersRes.data.length > 0) {
                    setAssignedTo(membersRes.data[0].user_id);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Drag & Drop ──
    const handleDrop = async (newStatus) => {
        if (!dragging || dragging.status === newStatus) return;
        setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: newStatus } : t));
        try {
            await api.put(`/tasks/${dragging.id}`, { status: newStatus });
        } catch {
            setTasks(prev => prev.map(t => t.id === dragging.id ? { ...t, status: dragging.status } : t));
        }
        setDragging(null);
    };

    // ── Create Task ──
    const handleCreateTask = async () => {
        if (!taskTitle.trim() || !assignedTo) return;
        setCreating(true);
        try {
            await api.post("/tasks", {
                title: taskTitle,
                project_id: Number(projectId),
                assigned_user_id: Number(assignedTo),
                complexity_score: Number(complexity),
                deadline: deadline || null,
            });
            setTaskTitle("");
            setDeadline("");
            setComplexity(1);
            setShowForm(false);
            const res = await api.get(`/projects/${projectId}/tasks`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setCreating(false);
        }
    };

    // ── Delete Task ──
    const handleDeleteTask = async (taskId) => {
        if (!window.confirm("Delete this task?")) return;
        try {
            await api.delete(`/tasks/${taskId}`);
            setTasks(prev => prev.filter(t => t.id !== taskId));
        } catch (err) {
            console.error(err);
        }
    };

    // ── Delete Project ──
    const handleDeleteProject = async () => {
        if (!window.confirm("Delete this project and all its tasks?")) return;
        try {
            await api.delete(`/projects/${projectId}`);
            navigate("/projects");
        } catch (err) {
            console.error(err);
        }
    };

    const tasksByStatus = (status) => tasks.filter(t => t.status === status);
    const totalTasks = tasks.length;
    const doneTasks = tasks.filter(t => t.status === "DONE").length;
    const progress = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;
    const isAdmin = myRole === "admin";

    return (
        <div className="p-6 min-h-screen bg-white">

            {/* ── Header ── */}
            <div className="mb-6">
                <button
                    onClick={() => navigate("/projects")}
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 mb-3 transition-colors"
                >
                    <ArrowLeft size={14} /> Back to Projects
                </button>

                {loading ? (
                    <div className="h-8 w-48 bg-gray-200 animate-pulse rounded mb-2" />
                ) : (
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">{project?.name || "Unnamed Project"}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                {totalTasks} tasks · {doneTasks} completed · {progress}% done
                            </p>
                            <div className="mt-3 w-64 bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowForm(true)}
                                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
                            >
                                <Plus size={14} /> Add Task
                            </button>
                            {isAdmin && (
                                <button
                                    onClick={handleDeleteProject}
                                    className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl border border-red-200 transition-all"
                                >
                                    <Trash2 size={14} /> Delete Project
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* ── Add Task Form ── */}
            {showForm && (
                <div className="bg-white border border-blue-200 rounded-2xl p-5 shadow-sm mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-gray-900">Add New Task</h3>
                        <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                            <X size={16} />
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Title */}
                        <div className="col-span-2">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block">Task Title *</label>
                            <input
                                type="text"
                                placeholder="Enter task title..."
                                value={taskTitle}
                                onChange={e => setTaskTitle(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleCreateTask()}
                                autoFocus
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all"
                            />
                        </div>

                        {/* Assign to */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1">
                                <User size={11} /> Assign To *
                            </label>
                            <select
                                value={assignedTo}
                                onChange={e => setAssignedTo(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-white transition-all"
                            >
                                {members.map(m => (
                                    <option key={m.user_id} value={m.user_id}>{m.name}</option>
                                ))}
                            </select>
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1">
                                <Calendar size={11} /> Deadline
                            </label>
                            <input
                                type="date"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* Complexity */}
                        <div className="col-span-2">
                            <label className="text-xs font-semibold text-gray-600 mb-1 block flex items-center gap-1">
                                <Zap size={11} /> Complexity: {complexity}
                            </label>
                            <input
                                type="range" min="1" max="10"
                                value={complexity}
                                onChange={e => setComplexity(e.target.value)}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-0.5">
                                <span>Easy</span><span>Hard</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 mt-4">
                        <button
                            onClick={handleCreateTask}
                            disabled={creating || !taskTitle.trim()}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all"
                        >
                            {creating ? "Creating..." : <><Plus size={14} /> Create Task</>}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* ── Kanban Board ── */}
            <div className="grid grid-cols-3 gap-6">
                {COLUMNS.map(col => (
                    <div
                        key={col.key}
                        className={`${col.color} p-4 rounded-xl min-h-[300px] border-2 border-transparent transition-colors`}
                        onDragOver={e => e.preventDefault()}
                        onDrop={() => handleDrop(col.key)}
                        onDragEnter={e => e.currentTarget.classList.add("border-blue-400")}
                        onDragLeave={e => e.currentTarget.classList.remove("border-blue-400")}
                    >
                        {/* Column header */}
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-sm text-gray-700">{col.label}</h2>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${col.badge}`}>
                                {tasksByStatus(col.key).length}
                            </span>
                        </div>

                        {/* Tasks */}
                        {loading ? (
                            [1, 2].map(i => (
                                <div key={i} className="bg-white p-3 rounded-xl shadow mb-2 h-14 animate-pulse" />
                            ))
                        ) : tasksByStatus(col.key).length === 0 ? (
                            <p className="text-xs text-gray-400 text-center mt-8">No tasks here</p>
                        ) : (
                            tasksByStatus(col.key).map(task => (
                                <div
                                    key={task.id}
                                    draggable
                                    onDragStart={() => setDragging(task)}
                                    onDragEnd={() => setDragging(null)}
                                    className="bg-white p-3 rounded-xl shadow mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-medium text-gray-800">{task.title}</p>
                                        {/* Delete — admin sees all, members see only their own */}
                                        {(isAdmin || task.assigned_user_id === Number(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))?.id : 0)) && (
                                            <button
                                                onClick={() => handleDeleteTask(task.id)}
                                                className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                                            >
                                                <Trash2 size={13} />
                                            </button>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-2 flex-wrap gap-1">
                                        {task.assigned_user && (
                                            <span className="text-xs text-gray-500 flex items-center gap-1">
                                                <User size={10} /> {task.assigned_user.name}
                                            </span>
                                        )}
                                        {task.deadline && (
                                            <span className={`text-xs flex items-center gap-1 ${new Date(task.deadline) < new Date() && task.status !== "DONE" ? "text-red-500" : "text-gray-400"}`}>
                                                <Calendar size={10} />
                                                {new Date(task.deadline).toLocaleDateString()}
                                            </span>
                                        )}
                                    </div>

                                    {task.complexity_score && (
                                        <span className="text-xs text-purple-500 mt-1 flex items-center gap-1">
                                            <Zap size={10} /> Complexity: {task.complexity_score}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
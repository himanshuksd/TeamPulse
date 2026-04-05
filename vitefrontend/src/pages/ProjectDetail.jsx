import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProjectDetail() {
    const { projectId } = useParams();

    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);

    useEffect(() => {
        loadProject();
        loadTasks();
    }, []);

    const loadProject = async () => {
        try {
            const res = await api.get("/projects");
            const proj = res.data.find(p => p.id === Number(projectId));
            setProject(proj);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTasks = async () => {
        try {
            const res = await api.get(`/projects/${projectId}/tasks`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const todo = tasks.filter(t => t.status === "TODO");
    const progress = tasks.filter(t => t.status === "IN_PROGRESS");
    const done = tasks.filter(t => t.status === "DONE");

    return (
        <div className="p-6">

            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{project?.name}</h1>
                <p className="text-gray-500">Project ID: {projectId}</p>
            </div>

            {/* Board */}
            <div className="grid grid-cols-3 gap-6">

                {/* TODO */}
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="font-semibold mb-4">TODO</h2>
                    {todo.map(task => (
                        <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
                            {task.title}
                        </div>
                    ))}
                </div>

                {/* IN PROGRESS */}
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="font-semibold mb-4">IN PROGRESS</h2>
                    {progress.map(task => (
                        <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
                            {task.title}
                        </div>
                    ))}
                </div>

                {/* DONE */}
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2 className="font-semibold mb-4">DONE</h2>
                    {done.map(task => (
                        <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
                            {task.title}
                        </div>
                    ))}
                </div>

            </div>
        </div>
    );
}
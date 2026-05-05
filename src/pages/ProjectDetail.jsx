import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function ProjectDetail() {
    const { id } = useParams();

    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);

    useEffect(() => {
        if (!id) return;
        loadProject();
        loadTasks();
    }, [id]);

    const loadProject = async () => {
        try {
            const res = await api.get(`/projects/${id}`);
            setProject(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const loadTasks = async () => {
        try {
            const res = await api.get(`/projects/${id}/tasks`);
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const todo = tasks.filter(t => t.status?.toLowerCase() === "todo");
    const progress = tasks.filter(t => t.status?.toLowerCase() === "in_progress");
    const done = tasks.filter(t => t.status?.toLowerCase() === "done");

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">{project?.name}</h1>
                <p className="text-gray-500">Project ID: {id}</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {[["TODO", todo], ["IN PROGRESS", progress], ["DONE", done]].map(([title, list]) => (
                    <div key={title} className="bg-gray-100 p-4 rounded-lg">
                        <h2 className="font-semibold mb-4">{title}</h2>
                        {list.map(task => (
                            <div key={task.id} className="bg-white p-3 rounded shadow mb-2">
                                {task.title}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

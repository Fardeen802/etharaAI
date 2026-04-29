import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    project: "",
    assignedTo: "",
  });

  const fetchData = async () => {
    try {
      const [taskRes, projectRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      setTasks(taskRes.data);
      setProjects(projectRes.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/tasks", form);
      setForm({ title: "", project: "", assignedTo: "" });
      fetchData();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/tasks/${id}/status`, { status });
      fetchData();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tasks</h1>

      {/* Admin Create Task */}
      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="space-y-2 mb-6">
          <input
            placeholder="Task title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
            className="border p-2 w-full"
          />

          <select
            value={form.project}
            onChange={(e) =>
              setForm({ ...form, project: e.target.value })
            }
            className="border p-2 w-full"
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>

          <input
            placeholder="Assign user ID"
            value={form.assignedTo}
            onChange={(e) =>
              setForm({ ...form, assignedTo: e.target.value })
            }
            className="border p-2 w-full"
          />

          <button className="bg-black text-white px-4 py-2">
            Create Task
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((t) => (
          <div key={t._id} className="bg-white p-4 rounded shadow">
            <h2 className="font-bold">{t.title}</h2>
            <p>{t.project?.name}</p>
            <p>Status: {t.status}</p>

            {/* Status update */}
            <div className="space-x-2 mt-2">
              {["todo", "in-progress", "done"].map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(t._id, s)}
                  className="px-2 py-1 border"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tasks;
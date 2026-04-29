import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Tasks = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);

  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  const [form, setForm] = useState({
    title: "",
    project: "",
    assignedTo: "",
  });

  const fetchData = async () => {
    try {
      const [taskRes, projectRes, userRes] = await Promise.all([
        api.get("/tasks"),
        api.get("/projects"),
        user?.role === "admin" ? api.get("/users") : Promise.resolve({ data: [] }),
      ]);
  
      setTasks(taskRes.data);
      setProjects(projectRes.data);
      setUsers(userRes.data);
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

          <select
  value={form.assignedTo}
  onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
  className="border p-2 w-full rounded"
  required
>
  <option value="">Assign to user</option>
  {users.map((u) => (
    <option key={u._id} value={u._id}>
      {u.name} ({u.email}) - {u.role}
    </option>
  ))}
</select>

          <button className="bg-black text-white px-4 py-2">
            Create Task
          </button>
        </form>
      )}

      {/* Task List */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
  {tasks.map((t) => (
    <div
      key={t._id}
      className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition border"
    >
      <h2 className="font-semibold text-lg">{t.title}</h2>

      <p className="text-gray-500 text-sm mt-1">
        {t.project?.name}
      </p>

      <div className="mt-3">
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            t.status === "done"
              ? "bg-green-100 text-green-600"
              : t.status === "in-progress"
              ? "bg-yellow-100 text-yellow-600"
              : "bg-gray-200 text-gray-600"
          }`}
        >
          {t.status}
        </span>
      </div>

      {/* Status Buttons */}
      <div className="flex flex-wrap gap-2 mt-4">
        {["todo", "in-progress", "done"].map((s) => (
          <button
            key={s}
            onClick={() => updateStatus(t._id, s)}
            className="text-xs px-3 py-1 border rounded-lg hover:bg-gray-100 transition"
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
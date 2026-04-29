import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ name: "", description: "" });

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await api.post("/projects", form);
      setForm({ name: "", description: "" });
      fetchProjects();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Projects</h1>

      {/* Admin Create */}
      {user?.role === "admin" && (
        <form onSubmit={handleCreate} className="mb-6 space-y-2">
          <input
            placeholder="Project name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="border p-2 w-full"
          />
          <input
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="border p-2 w-full"
          />
          <button className="bg-black text-white px-4 py-2">
            Create Project
          </button>
        </form>
      )}

      {/* Project List */}
      <div className="space-y-3">
        {projects.map((p) => (
          <div key={p._id} className="bg-white p-4 shadow rounded">
            <h2 className="font-bold">{p.name}</h2>
            <p className="text-gray-600">{p.description}</p>
          </div>
        ))}
      </div>
      
    </div>
  );
};

export default Projects;
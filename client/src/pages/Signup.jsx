import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/signup", form);
      loginUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Create Account</h1>

        {error && <p className="bg-red-100 text-red-700 p-2 rounded mb-3">{error}</p>}

        <input name="name" placeholder="Name" onChange={handleChange}
          className="w-full border p-2 rounded mb-3" />

        <input name="email" placeholder="Email" onChange={handleChange}
          className="w-full border p-2 rounded mb-3" />

        <input name="password" type="password" placeholder="Password" onChange={handleChange}
          className="w-full border p-2 rounded mb-3" />

        <button className="w-full bg-black text-white py-2 rounded">
          Signup
        </button>

        <p className="mt-3 text-sm">
          Already have account? <Link className="text-blue-600" to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const { loginUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await api.post("/auth/login", form);
      loginUser(res.data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-sm p-8">

        {/* Icon + heading */}
        <div className="mb-7">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mb-5">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">Welcome back</h1>
          <p className="text-sm text-gray-500 mt-1">Sign in to continue</p>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-3 py-2.5 mb-5">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-500 mb-1.5">Email</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-3 py-2 pr-12 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2 text-xs text-gray-500 hover:text-black"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-sm text-gray-500">Password</label>
              <a href="#" className="text-xs text-gray-400 hover:text-gray-700 transition">Forgot password?</a>
            </div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="••••••••"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gray-900 transition"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-700 transition mt-2"
          >
            Sign in
          </button>
        </form>

        <p className="mt-5 text-sm text-center text-gray-500">
          No account?{" "}
          <Link to="/signup" className="text-gray-900 font-medium hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Gmail validation
  const isValidGmail = (email) => {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!form.name || !form.email || !form.password) {
      return setError("All fields are required");
    }

    if (!isValidGmail(form.email)) {
      return setError("Only Gmail addresses are allowed");
    }

    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

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
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Create Account
        </h1>

        {error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
            {error}
          </p>
        )}

        {/* Name */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Email */}
        <input
          name="email"
          placeholder="Gmail only (example@gmail.com)"
          value={form.email}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        {/* Password with toggle */}
        <div className="relative mb-3">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password (min 6 chars)"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded pr-12"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-2 text-sm text-gray-600"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <button className="w-full bg-black text-white py-2 rounded hover:bg-gray-800">
          Signup
        </button>

        <p className="mt-3 text-sm text-center">
          Already have account?{" "}
          <Link className="text-blue-600" to="/login">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
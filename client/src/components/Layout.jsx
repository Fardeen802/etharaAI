import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive(path)
        ? "bg-black text-white"
        : "text-gray-600 hover:bg-gray-100 hover:text-black"
    }`;

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/dashboard" className="font-bold text-xl">
            Ethara AI
          </Link>

          <nav className="flex items-center gap-2">
            <Link to="/dashboard" className={navClass("/dashboard")}>
              Dashboard
            </Link>
            <Link to="/projects" className={navClass("/projects")}>
              Projects
            </Link>
            <Link to="/tasks" className={navClass("/tasks")}>
              Tasks
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-lg bg-red-500 text-white text-sm hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
};

export default Layout;
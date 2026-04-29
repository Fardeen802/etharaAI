import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";



const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalTasks: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    overdue: 0,
  });

  const fetchStats = async () => {
    try {
      const res = await api.get("/dashboard/stats");
      setStats(res.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const cards = [
    { label: "Total Tasks", value: stats.totalTasks },
    { label: "Todo", value: stats.todo },
    { label: "In Progress", value: stats.inProgress },
    { label: "Done", value: stats.done },
    { label: "Overdue", value: stats.overdue },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      

      <div className="grid md:grid-cols-5 gap-4 mt-6">
        {cards.map((item) => (
          <div key={item.label} className="bg-white p-5 rounded-xl shadow">
            <p className="text-gray-500">{item.label}</p>
            <h2 className="text-3xl font-bold">{item.value}</h2>
          </div>
        ))}
      </div>
 
    </div>
  );
};

export default Dashboard;
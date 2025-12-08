import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/notes"); // Redirect to All Notes page
  }, [navigate]);

  return null;
};

export default Dashboard;

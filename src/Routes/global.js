import { Routes, Route } from "react-router-dom";
import Login from "../View/Pages/Auth/login.js";
import Dashboard from "../View/Components/Dashboard/Dashboard.js";
function GlobalRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />}/>
    </Routes>
  );
}

export default GlobalRoutes;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from '../View/Pages/Auth/logIn';
const globalRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default globalRoutes;

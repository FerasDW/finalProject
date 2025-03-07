import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalRoutes from "./Routes/global";
import { AuthProvider } from "./Context/AuthContext.js";

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <GlobalRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;

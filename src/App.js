import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalRoutes from "./Routes/global";
import { AuthProvider } from "./Context/AuthContext.js";
import { CookiesProvider } from "react-cookie";

const App = () => {
  return (
    <CookiesProvider>
      <Router>
        <AuthProvider>
          <GlobalRoutes />
        </AuthProvider>
      </Router>
    </CookiesProvider>
  );
};

export default App;

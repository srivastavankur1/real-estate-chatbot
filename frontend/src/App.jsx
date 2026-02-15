import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SavedProperties from "./pages/SavedProperties";


function PrivateRoute({ children }) {
  const userId = localStorage.getItem("user_id");
  return userId ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/chat"
          element={
            <PrivateRoute>
              <ChatPage />
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/saved"
          element={
            <PrivateRoute>
              <SavedProperties />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

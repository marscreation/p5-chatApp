import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Chat from "./pages/Chat/Chat";
import Messages from "./components/Messages/Messages";

function App() {
  function PrivateRoute({ element: Element }) {
    const isLoggedIn = sessionStorage.getItem("token") !== null;

    if (isLoggedIn && window.location.pathname === "/register") {
      return <Navigate to="/chat" replace />;
    } else if (!isLoggedIn && window.location.pathname === "/register") {
      return <Element />;
    }
    return isLoggedIn ? <Element /> : <Navigate to="/" replace />;
  }

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<PrivateRoute element={Register} />} />
            <Route path="/chat" element={<PrivateRoute element={Chat} />}>
              <Route path=":chatId" element={<Messages />} />
            </Route>
          </Routes>
        </AuthProvider>
      </Router>
    </>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import AskDoubt from "./pages/AskDoubt";
import TeacherDashboard from "./pages/TeacherDashboard";





function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ask-doubt" element={<AskDoubt />} />
        
<Route path="/teacher-doubts" element={<TeacherDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

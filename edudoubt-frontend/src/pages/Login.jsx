import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password
    });

    localStorage.setItem("role", res.data.role);
    localStorage.setItem("userId", res.data.userId);

    navigate("/home");
  };

  return (
    <div className="center-container">
      <Card sx={{ width: 380, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            EduDoubt Login
          </Typography>

          <form onSubmit={handleLogin}>
            <TextField
              id="loginEmail"
              label="Email"
              fullWidth
              margin="normal"
              onChange={(e) => setEmail(e.target.value)}
            />

            <TextField
              id="loginPassword"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              id="loginBtn"
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 2 }}
            >
              Login
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            New user?{" "}
            <Link to="/register" style={{ textDecoration: "none" }}>
              Register now
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

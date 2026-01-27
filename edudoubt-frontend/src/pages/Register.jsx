import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem
} from "@mui/material";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    courseCodes: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    await axios.post("http://localhost:5000/api/auth/register", {
      ...form,
      courseCodes:
        form.role === "teacher"
          ? form.courseCodes.split(",").map(c => c.trim())
          : []
    });

    navigate("/");
  };

  return (
    <div className="center-container">
      <Card sx={{ width: 420, boxShadow: 5 }}>
        <CardContent>
          <Typography variant="h5" align="center">
            Create Account
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField name="name" label="Name" fullWidth margin="normal" onChange={handleChange} />
            <TextField name="email" label="Email" fullWidth margin="normal" onChange={handleChange} />
            <TextField name="password" label="Password" type="password" fullWidth margin="normal" onChange={handleChange} />

            <TextField
              name="role"
              select
              label="Role"
              fullWidth
              margin="normal"
              onChange={handleChange}
            >
              <MenuItem value="student">Student</MenuItem>
              <MenuItem value="teacher">Teacher</MenuItem>
            </TextField>

            {form.role === "teacher" && (
              <TextField
                name="courseCodes"
                label="Course Codes (UCS517,UMA035,UCS501,UCS701)"
                fullWidth
                margin="normal"
                onChange={handleChange}
              />
            )}

            <Button variant="contained" fullWidth sx={{ mt: 2 }} type="submit">
              Register
            </Button>
          </form>

          <Typography align="center" sx={{ mt: 2 }}>
            Already registered?{" "}
            <Link to="/" style={{ textDecoration: "none" }}>
              Login
            </Link>
          </Typography>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;

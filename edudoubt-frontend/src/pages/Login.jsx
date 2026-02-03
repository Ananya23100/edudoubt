import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  Box,
  FormControlLabel,
  Checkbox
} from "@mui/material";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );

      localStorage.setItem("role", res.data.role);
      localStorage.setItem("userId", res.data.userId);

      if (rememberMe) {
        localStorage.setItem("email", email);
      }

      navigate("/home");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        setError("Incorrect email or password");
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="center-container">
      <Card sx={{ 
        width: 420, 
        boxShadow: 5,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>📚</Typography>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c' }}>
              Welcome Back
            </Typography>
            <Typography sx={{ color: '#718096', fontSize: '0.9rem', mt: 1 }}>
              Sign in to your EduDoubt account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              id="loginEmail"
              label="Email Address"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              InputLabelProps={{ style: { color: '#718096' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: '2px'
                  }
                }
              }}
            />

            <TextField
              id="loginPassword"
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              InputLabelProps={{ style: { color: '#718096' } }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  '& fieldset': {
                    borderColor: '#e2e8f0'
                  },
                  '&:hover fieldset': {
                    borderColor: '#667eea'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#667eea',
                    borderWidth: '2px'
                  }
                }
              }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: '#667eea',
                    '&.Mui-checked': {
                      color: '#667eea'
                    }
                  }}
                />
              }
              label={<Typography sx={{ fontSize: '0.9rem' }}>Remember me</Typography>}
              sx={{ mt: 2, mb: 2 }}
            />

            <Button
              id="loginBtn"
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #673a91 100%)',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Sign In
            </Button>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center', borderTop: '1px solid #e2e8f0', pt: 3 }}>
            <Typography sx={{ color: '#4a5568', fontSize: '0.9rem' }}>
              New to EduDoubt?{" "}
              <Link to="/register" style={{ 
                textDecoration: "none", 
                color: '#667eea',
                fontWeight: 600,
                transition: 'color 0.3s ease'
              }}>
                Create an account
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;

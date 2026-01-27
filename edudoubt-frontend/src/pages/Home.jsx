import { Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function Home() {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();

  return (
    <div className="center-container">
      <Card sx={{ width: 500, textAlign: "center", boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Welcome to EduDoubt
          </Typography>

          {role === "student" && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/ask-doubt")}
            >
              Ask a Doubt
            </Button>
          )}

          {role === "teacher" && (
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/teacher-doubts")}
            >
              View Assigned Doubts
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Home;

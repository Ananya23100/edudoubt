import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField
} from "@mui/material";

function TeacherDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [answer, setAnswer] = useState("");

  const teacherId = localStorage.getItem("userId");

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/doubts/teacher/${teacherId}`)
      .then(res => setDoubts(res.data));
  }, [teacherId]);

  const resolveDoubt = async (doubtId) => {
    await axios.post("http://localhost:5000/api/doubts/resolve", {
      doubtId,
      teacherAnswer: answer
    });

    alert("Doubt resolved");
    window.location.reload();
  };

  return (
    <div className="center-container">
      <div style={{ width: "600px" }}>
        <Typography variant="h4" gutterBottom>
          Assigned Doubts
        </Typography>

        {doubts.length === 0 && (
          <Typography>No pending doubts 🎉</Typography>
        )}

        {doubts.map(doubt => (
          <Card key={doubt._id} sx={{ mb: 2 }}>
            <CardContent>
              <Typography><b>Course:</b> {doubt.courseCode}</Typography>
              <Typography><b>Question:</b> {doubt.question}</Typography>

              <TextField
                label="Your Answer"
                fullWidth
                multiline
                rows={3}
                margin="normal"
                onChange={(e) => setAnswer(e.target.value)}
              />

              <Button
                variant="contained"
                onClick={() => resolveDoubt(doubt._id)}
              >
                Resolve
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default TeacherDashboard;

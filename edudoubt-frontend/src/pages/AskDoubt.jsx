import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

function AskDoubt() {
  const [question, setQuestion] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);

  // Fetch courses
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then(res => {
        setCourses(res.data);
        setFilteredCourses(res.data);
      })
      .catch(err => console.error(err));
  }, []);

  // Filter courses by semester
  useEffect(() => {
    if (!semester) {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        course =>
          course.semester === Number(semester) || course.category
      );
      setFilteredCourses(filtered);
    }
  }, [semester, courses]);

  const handleSubmit = async () => {
    if (!question || !courseCode) {
      alert("Please fill all fields");
      return;
    }

    await axios.post("http://localhost:5000/api/doubts/ask", {
      studentId: localStorage.getItem("userId"),
      question,
      courseCode
    });

    alert("Doubt submitted successfully 🎉");
    setQuestion("");
    setCourseCode("");
  };

  return (
    <div className="center-container">
      <Card sx={{ width: 550, boxShadow: 4 }}>
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom>
            Ask a Doubt
          </Typography>

          {/* 🔹 Semester Filter */}
          <TextField
            select
            label="Filter by Semester (optional)"
            fullWidth
            margin="normal"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          >
            <MenuItem value="">All Semesters</MenuItem>
            {[1, 2, 3, 4, 5, 6, 7].map(sem => (
              <MenuItem key={sem} value={sem}>
                Semester {sem}
              </MenuItem>
            ))}
          </TextField>

          {/* 🔍 Searchable Course Dropdown */}
          <Autocomplete
            options={filteredCourses}
            getOptionLabel={(course) =>
              `${course.code} – ${course.name}` +
              (course.semester ? ` (Sem ${course.semester})` : "") +
              (course.category ? ` (${course.category})` : "")
            }
            onChange={(e, value) =>
              setCourseCode(value ? value.code : "")
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search & Select Course"
                margin="normal"
                fullWidth
              />
            )}
          />

          {/* Doubt input */}
          <TextField
            label="Enter your doubt"
            multiline
            rows={4}
            fullWidth
            margin="normal"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleSubmit}
          >
            Submit Doubt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default AskDoubt;

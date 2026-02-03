import { useEffect, useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  MenuItem,
  Box,
  Alert
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";

function AskDoubt() {
  const [question, setQuestion] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courses, setCourses] = useState([]);
  const [semester, setSemester] = useState("");
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/courses")
      .then(res => {
        setCourses(res.data);
        setFilteredCourses(res.data);
      })
      .catch(err => console.error(err));
  }, []);

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

    setLoading(true);
    try {
      await axios.post("http://localhost:5000/api/doubts/ask", {
        studentId: localStorage.getItem("userId"),
        question,
        courseCode
      });

      setSubmitted(true);
      setQuestion("");
      setCourseCode("");
      setSemester("");
      
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error(err);
      alert("Failed to submit doubt. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <Box sx={{ maxWidth: '700px', margin: '0 auto' }}>
        <Card sx={{ 
          boxShadow: 4,
          borderRadius: '16px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.98))',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography sx={{ fontSize: '2.5rem', mb: 1 }}>❓</Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
                Ask Your Doubt
              </Typography>
              <Typography sx={{ color: '#718096', fontSize: '0.9rem' }}>
                Get instant answers from our AI or connect with teachers
              </Typography>
            </Box>

            {submitted && (
              <Alert severity="success" sx={{ mb: 3, borderRadius: '8px', fontWeight: 500 }}>
                ✅ Your doubt has been submitted successfully! We'll analyze it and provide answers soon.
              </Alert>
            )}

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <Box>
                <Typography sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#2d3748',
                  mb: 1
                }}>
                  Filter by Semester (Optional)
                </Typography>
                <TextField
                  select
                  label="Select Semester"
                  fullWidth
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  variant="outlined"
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
                >
                  <MenuItem value="">All Semesters</MenuItem>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(sem => (
                    <MenuItem key={sem} value={sem}>
                      Semester {sem}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box>
                <Typography sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#2d3748',
                  mb: 1
                }}>
                  Select Course
                </Typography>
                <Autocomplete
                  options={filteredCourses}
                  getOptionLabel={(course) =>
                    `${course.code} – ${course.name}` +
                    (course.semester ? ` (Sem ${course.semester})` : "")
                  }
                  onChange={(e, value) =>
                    setCourseCode(value ? value.code : "")
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Search your course"
                      placeholder="Start typing..."
                      variant="outlined"
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
                  )}
                />
              </Box>

              <Box>
                <Typography sx={{ 
                  fontSize: '0.9rem', 
                  fontWeight: 600, 
                  color: '#2d3748',
                  mb: 1
                }}>
                  Your Doubt
                </Typography>
                <TextField
                  label="Describe your doubt in detail..."
                  multiline
                  rows={5}
                  fullWidth
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Be as specific as possible to get better answers"
                  variant="outlined"
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
              </Box>

              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={handleSubmit}
                disabled={loading || !question || !courseCode}
                sx={{
                  mt: 1,
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
                  },
                  '&:disabled': {
                    opacity: 0.6,
                    cursor: 'not-allowed'
                  }
                }}
              >
                {loading ? '⏳ Submitting...' : '🚀 Submit Doubt'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default AskDoubt;

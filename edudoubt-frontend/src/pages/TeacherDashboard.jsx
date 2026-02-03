import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  Chip,
  Alert,
  ButtonGroup
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const [doubts, setDoubts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState({});
  const [filter, setFilter] = useState("all"); // "pending", "answered", "all"
  const teacherId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchDoubts = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/doubts/teacher/${teacherId}`);
      setDoubts(res.data);
    } catch (err) {
      console.error("Error fetching doubts:", err);
    }
  };

  useEffect(() => {
    fetchDoubts();
    // Auto-refresh every 5 seconds to catch new messages and status changes
    const interval = setInterval(fetchDoubts, 5000);
    return () => clearInterval(interval);
  }, [teacherId]);

  const resolveDoubt = async (doubtId) => {
    if (!answers[doubtId]) {
      alert("Please enter an answer first");
      return;
    }

    setSubmitting(prev => ({ ...prev, [doubtId]: true }));

    try {
      await axios.post("http://localhost:5000/api/doubts/resolve", {
        doubtId,
        teacherAnswer: answers[doubtId]
      });

      setDoubts(prev =>
        prev.map(d =>
          d._id === doubtId
            ? { ...d, status: "resolved" }
            : d
        )
      );

      setAnswers(prev => {
        const updated = { ...prev };
        delete updated[doubtId];
        return updated;
      });
    } catch (err) {
      alert("Error resolving doubt. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(prev => ({ ...prev, [doubtId]: false }));
    }
  };

  const getStatusColor = (status) => {
    if (status === "resolved") return "success";
    if (status === "assigned_to_teacher") return "warning";
    return "default";
  };

  const getStatusIcon = (status) => {
    if (status === "resolved") return "✅";
    if (status === "assigned_to_teacher") return "⏳";
    return "📋";
  };
  const handleLogout = () => {
  const confirmLogout = window.confirm(
    "Are you sure you want to logout?"
  );

  if (confirmLogout) {
    localStorage.clear();
    navigate("/login");
  }
};

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', mb: 1 }}>👨‍🏫</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
            Assigned Doubts
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: '1rem', mb: 3 }}>
            Review and respond to student questions
          </Typography>

          {/* Filter Buttons */}
          <ButtonGroup variant="outlined" sx={{ mb: 3 }}>
            <Button
              onClick={() => setFilter("pending")}
              variant={filter === "pending" ? "contained" : "outlined"}
              sx={{
                color: filter === "pending" ? 'white' : '#667eea',
                borderColor: '#667eea',
                backgroundColor: filter === "pending" ? '#667eea' : 'transparent',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: filter === "pending" ? '#764ba2' : 'rgba(102, 126, 234, 0.08)'
                }
              }}
            >
              ⏳ Pending
            </Button>
            <Button
              onClick={() => setFilter("answered")}
              variant={filter === "answered" ? "contained" : "outlined"}
              sx={{
                color: filter === "answered" ? 'white' : '#22c55e',
                borderColor: '#22c55e',
                backgroundColor: filter === "answered" ? '#22c55e' : 'transparent',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: filter === "answered" ? '#16a34a' : 'rgba(34, 197, 94, 0.08)'
                }
              }}
            >
              ✅ Answered
            </Button>
            <Button
              onClick={() => setFilter("all")}
              variant={filter === "all" ? "contained" : "outlined"}
              sx={{
                color: filter === "all" ? 'white' : '#667eea',
                borderColor: '#667eea',
                backgroundColor: filter === "all" ? '#667eea' : 'transparent',
                fontWeight: 600,
                '&:hover': {
                  backgroundColor: filter === "all" ? '#764ba2' : 'rgba(102, 126, 234, 0.08)'
                }
              }}
            >
              📋 All
            </Button>
          </ButtonGroup>
        </Box>

        {doubts.length === 0 && (
          <Card sx={{
            textAlign: 'center',
            padding: '48px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
          }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🎉</Typography>
            <Typography sx={{ color: '#718096', fontSize: '1.1rem' }}>
              No doubts assigned to you.
            </Typography>
            <Typography sx={{ color: '#cbd5e0', mt: 1 }}>
              All doubts are either resolved or waiting for assignment.
            </Typography>
          </Card>
        )}

        {doubts.length > 0 && (
          <>
            {/* Filter and show only selected doubts */}
            {((filter === "pending" && doubts.filter(d => d.status === "assigned_to_teacher").length === 0) ||
              (filter === "answered" && doubts.filter(d => d.status === "resolved").length === 0)) && (
              <Alert severity="info" sx={{ mb: 3, borderRadius: '8px' }}>
                No {filter === "pending" ? "pending" : "answered"} doubts at the moment.
              </Alert>
            )}

            {(filter === "pending" || filter === "all") && doubts.filter(d => d.status === "assigned_to_teacher").map(doubt => (
          <Card key={doubt._id} sx={{ 
            mb: 3,
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
            transition: 'all 0.3s ease',
            backgroundColor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.05)',
            '&:hover': {
              boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-4px)'
            }
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography sx={{ 
                    color: '#718096', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1
                  }}>
                    📖 Course: {doubt.courseCode}
                  </Typography>
                  <Typography sx={{ 
                    color: '#1a202c', 
                    fontSize: '1.1rem', 
                    fontWeight: 600,
                    mb: 2
                  }}>
                    {doubt.question}
                  </Typography>
                </Box>
                <Chip
                  icon={<span>{getStatusIcon(doubt.status)}</span>}
                  label={doubt.status === "resolved" ? "ANSWERED" : "PENDING"}
                  color={getStatusColor(doubt.status)}
                  sx={{ 
                    fontWeight: 600,
                    height: '32px',
                    borderRadius: '8px'
                  }}
                />
              </Box>

              {doubt.status !== "resolved" && (
                <Box sx={{ 
                  backgroundColor: '#f7fafc', 
                  padding: '16px',
                  borderRadius: '8px',
                  mb: 2,
                  borderLeft: '4px solid #667eea'
                }}>
                  <Typography sx={{ 
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    color: '#667eea',
                    mb: 2,
                    textTransform: 'uppercase'
                  }}>
                    Your Response
                  </Typography>
                  <TextField
                    label="Enter your answer"
                    fullWidth
                    multiline
                    rows={4}
                    value={answers[doubt._id] || ""}
                    onChange={(e) =>
                      setAnswers({
                        ...answers,
                        [doubt._id]: e.target.value
                      })
                    }
                    placeholder="Provide a detailed response to help the student..."
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
              )}

              {doubt.status === "resolved" && (
                <Alert severity="success" sx={{ 
                  mb: 2, 
                  borderRadius: '8px',
                  fontWeight: 500
                }}>
                  ✅ You have answered this doubt. Student can continue discussion below.
                </Alert>
              )}

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {doubt.status !== "resolved" && (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => resolveDoubt(doubt._id)}
                    disabled={submitting[doubt._id] || !answers[doubt._id]}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      padding: '10px 32px',
                      fontSize: '1rem',
                      fontWeight: 600,
                      '&:hover': {
                        background: 'linear-gradient(135deg, #5568d3 0%, #673a91 100%)',
                        transform: 'translateY(-2px)'
                      },
                      '&:disabled': {
                        opacity: 0.6,
                        cursor: 'not-allowed'
                      }
                    }}
                  >
                    {submitting[doubt._id] ? '⏳ Submitting...' : '✓ Submit Answer'}
                  </Button>
                )}

                <Button
                  variant="outlined"
                  size="large"
                  onClick={() => navigate(`/discussion/${doubt._id}`)}
                  sx={{
                    borderColor: '#667eea',
                    color: '#667eea',
                    padding: '10px 32px',
                    fontSize: '1rem',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#764ba2',
                      color: '#764ba2',
                      backgroundColor: 'rgba(102, 126, 234, 0.08)',
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  💬 View Discussion
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))}

            {(filter === "answered" || filter === "all") && doubts.filter(d => d.status === "resolved").map(doubt => (
              <Card key={doubt._id} sx={{ 
                mb: 3,
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                transition: 'all 0.3s ease',
                backgroundColor: 'white',
                border: '1px solid rgba(34, 197, 94, 0.2)',
                '&:hover': {
                  boxShadow: '0 12px 24px rgba(0, 0, 0, 0.12)',
                  transform: 'translateY(-4px)'
                }
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ 
                        color: '#718096', 
                        fontSize: '0.85rem', 
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        mb: 1
                      }}>
                        📖 Course: {doubt.courseCode}
                      </Typography>
                      <Typography sx={{ 
                        color: '#1a202c', 
                        fontSize: '1.1rem', 
                        fontWeight: 600,
                        mb: 2
                      }}>
                        {doubt.question}
                      </Typography>
                    </Box>
                    <Chip
                      icon={<span>✅</span>}
                      label="ANSWERED"
                      color="success"
                      sx={{ 
                        fontWeight: 600,
                        height: '32px',
                        borderRadius: '8px'
                      }}
                    />
                  </Box>

                  <Alert severity="success" sx={{ 
                    mb: 2, 
                    borderRadius: '8px',
                    fontWeight: 500
                  }}>
                    ✅ You have answered this doubt. Student may continue discussion below.
                  </Alert>

                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate(`/discussion/${doubt._id}`)}
                      sx={{
                        borderColor: '#22c55e',
                        color: '#22c55e',
                        padding: '10px 32px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        '&:hover': {
                          borderColor: '#16a34a',
                          color: '#16a34a',
                          backgroundColor: 'rgba(34, 197, 94, 0.08)',
                          transform: 'translateY(-2px)'
                        }
                      }}
                    >
                      💬 Continue Discussion
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </Box>
    </div>
  );
}

export default TeacherDashboard;
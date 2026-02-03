import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Chip,
  Box,
  Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function MyDoubts() {
  const [doubts, setDoubts] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, answered, closed
  const studentId = localStorage.getItem("userId");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/doubts/student/${studentId}`)
      .then(res => setDoubts(res.data))
      .catch(err => console.error(err));
  }, [studentId]);

  const getStatusColor = (status) => {
    if (status === "ai_solved") return "success";
    if (status === "assigned_to_teacher") return "warning";
    if (status === "resolved") return "primary";
    return "default";
  };

  const getStatusIcon = (status) => {
    if (status === "ai_solved") return "✅";
    if (status === "assigned_to_teacher") return "⏳";
    if (status === "resolved") return "🎯";
    return "📋";
  };

  // Categorize doubts by status
  const pendingDoubts = doubts.filter(d => d.status === "assigned_to_teacher");
  const answeredDoubts = doubts.filter(d => d.status === "ai_solved" || d.status === "resolved");
  const closedDiscussionDoubts = answeredDoubts.filter(d => d.discussionEnded);
  const openAnsweredDoubts = answeredDoubts.filter(d => !d.discussionEnded);

  const renderDoubtCard = (doubt) => (
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
            label={doubt.status.replaceAll("_", " ").toUpperCase()}
            color={getStatusColor(doubt.status)}
            sx={{ 
              fontWeight: 600,
              height: '32px',
              borderRadius: '8px'
            }}
          />
        </Box>

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
            mb: 1,
            textTransform: 'uppercase'
          }}>
            Answer
          </Typography>
          <Typography sx={{ color: '#2c3e50', lineHeight: 1.6 }}>
            {doubt.status === "ai_solved" && doubt.aiAnswer}
            {doubt.status === "assigned_to_teacher" && (
              <span style={{ color: '#718096', fontStyle: 'italic' }}>Waiting for teacher's response...</span>
            )}
            {doubt.status === "resolved" && doubt.aiAnswer}
          </Typography>
        </Box>

        {(doubt.status === "ai_solved" || doubt.status === "resolved") && (
          <Button
            variant="outlined"
            size="small"
            onClick={() => navigate(`/discussion/${doubt._id}`)}
            disabled={doubt.discussionEnded}
            sx={{
              borderColor: doubt.discussionEnded ? '#cbd5e0' : '#667eea',
              color: doubt.discussionEnded ? '#cbd5e0' : '#667eea',
              fontWeight: 600,
              textTransform: 'none',
              '&:hover': {
                borderColor: doubt.discussionEnded ? '#cbd5e0' : '#764ba2',
                color: doubt.discussionEnded ? '#cbd5e0' : '#764ba2',
                backgroundColor: doubt.discussionEnded ? 'transparent' : 'rgba(102, 126, 234, 0.08)'
              }
            }}
          >
            {doubt.discussionEnded ? '🔒 Discussion Closed' : '💬 Continue Discussion'}
          </Button>
        )}
      </CardContent>
    </Card>
  );

  const renderSection = (title, icon, doubts, color, emptyMessage) => (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 3,
        pb: 2,
        borderBottom: `3px solid ${color}`
      }}>
        <Typography sx={{ fontSize: '2rem', mr: 2 }}>{icon}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c' }}>
          {title}
        </Typography>
        <Chip 
          label={doubts.length} 
          sx={{ 
            ml: 2, 
            backgroundColor: color, 
            color: 'white',
            fontWeight: 700
          }} 
        />
      </Box>

      {doubts.length === 0 ? (
        <Card sx={{
          textAlign: 'center',
          padding: '32px 24px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          backgroundColor: 'white',
          border: '1px dashed #cbd5e0'
        }}>
          <Typography sx={{ color: '#cbd5e0', fontSize: '1rem' }}>
            {emptyMessage}
          </Typography>
        </Card>
      ) : (
        doubts.map(doubt => renderDoubtCard(doubt))
      )}
    </Box>
  );

  // Get doubts to display based on filter
  const getFilteredDoubts = () => {
    switch(filter) {
      case "pending":
        return pendingDoubts;
      case "answered":
        return openAnsweredDoubts;
      case "closed":
        return closedDiscussionDoubts;
      default:
        return doubts;
    }
  };

  const filteredDoubts = getFilteredDoubts();

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <Box sx={{ maxWidth: '900px', margin: '0 auto' }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography sx={{ fontSize: '3rem', mb: 1 }}>📚</Typography>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#1a202c', mb: 1 }}>
            My Doubts
          </Typography>
          <Typography sx={{ color: '#718096', fontSize: '1rem' }}>
            Track and manage all your questions in one place
          </Typography>
        </Box>

        {doubts.length === 0 && (
          <Card sx={{
            textAlign: 'center',
            padding: '48px 24px',
            borderRadius: '12px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
            backgroundColor: 'white'
          }}>
            <Typography sx={{ fontSize: '3rem', mb: 2 }}>🤔</Typography>
            <Typography sx={{ color: '#718096', fontSize: '1.1rem' }}>
              No doubts submitted yet.
            </Typography>
            <Typography sx={{ color: '#cbd5e0', mt: 1, mb: 3 }}>
              Start by asking your first doubt to get help from our AI or teachers.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/ask-doubt")}
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '10px 32px',
                fontSize: '1rem',
                fontWeight: 600,
                '&:hover': {
                  background: 'linear-gradient(135deg, #5568d3 0%, #673a91 100%)',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              Ask Your First Doubt
            </Button>
          </Card>
        )}

        {doubts.length > 0 && (
          <>
            {/* Filter Buttons */}
            <Box sx={{
              display: 'flex',
              gap: 2,
              mb: 4,
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <Button
                onClick={() => setFilter("all")}
                variant={filter === "all" ? "contained" : "outlined"}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  background: filter === "all" ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                  borderColor: '#667eea',
                  color: filter === "all" ? 'white' : '#667eea',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: filter === "all" ? '#667eea' : '#764ba2',
                    backgroundColor: filter === "all" ? 'linear-gradient(135deg, #5568d3 0%, #673a91 100%)' : 'rgba(102, 126, 234, 0.08)'
                  }
                }}
              >
                📋 All ({doubts.length})
              </Button>

              <Button
                onClick={() => setFilter("pending")}
                variant={filter === "pending" ? "contained" : "outlined"}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  background: filter === "pending" ? '#f59e0b' : 'transparent',
                  borderColor: '#f59e0b',
                  color: filter === "pending" ? 'white' : '#f59e0b',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: filter === "pending" ? '#f59e0b' : '#d97706',
                    backgroundColor: filter === "pending" ? '#d97706' : 'rgba(245, 158, 11, 0.08)'
                  }
                }}
              >
                ⏳ Pending ({pendingDoubts.length})
              </Button>

              <Button
                onClick={() => setFilter("answered")}
                variant={filter === "answered" ? "contained" : "outlined"}
                sx={{
                  borderRadius: '8px',
                  textTransform: 'none',
                  fontSize: '1rem',
                  fontWeight: 600,
                  px: 3,
                  py: 1.5,
                  background: filter === "answered" ? '#22c55e' : 'transparent',
                  borderColor: '#22c55e',
                  color: filter === "answered" ? 'white' : '#22c55e',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    borderColor: filter === "answered" ? '#22c55e' : '#16a34a',
                    backgroundColor: filter === "answered" ? '#16a34a' : 'rgba(34, 197, 94, 0.08)'
                  }
                }}
              >
                ✅ Answered ({openAnsweredDoubts.length})
              </Button>

              {closedDiscussionDoubts.length > 0 && (
                <Button
                  onClick={() => setFilter("closed")}
                  variant={filter === "closed" ? "contained" : "outlined"}
                  sx={{
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontSize: '1rem',
                    fontWeight: 600,
                    px: 3,
                    py: 1.5,
                    background: filter === "closed" ? '#ef4444' : 'transparent',
                    borderColor: '#ef4444',
                    color: filter === "closed" ? 'white' : '#ef4444',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      borderColor: filter === "closed" ? '#ef4444' : '#dc2626',
                      backgroundColor: filter === "closed" ? '#dc2626' : 'rgba(239, 68, 68, 0.08)'
                    }
                  }}
                >
                  🔒 Closed ({closedDiscussionDoubts.length})
                </Button>
              )}
            </Box>

            {/* Filtered Doubts Display */}
            {filteredDoubts.length === 0 ? (
              <Card sx={{
                textAlign: 'center',
                padding: '48px 24px',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
                backgroundColor: 'white',
                border: '1px dashed #cbd5e0'
              }}>
                <Typography sx={{ color: '#cbd5e0', fontSize: '1.1rem' }}>
                  {filter === "pending" && "No pending doubts. Great!"}
                  {filter === "answered" && "No answered doubts with open discussions."}
                  {filter === "closed" && "No closed discussions."}
                  {filter === "all" && "No doubts to display."}
                </Typography>
              </Card>
            ) : (
              filteredDoubts.map(doubt => renderDoubtCard(doubt))
            )}
          </>
        )}
      </Box>
    </div>
  );
}

export default MyDoubts;

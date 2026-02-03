import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Divider,
  CircularProgress,
  Alert
} from "@mui/material";

function DoubtDiscussion() {
  const { doubtId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [doubt, setDoubt] = useState(null);
  const [endingDiscussion, setEndingDiscussion] = useState(false);

  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/api/conversations/${doubtId}/${userId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoubt = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/doubts/${doubtId}`
      );
      setDoubt(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDoubt();
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [doubtId, userId]);

  const sendMessage = async () => {
    if (!text.trim()) return;

    setSending(true);
    try {
      await axios.post("http://localhost:5000/api/conversations", {
        doubtId,
        senderId: userId,
        senderRole: role,
        message: text
      });

      setText("");
      await fetchMessages();
    } catch (err) {
      alert("Failed to send message. Please try again.");
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const endDiscussion = async () => {
    if (!window.confirm("Are you sure you want to end this discussion? The student will be notified.")) {
      return;
    }

    setEndingDiscussion(true);
    try {
      await axios.post(
        `http://localhost:5000/api/doubts/${doubtId}/end-discussion`
      );

      await fetchDoubt();
      await fetchMessages();
    } catch (err) {
      console.error("Full error object:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to end discussion. Please try again.";
      alert(errorMessage);
    } finally {
      setEndingDiscussion(false);
    }
  };

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh',
      padding: '40px 20px'
    }}>
      <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card sx={{
          borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
          background: 'white'
        }}>
          <CardContent sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, pb: 2, borderBottom: '1px solid #e2e8f0' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Typography sx={{ fontSize: '2rem' }}>💬</Typography>
                <Typography variant="h5" sx={{ fontWeight: 700, color: '#1a202c' }}>
                  Discussion Thread
                </Typography>
              </Box>
              
              {doubt && (
                <Box sx={{ backgroundColor: '#f7fafc', padding: '16px', borderRadius: '8px' }}>
                  <Typography sx={{ 
                    color: '#718096', 
                    fontSize: '0.85rem', 
                    fontWeight: 600,
                    mb: 1
                  }}>
                    📚 {doubt.courseCode}
                  </Typography>
                  <Typography sx={{ color: '#2c3e50', fontWeight: 500 }}>
                    {doubt.question}
                  </Typography>
                </Box>
              )}
            </Box>

            {/* Messages */}
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                <CircularProgress />
              </Box>
            ) : (
              <Box sx={{
                maxHeight: '500px',
                overflowY: 'auto',
                mb: 3,
                p: 2,
                backgroundColor: '#fafbfc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                {messages.length === 0 ? (
                  <Alert severity="info" sx={{ borderRadius: '8px' }}>
                    No messages yet. Start the discussion by sending a message!
                  </Alert>
                ) : (
                  <>
                    {messages.map((msg, idx) => {
                      const isCurrentUser = msg.senderId === userId;
                      const isSender = msg.senderRole;
                      
                      return (
                        <Box
                          key={idx}
                          sx={{
                            display: 'flex',
                            justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                            mb: 2,
                            alignItems: 'flex-end'
                          }}
                        >
                          <Paper
                            sx={{
                              maxWidth: '70%',
                              p: 2,
                              backgroundColor: isCurrentUser 
                                ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                                : '#ffffff',
                              color: isCurrentUser ? 'white' : '#1a202c',
                              borderRadius: isCurrentUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                            }}
                            elevation={0}
                          >
                            <Typography sx={{
                              fontSize: '0.85rem',
                              fontWeight: 600,
                              textTransform: 'uppercase',
                              opacity: 0.8,
                              mb: 1,
                              letterSpacing: '0.5px'
                            }}>
                              {isSender === 'student' ? '👤 Student' : '👨‍🏫 Teacher'}
                            </Typography>
                            <Typography sx={{ wordBreak: 'break-word', mb: 1 }}>
                              {msg.message}
                            </Typography>
                            <Typography sx={{
                              fontSize: '0.75rem',
                              opacity: 0.7,
                              mt: 1
                            }}>
                              {new Date(msg.createdAt).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Paper>
                        </Box>
                      );
                    })}
                    {doubt && doubt.discussionEnded && (
                      <Box sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        my: 3
                      }}>
                        <Alert 
                          severity="warning" 
                          sx={{ 
                            borderRadius: '8px',
                            maxWidth: '80%',
                            textAlign: 'center',
                            fontWeight: 600
                          }}
                        >
                          🔒 The teacher has ended this discussion. No further messages can be sent.
                        </Alert>
                      </Box>
                    )}
                  </>
                )}
              </Box>
            )}

            <Divider sx={{ my: 3 }} />

            {/* Input */}
            <Box>
              {doubt && doubt.discussionEnded ? (
                <Alert 
                  severity="warning" 
                  sx={{ 
                    borderRadius: '8px',
                    mb: 2
                  }}
                >
                  💬 This discussion has been ended by the teacher. You cannot send messages.
                </Alert>
              ) : (
                <>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    placeholder="Type your message here... (Shift+Enter for new line)"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={sending}
                    variant="outlined"
                    sx={{
                      mb: 2,
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

                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={sendMessage}
                      disabled={sending || !text.trim()}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '10px 32px',
                        fontSize: '1rem',
                        fontWeight: 600,
                        textTransform: 'none',
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
                      {sending ? '⏳ Sending...' : '📤 Send Message'}
                    </Button>

                    {role === 'teacher' && (
                      <Button
                        variant="outlined"
                        size="large"
                        onClick={endDiscussion}
                        disabled={endingDiscussion}
                        sx={{
                          borderColor: '#ef4444',
                          color: '#ef4444',
                          padding: '10px 24px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: '#fef2f2',
                            borderColor: '#dc2626'
                          },
                          '&:disabled': {
                            opacity: 0.6,
                            cursor: 'not-allowed'
                          }
                        }}
                      >
                        {endingDiscussion ? '⏳ Ending...' : '🔒 End Discussion'}
                      </Button>
                    )}
                  </Box>

                  <Typography sx={{
                    fontSize: '0.85rem',
                    color: '#718096',
                    mt: 2,
                    fontStyle: 'italic'
                  }}>
                    💡 Tip: Press Shift+Enter to create a new line
                  </Typography>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
}

export default DoubtDiscussion;

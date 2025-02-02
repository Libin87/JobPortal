import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import NavbarEmployee from './NavbarEmployee';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const QuestionPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  marginBottom: theme.spacing(3),
  borderRadius: '15px',
  background: 'linear-gradient(to right bottom, #ffffff, #f8f9fa)',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
}));

const TimerPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  color: 'white',
  borderRadius: '10px',
  marginBottom: theme.spacing(3),
}));

const Selection1 = () => {
  const [availableTests, setAvailableTests] = useState([]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [score, setScore] = useState(0);
  const [showTestList, setShowTestList] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailableTests = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        // Fetch tests for jobs the user has applied to
        const response = await axios.get(`http://localhost:3000/test/available/${userId}`);
        setAvailableTests(response.data);
      } catch (error) {
        toast.error('Error loading available tests');
        console.error('Error fetching tests:', error);
      }
    };
    fetchAvailableTests();
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !submitted && selectedTest) {
      handleSubmit();
    }
  }, [timeLeft, submitted]);

  const handleTestSelect = async (testId) => {
    try {
      const response = await axios.get(`http://localhost:3000/test/${testId}`);
      setSelectedTest(response.data);
      setTimeLeft(response.data.duration * 60);
      setShowTestList(false);
    } catch (error) {
      toast.error('Error loading test');
      console.error('Error loading test:', error);
    }
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    });
  };

  const handleSubmit = async () => {
    try {
      if (!selectedTest) return;

      const unansweredQuestions = selectedTest.questions.filter(q => !answers[q._id]);
      if (unansweredQuestions.length > 0) {
        toast.warning(`You have ${unansweredQuestions.length} unanswered questions`);
        return;
      }

      const response = await axios.post('http://localhost:3000/test/submit', {
        testId: selectedTest._id,
        userId: sessionStorage.getItem('userId'),
        answers,
      });

      if (response.data) {
        setScore(response.data.score);
        setSubmitted(true);
        setOpenDialog(true);
        toast.success('Test submitted successfully!');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error submitting test');
      console.error('Error submitting test:', error);
    }
  };

  if (showTestList) {
    return (
      <>
        <NavbarEmployee />
        <Container maxWidth="lg" sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom align="center" sx={{ color: '#1a237e', fontWeight: 'bold' }}>
            Available Tests
          </Typography>
          {availableTests.length === 0 ? (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No tests available. Please apply for jobs first.
              </Typography>
            </Paper>
          ) : (
            <List>
              {availableTests.map((test) => (
                <motion.div
                  key={test._id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <ListItem
                    component={Paper}
                    sx={{ mb: 2, p: 3, borderRadius: 2 }}
                  >
                    <ListItemText
                      primary={
                        <Typography variant="h6" color="primary">
                          {test.testName}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography component="span" display="block">
                            Duration: {test.duration} minutes
                          </Typography>
                          <Typography component="span" display="block">
                            Total Marks: {test.totalMarks}
                          </Typography>
                          <Typography component="span" display="block">
                            Passing Marks: {test.passingMarks}
                          </Typography>
                        </>
                      }
                    />
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleTestSelect(test._id)}
                    >
                      Start Test
                    </Button>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          )}
        </Container>
      </>
    );
  }

  if (!selectedTest) return <div>Loading...</div>;

  return (
    <>
      <NavbarEmployee />
      <ToastContainer position="top-right" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <TimerPaper>
            <Typography variant="h4" gutterBottom align="center">
              {selectedTest.testName}
            </Typography>
            <Typography variant="h5" align="center">
              Time Remaining: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(1 - timeLeft / (selectedTest.duration * 60)) * 100} 
              sx={{ mt: 2, height: 10, borderRadius: 5 }}
            />
          </TimerPaper>

          {selectedTest.questions.map((question, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <QuestionPaper>
                <Typography variant="h6">
                  {index + 1}. {question.question}
                </Typography>
                <RadioGroup
                  value={answers[question._id] || ''}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                >
                  {question.options.map((option, optionIndex) => (
                    <FormControlLabel
                      key={optionIndex}
                      value={String(optionIndex + 1)}
                      control={<Radio />}
                      label={option}
                      disabled={submitted}
                    />
                  ))}
                </RadioGroup>
              </QuestionPaper>
            </motion.div>
          ))}

          {!submitted && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button 
                variant="contained" 
                onClick={handleSubmit}
                sx={{
                  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  padding: '15px 30px',
                  fontSize: '1.1rem'
                }}
              >
                Submit Test
              </Button>
            </Box>
          )}
        </motion.div>

        <Dialog open={openDialog} onClose={() => navigate('/dashboard')}>
          <DialogTitle>Test Completed</DialogTitle>
          <DialogContent>
            <Typography>
              Your score: {score}/{selectedTest.totalMarks}
            </Typography>
            <Typography>
              {score >= selectedTest.passingMarks ? 'Congratulations! You passed!' : 'Sorry, you did not pass.'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => navigate('/dashboard')}>Return to Dashboard</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
};

export default Selection1;

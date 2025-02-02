import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  LinearProgress,
  styled,
} from '@mui/material';
import axios from 'axios';
import { motion } from 'framer-motion';

// Styled components
const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  margin: theme.spacing(2),
  borderRadius: 15,
  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
  background: 'rgba(255,255,255,0.9)',
}));

const TimerBox = styled(Box)(({ theme }) => ({
  position: 'fixed',
  top: 20,
  right: 20,
  padding: theme.spacing(2),
  borderRadius: 10,
  background: theme.palette.primary.main,
  color: 'white',
  zIndex: 1000,
}));

const TakeTest = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/test/get-test/${testId}`);
        setTest(response.data);
        setTimeLeft(response.data.duration * 60);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching test:', error);
      }
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && test) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleAnswerChange = (questionId, answer) => {
    console.log('Saving answer:', {
      questionId,
      answer
    });
    setAnswers((prev) => {
      const newAnswers = {
        ...prev,
        [questionId]: answer
      };
      console.log('Updated answers state:', newAnswers);
      return newAnswers;
    });
  };

  const calculateResults = () => {
    if (!test || !test.questions) {
      console.error('Test or questions not found');
      return {
        score: 0,
        totalMarks: 0,
        result: 'Fail',
        timeTaken: 0,
        totalQuestions: 0,
        correctAnswers: 0,
        passingMarks: 0
      };
    }

    let score = 0;
    let correctAnswers = 0;
    let totalMarks = 0;

    console.log('All answers before calculation:', answers);
    console.log('All questions:', test.questions);

    // Calculate total marks and score
    test.questions.forEach((question, index) => {
      const questionMarks = parseInt(question.marks) || 0;
      totalMarks += questionMarks;

      const userAnswer = answers[question._id];
      console.log(`Question ${index + 1} - User Answer:`, userAnswer);
      console.log(`Question ${index + 1} - Correct Answer:`, question.correctAnswer);

      // Convert both answers to strings and compare
      if (userAnswer && question.correctAnswer && 
          userAnswer.toString() === question.correctAnswer.toString()) {
        score += questionMarks;
        correctAnswers++;
        console.log(`Correct answer! Adding ${questionMarks} marks. Current score: ${score}`);
      }
    });

    const result = score >= test.passingMarks ? 'Pass' : 'Fail';
    const timeTaken = test.duration * 60 - timeLeft;

    const results = {
      score,
      totalMarks,
      result,
      timeTaken,
      totalQuestions: test.questions.length,
      correctAnswers,
      passingMarks: test.passingMarks
    };

    console.log('Final Results:', results);
    return results;
  };

  const handleSubmit = async () => {
    try {
      const results = calculateResults();
      console.log('results',results)
      const employeeId = sessionStorage.getItem('userId');

      // Save test result
      await axios.post('http://localhost:3000/test/save-result', {
        testId: test._id,
        employeeId,
        jobId: test.jobId,
        score: results.score,
        totalMarks: results.totalMarks,
        result: results.result,
        answers,
        timeTaken: results.timeTaken
      });

      // Navigate to result page
      navigate('/test-complete', { state: results });

    } catch (error) {
      console.error('Error submitting test:', error);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h6">Loading test...</Typography>
      </Container>
    );
  }

  if (!test || !test.questions || test.questions.length === 0) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Typography variant="h6">Test not found or no questions available.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <TimerBox>
        Time Remaining: {formatTime(timeLeft)}
      </TimerBox>

      <Typography variant="h4" gutterBottom align="center">
        {test.testName}
      </Typography>

      <LinearProgress
        variant="determinate"
        value={(currentQuestion + 1) * 100 / test.questions.length}
        sx={{ mb: 3 }}
      />

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper>
          <Typography variant="h6" gutterBottom>
            Question {currentQuestion + 1} of {test.questions.length}
          </Typography>
          <Typography variant="body1" paragraph>
            {test.questions[currentQuestion].question}
          </Typography>

          <RadioGroup
            value={answers[test.questions[currentQuestion]._id] || ''}
            onChange={(e) => handleAnswerChange(test.questions[currentQuestion]._id, e.target.value)}
          >
            {test.questions[currentQuestion].options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={(index + 1).toString()}
                control={<Radio />}
                label={option}
                sx={{ mb: 1 }}
              />
            ))}
          </RadioGroup>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
            <Button
              variant="contained"
              disabled={currentQuestion === 0}
              onClick={() => setCurrentQuestion((prev) => prev - 1)}
            >
              Previous
            </Button>
            {currentQuestion === test.questions.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Submit Test
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={() => setCurrentQuestion((prev) => prev + 1)}
              >
                Next
              </Button>
            )}
          </Box>
        </StyledPaper>
      </motion.div>
    </Container>
  );
};

export default TakeTest;

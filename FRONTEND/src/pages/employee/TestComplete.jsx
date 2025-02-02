import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  CircularProgress,
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuizIcon from '@mui/icons-material/Quiz';
import { motion } from 'framer-motion';

const ResultCard = ({ title, value, icon, color }) => (
  <Paper
    elevation={3}
    sx={{
      p: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      bgcolor: `${color}.light`,
      color: `${color}.darker`,
    }}
  >
    {icon}
    <Typography variant="h6" sx={{ mt: 1 }}>
      {title}
    </Typography>
    <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
      {value}
    </Typography>
  </Paper>
);

const TestComplete = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    score = 0,
    totalMarks = 0,
    result = 'Fail',
    timeTaken = 0,
    totalQuestions = 0,
    correctAnswers = 0,
    passingMarks = 0
  } = location.state || {};

  const percentage = ((score / totalMarks) * 100).toFixed(1);
  const formattedTime = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            {result === 'Pass' ? (
              <CheckCircleIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
            ) : (
              <CancelIcon sx={{ fontSize: 80, color: 'error.main', mb: 2 }} />
            )}
            <Typography variant="h4" gutterBottom>
              Test Completed!
            </Typography>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <ResultCard
                title="Score"
                value={`${score}/${totalMarks}`}
                icon={
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={percentage}
                      size={60}
                      color={result === 'Pass' ? 'success' : 'error'}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="caption" component="div">
                        {`${percentage}%`}
                      </Typography>
                    </Box>
                  </Box>
                }
                color={result === 'Pass' ? 'success' : 'error'}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ResultCard
                title="Time Taken"
                value={formattedTime}
                icon={<AccessTimeIcon sx={{ fontSize: 40 }} />}
                color="info"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ResultCard
                title="Questions"
                value={`${correctAnswers}/${totalQuestions}`}
                icon={<QuizIcon sx={{ fontSize: 40 }} />}
                color="primary"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <ResultCard
                title="Passing Score"
                value={passingMarks}
                icon={<CheckCircleIcon sx={{ fontSize: 40 }} />}
                color="warning"
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              p: 2,
              mt: 3,
              borderRadius: 1,
              bgcolor: result === 'Pass' ? 'success.light' : 'error.light',
              color: 'white',
              textAlign: 'center',
            }}
          >
            <Typography variant="h5">
              {result === 'Pass' 
                ? 'Congratulations! You have passed the test!' 
                : 'Unfortunately, you did not meet the passing criteria.'}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/employee')}
              sx={{ px: 4, py: 1.5 }}
            >
              Back to Dashboard
            </Button>
          </Box>
        </Paper>
      </motion.div>
    </Container>
  );
};

export default TestComplete; 
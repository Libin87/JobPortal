import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import NavbarEmployer from './NavbarEmployer';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(3),
  borderRadius: '15px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
  },
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
  margin: theme.spacing(1),
}));

const Selection = () => {
  const [testDetails, setTestDetails] = useState({
    testName: '',
    duration: '',
    totalMarks: '',
    passingMarks: '',
    jobId: '',
  });

  const [questions, setQuestions] = useState([{
    question: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    marks: ''
  }]);

  const [openDialog, setOpenDialog] = useState(false);
  const [availableJobs, setAvailableJobs] = useState([]);

  useEffect(() => {
    // Fetch employer's posted jobs
    const fetchJobs = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/jobs/myjobs/${userId}`);
        setAvailableJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
  }, []);

  const handleTestDetailsChange = (e) => {
    setTestDetails({
      ...testDetails,
      [e.target.name]: e.target.value
    });
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    if (field === 'options') {
      newQuestions[index].options[value.optionIndex] = value.text;
    } else {
      newQuestions[index][field] = value;
    }
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, {
      question: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      marks: ''
    }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!testDetails.testName || !testDetails.duration || !testDetails.totalMarks || !testDetails.passingMarks) {
        toast.error('Please fill in all test details');
        return;
      }

      // Validate questions
      for (const question of questions) {
        if (!question.question || question.options.some(opt => !opt) || !question.correctAnswer || !question.marks) {
          toast.error('Please fill in all question details');
          return;
        }
      }

      const testData = {
        ...testDetails,
        questions,
        employerId: sessionStorage.getItem('userId'),
        ...(testDetails.jobId && { jobId: testDetails.jobId })
      };

      const response = await axios.post('http://localhost:3000/test/create', testData);
      
      if (response.data) {
        toast.success('Test created successfully!');
        setOpenDialog(true);
        // Reset form
        setTestDetails({
          testName: '',
          duration: '',
          totalMarks: '',
          passingMarks: '',
          jobId: '',
        });
        setQuestions([{
          question: '',
          options: ['', '', '', ''],
          correctAnswer: '',
          marks: ''
        }]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error creating test');
      console.error('Error creating test:', error);
    }
  };

  return (
    <>
      <NavbarEmployer />
      <ToastContainer position="top-right" />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{
              fontWeight: 'bold',
              color: '#1a237e',
              textAlign: 'center',
              mb: 4
            }}
          >
            Create Selection Test
          </Typography>

          <StyledPaper>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Test Name"
                  name="testName"
                  value={testDetails.testName}
                  onChange={handleTestDetailsChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Duration (minutes)"
                  name="duration"
                  type="number"
                  value={testDetails.duration}
                  onChange={handleTestDetailsChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Total Marks"
                  name="totalMarks"
                  type="number"
                  value={testDetails.totalMarks}
                  onChange={handleTestDetailsChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Passing Marks"
                  name="passingMarks"
                  type="number"
                  value={testDetails.passingMarks}
                  onChange={handleTestDetailsChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Associated Job (Optional)"
                  name="jobId"
                  value={testDetails.jobId}
                  onChange={handleTestDetailsChange}
                  SelectProps={{
                    native: true,
                  }}
                >
                  <option value="">None</option>
                  {availableJobs.map((job) => (
                    <option key={job._id} value={job._id}>
                      {job.title}
                    </option>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </StyledPaper>

          {questions.map((question, index) => (
            <StyledPaper key={index}>
              <Grid container spacing={3}>
                <Grid item xs={11}>
                  <TextField
                    fullWidth
                    label={`Question ${index + 1}`}
                    value={question.question}
                    onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
                  />
                </Grid>
                <Grid item xs={1}>
                  <IconButton onClick={() => removeQuestion(index)}>
                    <DeleteIcon />
                  </IconButton>
                </Grid>
                {question.options.map((option, optionIndex) => (
                  <Grid item xs={12} sm={6} key={optionIndex}>
                    <TextField
                      fullWidth
                      label={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleQuestionChange(index, 'options', {
                        optionIndex,
                        text: e.target.value
                      })}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Correct Answer (Option number)"
                    type="number"
                    value={question.correctAnswer}
                    onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
                    inputProps={{ min: 1, max: 4 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Marks for this question"
                    type="number"
                    value={question.marks}
                    onChange={(e) => handleQuestionChange(index, 'marks', e.target.value)}
                  />
                </Grid>
              </Grid>
            </StyledPaper>
          ))}

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <GradientButton onClick={addQuestion}>
              Add Question
            </GradientButton>
            <GradientButton onClick={handleSubmit}>
              Create Test
            </GradientButton>
          </Box>

          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <DialogTitle>Success</DialogTitle>
            <DialogContent>
              Test has been created successfully!
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenDialog(false)}>OK</Button>
            </DialogActions>
          </Dialog>
        </motion.div>
      </Container>
    </>
  );
};

export default Selection;

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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NavbarEmployer from './NavbarEmployer';
import axios from 'axios';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MenuItem } from "@mui/material";
import moment from 'moment';

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
    numberOfQuestions: '',
    difficultyLevel: ''
  });

  const [questions, setQuestions] = useState([]);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [errors, setErrors] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const difficultyLevels = ['Easy', 'Intermediate', 'Advanced', 'Expert'];
  const [jobsWithTests, setJobsWithTests] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [employerTests, setEmployerTests] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [editTestId, setEditTestId] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        console.log('UserId:', userId); // Debugging
        const response = await axios.get(`http://localhost:3000/jobs/myjobs1?userId=${userId}`);
        console.log('Fetched Jobs:', response.data); // Debugging

        setAvailableJobs(response.data);
        console.log('Available Jobs:', availableJobs);

      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    fetchJobs();
    const fetchJobsAndTests = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const jobsResponse = await axios.get(`http://localhost:3000/jobs/myjobs1?userId=${userId}`);
        const jobs = jobsResponse.data;

        // Fetch existing tests for these jobs
        const testsPromises = jobs.map(job => 
          axios.get(`http://localhost:3000/test/check-test/${job._id}`)
            .catch(err => ({ data: null }))
        );
        
        const testsResponses = await Promise.all(testsPromises);
        const jobsWithExistingTests = jobs.map((job, index) => ({
          ...job,
          hasTest: !!testsResponses[index].data
        }));

        setAvailableJobs(jobsWithExistingTests);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Error fetching jobs');
      }
    };
    fetchJobsAndTests();

    // Add this to fetch employer's tests
    const fetchEmployerTests = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/test/employer-tests/${userId}`);
        setEmployerTests(response.data);
      } catch (error) {
        console.error('Error fetching employer tests:', error);
        toast.error('Error fetching your tests');
      }
    };

    fetchEmployerTests();
  }, []);

  const handleTestDetailsChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'jobId') {
      const selectedJob = availableJobs.find(job => job._id === value);
      if (selectedJob?.hasTest) {
        toast.error('This job already has an associated test. Each job can have only one test.');
        return;
      }
    }

    setTestDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const validateTestName = (value) => {
    if (!value) return 'Test name is required';
  
    if (!/^[a-zA-Z\s]{1,100}[0-9]{0,2}$/.test(value)) {
      return 'Enter a valid TestName';
    } else if (/(.)\1{3,}/.test(value)) {
      return 'Enter a valid TestName';
    }
  
    if (value.length > 25) {
      return 'Test name cannot exceed 25 characters';
    }
  
    return '';
  };
  

  const validateDuration = (value) => {
    const duration = Number(value);
    if (duration < 10 || duration > 180) {
      return 'Duration must be between 10 and 180 minutes';
    }
    return '';
  };

  const validateTotalMarks = (value) => {
    const marks = Number(value);
    if (marks < 10 || marks > 180) {
      return 'Total marks must be between 10 and 180';
    }
    return '';
  };

  const validatePassingMarks = (value, totalMarks) => {
    if (!value) return 'Passing marks is required';
    const passingMarks = Number(value);
    const minimumPassingMarks = Math.ceil(Number(totalMarks) * 0.25);
    if (passingMarks < minimumPassingMarks) {
      return `Passing marks should be at least ${minimumPassingMarks} (25% of total marks)`;
    }
    if (passingMarks > totalMarks) {
      return 'Passing marks cannot exceed total marks';
    }
    return '';
  };
  const validateNumberOfQuestions = (value) => {
    if (!value) return 'Number of questions is required';
    if (value < 5) return 'Minimum 5 questions required';
    if (value > 25) return 'Maximum 25 questions allowed';
    return '';
  };
  const validateJobId = (value) => {
    if (!value) return 'Selecting a job is required';
    return '';
  };
  
  const handleTestDetailsBlur = (e) => {
    const { name, value } = e.target;
    let error = '';

    switch (name) {
      case 'testName':
        error = validateTestName(value);
        break;
      case 'duration':
        error = validateDuration(value);
        break;
      case 'totalMarks':
        error = validateTotalMarks(value);
        break;
      case 'passingMarks':
        error = validatePassingMarks(value, testDetails.totalMarks);
        break;
      case 'numberOfQuestions':
        error = validateNumberOfQuestions(value);
        break;
      case 'jobId':
        error = validateJobId(value);
        break;
    }

    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const fetchAndSetQuestions = async () => {
    const { numberOfQuestions, totalMarks, difficultyLevel, jobId } = testDetails;
    
    if (!numberOfQuestions || !totalMarks || !difficultyLevel || !jobId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/questionBank/questions/${difficultyLevel}?count=${numberOfQuestions}&jobId=${jobId}`
      );

      if (response.data.length < numberOfQuestions) {
        toast.error(`Only ${response.data.length} questions available for this difficulty level`);
        return;
      }

      const marksPerQuestion = (Number(totalMarks) / Number(numberOfQuestions)).toFixed(2);

      const formattedQuestions = response.data.map(q => ({
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: marksPerQuestion
      }));

      setQuestions(formattedQuestions);
      toast.success('Questions loaded successfully!');
    } catch (error) {
      console.error('Error fetching questions:', error);
      toast.error('Error loading questions');
    }
  };

  const validateInitialDetails = () => {
    const newErrors = {};
    
    if (!testDetails.testName) newErrors.testName = 'Test name is required';
    if (!testDetails.duration) newErrors.duration = 'Duration is required';
    if (!testDetails.totalMarks) newErrors.totalMarks = 'Total marks is required';
    if (!testDetails.passingMarks) newErrors.passingMarks = 'Passing marks is required';
    if (!testDetails.numberOfQuestions) newErrors.numberOfQuestions = 'Number of questions is required';
    if (!testDetails.difficultyLevel) newErrors.difficultyLevel = 'Difficulty level is required';
    if (!testDetails.jobId) newErrors.jobId = 'Job is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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

      // Convert numeric strings to numbers
      const testData = {
        ...testDetails,
        duration: Number(testDetails.duration),
        totalMarks: Number(testDetails.totalMarks),
        passingMarks: Number(testDetails.passingMarks),
        numberOfQuestions: Number(testDetails.numberOfQuestions),
        questions,
        employerId: sessionStorage.getItem('userId')
      };

      console.log('Sending test data:', testData); // Debug log

      let response;
      if (editMode) {
        response = await axios.put(`http://localhost:3000/test/update-test/${editTestId}`, testData);
        toast.success('Test updated successfully!');
      } else {
        response = await axios.post('http://localhost:3000/test/createTest', testData);
        toast.success('Test created successfully!');
      }

      // Reset form and state
      setTestDetails({
        testName: '',
        duration: '',
        totalMarks: '',
        passingMarks: '',
        jobId: '',
        numberOfQuestions: '',
        difficultyLevel: ''
      });
      setQuestions([]);
      setEditMode(false);
      setEditTestId(null);
      setActiveTab(0); // Switch back to tests list

      // Refresh employer tests
      const userId = sessionStorage.getItem('userId');
      const updatedTests = await axios.get(`http://localhost:3000/test/employer-tests/${userId}`);
      setEmployerTests(updatedTests.data);
    } catch (error) {
      console.error('Error details:', error.response?.data || error); // Enhanced error logging
      toast.error(error.response?.data?.message || 'Error saving test');
    }
  };

  const handleDeleteTest = async (testId) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        await axios.delete(`http://localhost:3000/test/delete-test/${testId}`);
        setEmployerTests(prev => prev.filter(test => test._id !== testId));
        toast.success('Test deleted successfully');
      } catch (error) {
        console.error('Error deleting test:', error);
        toast.error('Error deleting test');
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleEditTest = async (testId) => {
    try {
      const response = await axios.get(`http://localhost:3000/test/get-test/${testId}`);
      const test = response.data;
      
      setTestDetails({
        testName: test.testName,
        duration: test.duration,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        jobId: test.jobId,
        numberOfQuestions: test.numberOfQuestions,
        difficultyLevel: test.difficultyLevel || ''
      });
      
      setQuestions(test.questions || []);
      setEditMode(true);
      setEditTestId(testId);
      setActiveTab(1); // Switch to create/edit tab
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast.error(error.response?.data?.message || 'Error loading test details');
    }
  };

  const submitButtonText = editMode ? 'Update Test' : 'Create Test';

  const handleCancelEdit = () => {
    setTestDetails({
      testName: '',
      duration: '',
      totalMarks: '',
      passingMarks: '',
      jobId: '',
      numberOfQuestions: '',
      difficultyLevel: ''
    });
    setQuestions([]);
    setEditMode(false);
    setEditTestId(null);
    setActiveTab(0);
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
          <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
            Test Management
          </Typography>

          <Tabs value={activeTab} onChange={handleTabChange} centered sx={{ mb: 4 }}>
            <Tab label="My Tests" />
            <Tab label="Create New Test" />
          </Tabs>

          {activeTab === 0 && (
            <StyledPaper>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Test Name</TableCell>
                      <TableCell>Job Title</TableCell>
                      <TableCell>Duration (min)</TableCell>
                      <TableCell>Questions</TableCell>
                      <TableCell>Created On</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {employerTests.map((test) => (
                      <TableRow key={test._id}>
                        <TableCell>{test.testName}</TableCell>
                        <TableCell>{test.jobTitle}</TableCell>
                        <TableCell>{test.duration}</TableCell>
                        <TableCell>{test.numberOfQuestions}</TableCell>
                        <TableCell>
                          {moment(test.createdAt).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEditTest(test._id)}
                            color="primary"
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton 
                            onClick={() => handleDeleteTest(test._id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </StyledPaper>
          )}

          {activeTab === 1 && (
            <div>
              <StyledPaper>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Test Name"
                      name="testName"
                      value={testDetails.testName}
                      onChange={handleTestDetailsChange}
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.testName}
                      helperText={errors.testName}
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
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.duration}
                      helperText={errors.duration}
                      inputProps={{ min: 10, max: 180 }}
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
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.totalMarks}
                      helperText={errors.totalMarks}
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
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.passingMarks}
                      helperText={errors.passingMarks}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Number of Questions"
                      name="numberOfQuestions"
                      type="number"
                      value={testDetails.numberOfQuestions}
                      onChange={handleTestDetailsChange}
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.numberOfQuestions}
                      helperText={errors.numberOfQuestions}
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      select
                      fullWidth
                      label="Difficulty Level"
                      name="difficultyLevel"
                      value={testDetails.difficultyLevel}
                      onChange={handleTestDetailsChange}
                      error={!!errors.difficultyLevel}
                      helperText={errors.difficultyLevel}
                    >
                      {difficultyLevels.map((level) => (
                        <MenuItem key={level} value={level}>
                          {level}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      select
                      fullWidth
                      label="Associated Job"
                      name="jobId"
                      value={testDetails.jobId}
                      onChange={handleTestDetailsChange}
                      error={!!errors.jobId}
                      helperText={errors.jobId}
                      onBlur={handleTestDetailsBlur}
                    >
                      <MenuItem value="">None</MenuItem>
                      {availableJobs.map((job) => (
                        <MenuItem 
                          key={job._id} 
                          value={job._id}
                          disabled={job.hasTest} // Disable jobs that already have tests
                        >
                          {job.jobTitle} {job.hasTest ? '(Test Already Created)' : ''}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={12}>
                    <GradientButton
                      fullWidth
                      onClick={() => {
                        if (validateInitialDetails()) {
                          fetchAndSetQuestions();
                        }
                      }}
                    >
                      Generate Questions
                    </GradientButton>
                  </Grid>
                </Grid>
              </StyledPaper>

              {questions.length > 0 && (
                <>
                  {questions.map((question, index) => (
                    <StyledPaper key={index}>
                      <Grid container spacing={3}>
                        <Grid item xs={12}>
                          <Typography variant="subtitle1">
                            Question {index + 1} (Marks: {question.marks})
                          </Typography>
                          <Typography variant="body1">{question.question}</Typography>
                        </Grid>
                        {question.options.map((option, optIndex) => (
                          <Grid item xs={12} sm={6} key={optIndex}>
                            <Typography>
                              Option {optIndex + 1}: {option}
                            </Typography>
                          </Grid>
                        ))}
                        <Grid item xs={12}>
                          <Typography color="primary">
                            Correct Answer: Option {question.correctAnswer}
                          </Typography>
                        </Grid>
                      </Grid>
                    </StyledPaper>
                  ))}
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4, gap: 2 }}>
                    <GradientButton onClick={handleSubmit}>
                      {submitButtonText}
                    </GradientButton>
                    {editMode && (
                      <Button 
                        variant="outlined" 
                        color="secondary" 
                        onClick={handleCancelEdit}
                      >
                        Cancel Edit
                      </Button>
                    )}
                  </Box>
                </>
              )}
            </div>
          )}
        </motion.div>
      </Container>
    </>
  );
};

export default Selection;
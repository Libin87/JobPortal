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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  Card,
  CardContent,
  Chip,
  CircularProgress,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ProfileWarning from '../../components/ProfileWarning';

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
    difficultyLevel: '',
    lastDate: ''
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
  const [testResults, setTestResults] = useState({});
  const [selectedJobResults, setSelectedJobResults] = useState(null);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    // Add this to fetch test results
    const fetchTestResults = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/test/employer-test-results/${userId}`);
        
        // Group results by jobId
        const groupedResults = response.data.reduce((acc, result) => {
          if (!acc[result.jobId]) {
            acc[result.jobId] = {
              jobTitle: result.jobTitle,
              results: []
            };
          }
          acc[result.jobId].results.push(result);
          return acc;
        }, {});

        // Sort results by score for each job
        Object.keys(groupedResults).forEach(jobId => {
          groupedResults[jobId].results.sort((a, b) => b.score - a.score);
        });

        setTestResults(groupedResults);
      } catch (error) {
        console.error('Error fetching test results:', error);
        toast.error('Error loading test results');
      }
    };

    if (activeTab === 2) { // Load when Test Results tab is active
      fetchTestResults();
    }

    const checkProfile = async () => {
      try {
        const userId = sessionStorage.getItem('userId');
        const response = await axios.get(`http://localhost:3000/profile/${userId}`);
        
        if (response.data) {
          setVerificationStatus(response.data.verificationStatus);
        }
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkProfile();

    const checkExpiredTests = async () => {
      try {
        await axios.put('http://localhost:3000/test/check-expired-tests');
        // Optionally refresh the tests list after checking
        fetchEmployerTests();
      } catch (error) {
        console.error('Error checking expired tests:', error);
      }
    };

    // Check when component mounts
    checkExpiredTests();

    // Set up interval to check periodically (e.g., every hour)
    const interval = setInterval(checkExpiredTests, 3600000);

    return () => clearInterval(interval);
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
  
  const validateLastDate = (value) => {
    if (!value) return 'Last date is required';
    
    const selectedDate = new Date(value);
    const today = new Date();
    const twoMonthsFromNow = new Date();
    twoMonthsFromNow.setMonth(twoMonthsFromNow.getMonth() + 2);
    
    if (selectedDate < today) {
      return 'Last date cannot be in the past';
    }
    
    if (selectedDate > twoMonthsFromNow) {
      return 'Last date cannot be more than 2 months from today';
    }
    
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
      case 'lastDate':
        error = validateLastDate(value);
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
    if (!testDetails.lastDate) newErrors.lastDate = 'Last date is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    try {
      // Validation
      if (!testDetails.testName || !testDetails.duration || !testDetails.totalMarks || 
          !testDetails.passingMarks || !testDetails.lastDate) {
        toast.error('Please fill in all test details');
        return;
      }

      // Validate last date
      const lastDate = new Date(testDetails.lastDate);
      const today = new Date();
      if (lastDate < today) {
        toast.error('Last date cannot be in the past');
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
        employerId: sessionStorage.getItem('userId'),
        lastDate: testDetails.lastDate
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
        difficultyLevel: '',
        lastDate: ''
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
      
      // Add console logs to debug
      console.log('Received test data:', test);
      console.log('Difficulty level from backend:', test.difficultyLevel);
      
      setTestDetails({
        testName: test.testName,
        duration: test.duration,
        totalMarks: test.totalMarks,
        passingMarks: test.passingMarks,
        jobId: test.jobId,
        numberOfQuestions: test.numberOfQuestions,
        difficultyLevel: test.difficultyLevel,
        lastDate: moment(test.lastDate).format('YYYY-MM-DD')
      });
      
      // Add console log after setting state
      console.log('Set test details:', {
        testName: test.testName,
        difficultyLevel: test.difficultyLevel,
        // ... other fields for debugging
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
      difficultyLevel: '',
      lastDate: ''
    });
    setQuestions([]);
    setEditMode(false);
    setEditTestId(null);
    setActiveTab(0);
  };

  // Add this function to get rank colors
  const getRankColor = (index) => {
    switch (index) {
      case 0: return '#FFD700'; // Gold
      case 1: return '#C0C0C0'; // Silver
      case 2: return '#CD7F32'; // Bronze
      default: return '#000000'; // Black
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (verificationStatus !== 'Verified') {
    return (
      <>
        <NavbarEmployer />
        <ProfileWarning />
      </>
    );
  }

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
            <Tab label="Test Results" />
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
                      <TableCell>Last Date</TableCell>
                      <TableCell>Status</TableCell>
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
                          {moment(test.lastDate).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={test.testStatus}
                            color={
                              test.testStatus === 'Expired' ? 'error' : 
                              test.testStatus === 'Completed' ? 'success' : 
                              test.testStatus === 'Active' ? 'success' : 
                              'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          {moment(test.createdAt).format('DD MMM YYYY')}
                        </TableCell>
                        <TableCell>
                          <IconButton 
                            onClick={() => handleEditTest(test._id)}
                            color="primary"
                            sx={{ mr: 1 }}
                            disabled={test.testStatus === 'Expired'}
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
                      value={testDetails.difficultyLevel || ''}
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
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Date to Attend"
                      name="lastDate"
                      type="date"
                      value={testDetails.lastDate}
                      onChange={handleTestDetailsChange}
                      onBlur={handleTestDetailsBlur}
                      error={!!errors.lastDate}
                      helperText={errors.lastDate}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0],
                        max: new Date(new Date().setMonth(new Date().getMonth() + 2)).toISOString().split('T')[0]
                      }}
                    />
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

          {activeTab === 2 && (
            <StyledPaper>
              <Typography variant="h6" gutterBottom>
                Test Results by Job
              </Typography>
              
              {Object.entries(testResults).length > 0 ? (
                Object.entries(testResults).map(([jobId, data]) => (
                  <Accordion 
                    key={jobId}
                    expanded={selectedJobResults === jobId}
                    onChange={() => setSelectedJobResults(selectedJobResults === jobId ? null : jobId)}
                    sx={{ mb: 2 }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {data.jobTitle}
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Card>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Rank List
                          </Typography>
                          <List>
                            {data.results.map((result, index) => (
                              <React.Fragment key={result._id}>
                                <ListItem
                                  sx={{
                                    backgroundColor: index < 3 ? `${getRankColor(index)}22` : 'transparent',
                                    borderRadius: '4px',
                                    mb: 1
                                  }}
                                >
                                  <Grid container alignItems="center" spacing={2}>
                                    <Grid item xs={1}>
                                      {index < 3 && (
                                        <EmojiEventsIcon 
                                          sx={{ 
                                            color: getRankColor(index),
                                            fontSize: '24px'
                                          }} 
                                        />
                                      )}
                                    </Grid>
                                    <Grid item xs={3}>
                                      <ListItemText 
                                        primary={result.candidateName}
                                        secondary={`Rank: ${index + 1}`}
                                      />
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Typography variant="body2">
                                        Score: {result.score}/{result.totalMarks}
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Typography variant="body2">
                                        Percentage: {((result.score/result.totalMarks) * 100).toFixed(2)}%
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Typography variant="body2">
                                        Time Taken: {result.timeTaken} mins
                                      </Typography>
                                    </Grid>
                                    <Grid item xs={2}>
                                      <Chip 
                                        label={result.result ? 'PASS' : 'FAIL'}
                                        color={result.result ? 'success' : 'error'}
                                        size="small"
                                      />
                                    </Grid>
                                  </Grid>
                                </ListItem>
                                <Divider />
                              </React.Fragment>
                            ))}
                          </List>
                        </CardContent>
                      </Card>
                    </AccordionDetails>
                  </Accordion>
                ))
              ) : (
                <Typography variant="body1" sx={{ textAlign: 'center', py: 3 }}>
                  No test results available
                </Typography>
              )}
            </StyledPaper>
          )}
        </motion.div>
      </Container>
    </>
  );
};

export default Selection;
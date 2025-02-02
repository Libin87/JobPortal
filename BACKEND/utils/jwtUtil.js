// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Grid,
//   TextField,
//   Button,
//   Typography,
//   Paper,
//   IconButton,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Box,
// } from '@mui/material';
// import DeleteIcon from '@mui/icons-material/Delete';
// import NavbarEmployer from './NavbarEmployer';
// import axios from 'axios';
// import { styled } from '@mui/material/styles';
// import { motion } from 'framer-motion';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   padding: theme.spacing(3),
//   marginBottom: theme.spacing(3),
//   borderRadius: '15px',
//   boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
//   transition: 'transform 0.2s ease-in-out',
//   '&:hover': {
//     transform: 'translateY(-5px)',
//   },
// }));

// const GradientButton = styled(Button)(({ theme }) => ({
//   background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
//   border: 0,
//   borderRadius: 3,
//   boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
//   color: 'white',
//   height: 48,
//   padding: '0 30px',
//   margin: theme.spacing(1),
// }));


// const Selection = () => {
//   const [testDetails, setTestDetails] = useState({
//     testName: '',
//     duration: '',
//     totalMarks: '',
//     passingMarks: '',
//     jobId: '',
//   });

//   const [errors, setErrors] = useState({
//     testName: '',
//     duration: '',
//     totalMarks: '',
//     passingMarks: '',
//     questions: []
//   });

//   const [questions, setQuestions] = useState([{
//     question: '',
//     options: ['', '', '', ''],
//     correctAnswer: '',
//     marks: ''
//   }]);

//   const [openDialog, setOpenDialog] = useState(false);
//   const [availableJobs, setAvailableJobs] = useState([]);

//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const userId = sessionStorage.getItem('userId');
//         console.log('UserId:', userId); // Debugging
//         const response = await axios.get(`http://localhost:3000/jobs/myjobs1?userId=${userId}`);
//         console.log('Fetched Jobs:', response.data); // Debugging

//         setAvailableJobs(response.data);
//         console.log('Available Jobs:', availableJobs);

//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//       }
//     };
//     fetchJobs();
//   }, []);

//   const handleTestDetailsChange = (e) => {
//     const newTestDetails = {
//       ...testDetails,
//       [e.target.name]: e.target.value
//     };
//     setTestDetails(newTestDetails);

//     // If total marks is changed, update the marks for each question
//     if (e.target.name === 'totalMarks') {
//       const marksPerQuestion = Math.round(Number(e.target.value) / questions.length);
//       const updatedQuestions = questions.map(q => ({
//         ...q,
//         marks: marksPerQuestion.toString()
//       }));
//       setQuestions(updatedQuestions);
//     }
//   };

//   const validateTestName = (value) => {
//     if (!value) return 'Test name is required';
  
//     if (!/^[a-zA-Z\s]{1,100}[0-9]{0,2}$/.test(value)) {
//       return 'Enter a valid TestName';
//     } else if (/(.)\1{3,}/.test(value)) {
//       return 'Enter a valid TestName';
//     }
  
//     if (value.length > 25) {
//       return 'Test name cannot exceed 25 characters';
//     }
  
//     return '';
//   };
  

//   const validateDuration = (value) => {
//     const duration = Number(value);
//     if (duration < 10 || duration > 180) {
//       return 'Duration must be between 10 and 180 minutes';
//     }
//     return '';
//   };

//   const validateTotalMarks = (value) => {
//     const marks = Number(value);
//     if (marks < 10 || marks > 180) {
//       return 'Total marks must be between 10 and 180';
//     }
//     return '';
//   };

//   const validatePassingMarks = (value, totalMarks) => {
//     if (!value) return 'Passing marks is required';
//     const passingMarks = Number(value);
//     const minimumPassingMarks = Math.ceil(Number(totalMarks) * 0.25);
//     if (passingMarks < minimumPassingMarks) {
//       return `Passing marks should be at least ${minimumPassingMarks} (25% of total marks)`;
//     }
//     if (passingMarks > totalMarks) {
//       return 'Passing marks cannot exceed total marks';
//     }
//     return '';
//   };

//   const validateQuestion = (value) => {
//     if (!value) return 'Question is required';
//     if (value.length > 100) return 'Maximum 50 characters allowed';
//     if (/(.)\1{3,}/.test(value)) {
//       return 'No character can be repeated more than 3 times consecutively';
//     }
//     return '';
//   };

//   const validateOption = (value) => {
//     if (!value) return 'Option is required';
//     if (value.length > 20) return 'Maximum 20 characters allowed';
//     if (/(.)\1{4,}/.test(value)) {
//       return 'Enter a valid options';
//     }
    
//     return '';
//   };

//   const handleTestDetailsBlur = (e) => {
//     const { name, value } = e.target;
//     let error = '';

//     switch (name) {
//       case 'testName':
//         error = validateTestName(value);
//         break;
//       case 'duration':
//         error = validateDuration(value);
//         break;
//       case 'totalMarks':
//         error = validateTotalMarks(value);
//         break;
//       case 'passingMarks':
//         error = validatePassingMarks(value, testDetails.totalMarks);
//         break;
//     }

//     setErrors(prev => ({
//       ...prev,
//       [name]: error
//     }));
//   };

//   const handleQuestionChange = (index, field, value) => {
//     const newQuestions = [...questions];
//     const newErrors = [...(errors.questions || [])];
    
//     if (!newErrors[index]) {
//       newErrors[index] = { question: '', options: ['', '', '', ''], correctAnswer: '', marks: '' };
//     }

//     if (field === 'options') {
//       newQuestions[index].options[value.optionIndex] = value.text;
//       newErrors[index].options[value.optionIndex] = validateOption(value.text);
//     } else if (field === 'question') {
//       newQuestions[index][field] = value;
//       newErrors[index].question = validateQuestion(value);
//     } else if (field === 'correctAnswer') {
//       const answerNum = Number(value);
//       newQuestions[index][field] = value;
//       newErrors[index].correctAnswer = 
//         !value ? 'Correct answer is required' :
//         answerNum < 1 || answerNum > 4 ? 'Must be between 1 and 4' : '';
//     } else if (field === 'marks') {
//       const markValue = Number(value);
//       newQuestions[index][field] = value;
//       newErrors[index].marks = 
//         !value ? 'Marks are required' :
//         markValue < 1 || markValue > 5 ? 'Marks must be between 1 and 5' : '';
//     }

//     setQuestions(newQuestions);
//     setErrors(prev => ({ ...prev, questions: newErrors }));
//   };

//   const addQuestion = () => {
//     const newQuestion = {
//       question: '',
//       options: ['', '', '', ''],
//       correctAnswer: '',
//       marks: ''
//     };
    
//     const newQuestions = [...questions, newQuestion];
//     setQuestions(newQuestions);

//     // Recalculate marks per question when adding a new question
//     if (testDetails.totalMarks) {
//       const marksPerQuestion = (Number(testDetails.totalMarks) / newQuestions.length).toFixed(2); // Calculate with up to 2 decimal places
//       const updatedQuestions = newQuestions.map(q => ({
//         ...q,
//         marks: marksPerQuestion
//       }));
//       setQuestions(updatedQuestions);
//     }
//   };

//   const removeQuestion = (index) => {
//     const newQuestions = questions.filter((_, i) => i !== index);
//     setQuestions(newQuestions);

//     // Recalculate marks per question when removing a question
//     if (testDetails.totalMarks && newQuestions.length > 0) {
//       const marksPerQuestion = Math.round(Number(testDetails.totalMarks) / newQuestions.length);
//       const updatedQuestions = newQuestions.map(q => ({
//         ...q,
//         marks: marksPerQuestion.toString()
//       }));
//       setQuestions(updatedQuestions);
//     }
//   };

//   const handleSubmit = async () => {
//     try {
//       // Validation
//       if (!testDetails.testName || !testDetails.duration || !testDetails.totalMarks || !testDetails.passingMarks) {
//         toast.error('Please fill in all test details');
//         return;
//       }

//       // Validate questions
//       for (const question of questions) {
//         if (!question.question || question.options.some(opt => !opt) || !question.correctAnswer || !question.marks) {
//           toast.error('Please fill in all question details');
//           return;
//         }
//       }
//       const testData = {
//         ...testDetails,
//         questions,
//         employerId: sessionStorage.getItem('userId'),
//         ...(testDetails.jobId && { jobId: testDetails.jobId })
//       };

//       const response = await axios.post('http://localhost:3000/test/createTest', testData);

//       if (response.data) {
//         toast.success('Test created successfully!');
//         setOpenDialog(true);
//         // Reset form
//         setTestDetails({
//           testName: '',
//           duration: '',
//           totalMarks: '',
//           passingMarks: '',
//           jobId: '',
//         });
//         setQuestions([{
//           question: '',
//           options: ['', '', '', ''],
//           correctAnswer: '',
//           marks: ''
//         }]);
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Error creating test');
//       console.error('Error creating test:', error);
//     }
//   };
  
//   return (
//     <>
//       <NavbarEmployer />
//       <ToastContainer position="top-right" />
//       <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
//         <motion.div
//           initial={{ opacity: 0, y: 20 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.5 }}
//         >
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{
//               fontWeight: 'bold',
//               color: '#1a237e',
//               textAlign: 'center',
//               mb: 4
//             }}
//           >
//             Create Selection Test
//           </Typography>

//           <StyledPaper>
//             <Grid container spacing={3}>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Test Name"
//                   name="testName"
//                   value={testDetails.testName}
//                   onChange={handleTestDetailsChange}
//                   onBlur={handleTestDetailsBlur}
//                   error={!!errors.testName}
//                   helperText={errors.testName}
//                   variant="outlined"
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Duration (minutes)"
//                   name="duration"
//                   type="number"
//                   value={testDetails.duration}
//                   onChange={handleTestDetailsChange}
//                   onBlur={handleTestDetailsBlur}
//                   error={!!errors.duration}
//                   helperText={errors.duration}
//                   variant="outlined"
//                   inputProps={{ min: 10, max: 180 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Total Marks"
//                   name="totalMarks"
//                   type="number"
//                   value={testDetails.totalMarks}
//                   onChange={handleTestDetailsChange}
//                   onBlur={handleTestDetailsBlur}
//                   error={!!errors.totalMarks}
//                   helperText={errors.totalMarks}
//                   variant="outlined"
//                   inputProps={{ min: 10, max: 180 }}
//                 />
//               </Grid>
//               <Grid item xs={12} sm={6}>
//                 <TextField
//                   fullWidth
//                   label="Passing Marks"
//                   name="passingMarks"
//                   type="number"
//                   value={testDetails.passingMarks}
//                   onChange={handleTestDetailsChange}
//                   onBlur={handleTestDetailsBlur}
//                   error={!!errors.passingMarks}
//                   helperText={errors.passingMarks}
//                   variant="outlined"
//                   inputProps={{ 
//                     min: 1,
//                     max: testDetails.totalMarks 
//                   }}
//                 />
//               </Grid>

//               <Grid item xs={12}>
//                 <TextField
//                   select
//                   fullWidth
//                   label="Associated Job (Optional)"
//                   name="jobId"
//                   value={testDetails.jobId}
//                   onChange={handleTestDetailsChange}
//                   SelectProps={{
//                     native: true,
//                   }}
//                 >
//                   <option value=""></option>
//                   {availableJobs.map((job) => (
//                     <option key={job._id} value={job._id}>
//                       {job.jobTitle}
//                     </option>
//                   ))}
//                 </TextField>
//               </Grid>
//             </Grid>
//           </StyledPaper>

//           {questions.map((question, index) => (
//             <StyledPaper key={index}>
//               <Grid container spacing={3}>
//                 <Grid item xs={11}>
//                   <TextField
//                     fullWidth
//                     label={`Question ${index + 1}`}
//                     value={question.question}
//                     onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
//                     error={!!(errors.questions?.[index]?.question)}
//                     helperText={errors.questions?.[index]?.question}
//                   />
//                 </Grid>
//                 <Grid item xs={1}>
//                   <IconButton onClick={() => removeQuestion(index)}>
//                     <DeleteIcon />
//                   </IconButton>
//                 </Grid>
//                 {question.options.map((option, optionIndex) => (
//                   <Grid item xs={12} sm={6} key={optionIndex}>
//                     <TextField
//                       fullWidth
//                       label={`Option ${optionIndex + 1}`}
//                       value={option}
//                       onChange={(e) => handleQuestionChange(index, 'options', {
//                         optionIndex,
//                         text: e.target.value
//                       })}
//                       error={!!(errors.questions?.[index]?.options?.[optionIndex])}
//                       helperText={errors.questions?.[index]?.options?.[optionIndex]}
//                       inputProps={{ maxLength: 20 }}
//                     />
//                   </Grid>
//                 ))}
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Correct Answer (Option number)"
//                     type="number"
//                     value={question.correctAnswer}
//                     onChange={(e) => handleQuestionChange(index, 'correctAnswer', e.target.value)}
//                     error={!!(errors.questions?.[index]?.correctAnswer)}
//                     helperText={errors.questions?.[index]?.correctAnswer}
//                     inputProps={{ min: 1, max: 4 }}
//                   />
//                 </Grid>
//                 <Grid item xs={12} sm={6}>
//                   <TextField
//                     fullWidth
//                     label="Marks for this question"
//                     type="number"
//                     value={question.marks}
//                     disabled
//                     variant="outlined"
//                     helperText="Marks are automatically calculated"
//                   />
//                 </Grid>
//               </Grid>
//             </StyledPaper>
//           ))}

//           <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
//             <GradientButton onClick={addQuestion}>
//               Add Question
//             </GradientButton>
//             <GradientButton onClick={handleSubmit}>
//               Create Test
//             </GradientButton>
//           </Box>

//           <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
//             <DialogTitle>Success</DialogTitle>
//             <DialogContent>
//               Test has been created successfully!
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={() => setOpenDialog(false)}>OK</Button>
//             </DialogActions>
//           </Dialog>
//         </motion.div>
//       </Container>
//     </>
//   );
// };

// export default Selection;
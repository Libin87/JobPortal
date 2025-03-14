import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Grid,
  Button,
  TextField,
  FormControl, InputLabel, Select, MenuItem, FormHelperText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle, Autocomplete,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import NavbarEmployer from './NavbarEmployer';
import Footer from '../../components/Footer';

const EmployerPage = () => {
  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    salary: '',
    jobType: '',
    qualifications: '',
    skills: '',
    jobDescription: '',
    experience: '',
    contactDetails: '',
    lastDate: '',
  });

  const [error, setError] = useState({});
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const [jobTypeOptions] = useState([
    'frontend-developer', 'ui-designer', 'backend-developer', 'fullstack-developer', 
    'project-manager', 'data-scientist', 'product-designer', 'devops-engineer', 
    'qa-engineer', 'marketing-specialist', 'hr-manager', 'content-writer'
  ]);

  useEffect(() => {
    const role = sessionStorage.getItem('role');
    if (!role || role !== 'employer') {
      navigate('/login');
    } else {
      // Fetch company name and logo from backend
      const fetchCompanyData = async () => {
        try {
          const userId = sessionStorage.getItem('userId');

          // Fetch company name
          const nameResponse = await axios.get(`http://localhost:3000/profile/company/${userId}`);
          sessionStorage.setItem('cname', nameResponse.data.companyName);
          

          // Fetch company logo
          const logoResponse = await axios.get(`http://localhost:3000/profile/logo/${userId}`);
          const logoUrl = logoResponse.data.logoUrl;
          sessionStorage.setItem('logo', logoResponse.data.logoUrl);


          // Store logoUrl in a variable or in state if needed
          console.log('Company Logo URL:', logoUrl);

        } catch (err) {
          console.error('Error fetching company data:', err);
        }
      };

      fetchCompanyData();
    }
  }, [navigate]);


  const validateField = (name, value) => {
    let fieldError = {};

    switch (name) {
      case 'jobTitle': {
        if (!value.trim()) {
          fieldError[name] = 'Job title is required';
        } else {
          const spaceCount = (value.match(/ /g) || []).length;
          if (spaceCount > 2) {
            fieldError[name] = 'Maximum 2 spaces allowed';
          } else {
            // Allow letters and spaces, less strict validation
            const words = value.trim().split(/\s+/);
            const isValidFormat = words.every(word => 
              !word || /^[A-Za-z]+$/.test(word)
            );
            if (!isValidFormat) {
              fieldError[name] = 'Only letters are allowed';
            }
          }
        }
        break;
      }

      case 'location': {
        if (!value.trim()) {
          fieldError[name] = 'Location is required';
        } else {
          const spaceCount = (value.match(/ /g) || []).length;
          if (spaceCount > 2) {
            fieldError[name] = 'Maximum 2 spaces allowed';
          } else {
            // Allow letters and spaces, less strict validation
            const words = value.trim().split(/\s+/);
            const isValidFormat = words.every(word => 
              !word || /^[A-Za-z]+$/.test(word)
            );
            if (!isValidFormat) {
              fieldError[name] = 'Only letters are allowed';
            }
          }
        }
        break;
      }

      case 'jobDescription': {
        if (!value.trim()) {
          fieldError[name] = 'Job description is required';
        } else if (value.trim().length < 10) {
          fieldError[name] = 'Job description must be at least 10 characters long';
        } else {
          // Check each line for maximum 2 consecutive spaces
          const lines = value.split('\n');
          for (const line of lines) {
            if (line.trim()) { // Only check non-empty lines
              if (/\s{3,}/.test(line)) {
                fieldError[name] = 'Maximum 2 consecutive spaces allowed per line';
                break;
              }
            }
          }
        }
        break;
      }

      case 'salary':
        if (value && (value < 1000 || value > 5000000)) {
          fieldError.salary = 'Enter a valid salary ';
        }
        break;
      case 'experience':
        if (value && (!/^\d+$/.test(value) || value < 0 || value > 60)) {
          fieldError.experience = 'Enter a valid experience';
        }
        break;
      case 'lastDate':
        const today = new Date().toISOString().split('T')[0];

        // Calculate the date 6 months from today
        const sixMonthsLater = new Date();
        sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
        const sixMonthsLaterDate = sixMonthsLater.toISOString().split('T')[0];

        if (value && value < today) {
          fieldError.lastDate = 'Last Date cannot be in the past.';
        } else if (value && value > sixMonthsLaterDate) {
          fieldError.lastDate = 'Last Date cannot exceed 6 months from today.';
        }
        break;

      case 'contactDetails':
        const phoneRegex = /^\d{10}$/; // 10-digit phone number
        const repeatedDigitsRegex = /(\d)\1{4,}/; // No more than 4 consecutive same digits
        const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/; // Standard email format

        if (!phoneRegex.test(value) && !emailRegex.test(value)) {
          fieldError.contactDetails = 'Enter a valid phone number (10 digits) or email address.';
        } else if (phoneRegex.test(value) && repeatedDigitsRegex.test(value)) {
          fieldError.contactDetails = 'Enter a valid Phone number';
        }
        break;
      // case 'jobDescription':
      //   if (value && value.trim().length < 10) {
      //     fieldError.jobDescription = 'Job description must be at least 10 characters long.';
      //   }
      //   break;
      case 'jobDescription':
        if (value && value.trim().length < 10) {
          fieldError.jobDescription = 'Job description must be at least 10 characters long.';
        } else if (/([a-zA-Z])\1\1/.test(value)) {
          fieldError.jobDescription = 'No letter should be repeated more than three times consecutively.';
        } else if (/\d/.test(value)) {
          fieldError.jobDescription = 'Job description should not contain digits.';
        }
        break;


      case 'location':
        const titleLocationRegex = /^[A-Za-z\s]+(?:\d{0,2})?$/;
        if (!titleLocationRegex.test(value)) {
          fieldError[name] = 'Enter a valid location.';
        }
        break;
      case 'jobTitle':
        const titleLocationRegex1 = /^[A-Za-z\s]+(?:\d{0,2})?$/;
        if (!titleLocationRegex1.test(value)) {
          fieldError[name] = 'Enter a valid jobtitle';
        }
        break;
        case 'vaccancy':
          const vacancyRegex = /^(?:[1-9][0-9]{0,2})$/; // Regex for numbers 1-999
          if (!vacancyRegex.test(value)) {
            fieldError[name] = 'Vacancy must be a number between 1 and 999';
          }
          break;
      default:
        break;
    }

    setError((prevError) => ({
      ...prevError,
      ...fieldError,
    }));

    return fieldError;
  };


  const handleInputChange = (event, newValue) => {
    const { name, value } = event.target || {};

    if (name) {
      let processedValue = value;

      // Special handling for jobTitle and location
      if (name === 'jobTitle' || name === 'location') {
        processedValue = value
          .replace(/\s+/g, ' ') // Replace multiple spaces with single space
          .split(' ')
          .map(word => word ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase() : '')
          .join(' ');
      }

      // Special handling for jobDescription
      if (name === 'jobDescription') {
        processedValue = value
          .split('\n')
          .map(line => line.replace(/\s{3,}/g, '  '))
          .join('\n');
      }

      setFormData(prev => ({
        ...prev,
        [name]: processedValue
      }));

      // Validate if there's content
      if (processedValue.trim()) {
        const fieldError = validateField(name, processedValue);
        setError(prev => ({
          ...prev,
          ...fieldError
        }));
      } else {
        // Clear error when empty
        setError(prev => ({
          ...prev,
          [name]: null
        }));
      }
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem('userId');
    const companyName = sessionStorage.getItem('cname');
    const logoUrl = sessionStorage.getItem('logo');
    console.log('Logo URL:', logoUrl);
    console.log("cname",companyName)
    const jobData = { ...formData, userId, companyName, logoUrl };
    try {
      const response = await axios.post('http://localhost:3000/jobs/create', jobData);
      console.log(response.data);
      setOpenPopup(true);
      setFormData({
        jobTitle: '',
        location: '',
        salary: '',
        jobType: '',
        qualifications: '',
        skills: '',
        jobDescription: '',
        experience: '',
        contactDetails: '',
        lastDate: '',
      });
    } catch (err) {
      console.error('Error posting job:', err);
      setError((prev) => ({ ...prev, general: 'There was an issue posting the job. Please try again.' }));
    }
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCancel = () => {
    setFormData({
      jobTitle: '',
      location: '',
      salary: '',
      jobType: '',
      qualifications: '',
      skills: '',
      jobDescription: '',
      experience: '',
      contactDetails: '',
      lastDate: '',
    });
  };

  const skillOptions = [
    "JavaScript", "Python", "Java", "React", "Node.js", "SQL", "AWS", "C++", "C#",
    "HTML", "CSS", "Ruby on Rails", "PHP", "Go", "Kotlin", "Swift", "TypeScript",
    "Angular", "Vue.js", "Django", "Flutter", "Machine Learning", "Data Science",
    "DevOps", "Blockchain", "Docker", "Kubernetes", "TensorFlow", "R", "Scala",
    "Unity", "Unreal Engine",
  ];
  return (
    <div>
      <NavbarEmployer />
      <Container
        style={{
          maxWidth: '100rem',
          marginTop: '50px',
          backgroundColor: '#4B647D',
          borderRadius: '20px',
          paddingLeft: '100px',
          paddingRight: '100px',
          minHeight: '15rem',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bolder', color: 'aliceblue', paddingTop: '30px' }}>EMPLOYER DASHBOARD</h1>
        </div>
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/employerprofile">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#0D6EFD' }}>
                Company Profile
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/PostedJobs">
              <Button variant="contained" color="secondary" fullWidth>
                POSTED JOBS
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/createTest ">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'GREEN' }}>
                Selection Test
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/Applicants">
              <Button variant="contained" fullWidth style={{ backgroundColor: '#00CCCD' }}>
                Applicants
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>

      <Container style={{ backgroundColor: '#552878', marginBottom: '30px', borderRadius: '50px', maxWidth: '84.5%' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '40px', color: 'aliceblue' }}>POST A JOB</h2>
      </Container>

      <Container
        style={{
          maxWidth: '100rem',
          marginTop: '50px',
          backgroundColor: 'aliceblue',
          borderRadius: '20px',
          paddingLeft: '100px',
          paddingRight: '100px',
          minHeight: '35rem',
          marginBottom: '20px',
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} style={{ marginTop: '30px' }}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Job Title"
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.jobTitle}
                helperText={error.jobTitle}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.location}
                helperText={error.location}

              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Salary"
                name="salary"
                value={formData.salary}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.salary}
                helperText={error.salary}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Autocomplete
                freeSolo
                options={jobTypeOptions}
                value={formData.jobType}
                onChange={(event, newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    jobType: newValue || ''
                  }));
                }}
                onInputChange={(event, newInputValue) => {
                  setFormData(prev => ({
                    ...prev,
                    jobType: newInputValue
                  }));
                  // Validate the new input
                  const fieldError = validateField('jobType', newInputValue);
                  setError(prev => ({
                    ...prev,
                    jobType: fieldError.jobType || null
                  }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Job Type"
                    name="jobType"
                    required
                    error={!!error.jobType}
                    helperText={error.jobType}
                    onBlur={handleBlur}
                  />
                )}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: error.jobType ? 'error.main' : 'inherit',
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required error={!!error.qualifications}>
                <InputLabel>Qualifications</InputLabel>
                <Select
                  label="Qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  MenuProps={{
                    PaperProps: {
                      style: {
                        textAlign: 'left',
                      },
                    },
                  }}
                  sx={{ textAlign: 'left' }}  // Ensures the selected item is left-aligned
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
                  <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                  <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                  <MenuItem value="PhD">PhD</MenuItem>
                  <MenuItem value="PhD">BCA</MenuItem>
                  <MenuItem value="PhD">MCA</MenuItem>
                  <MenuItem value="PhD">BSC Compter.App</MenuItem>
                  <MenuItem value="PhD">MCS Computer.App</MenuItem>
                  <MenuItem value="Other">Other</MenuItem>
                </Select>
                <FormHelperText>{error.qualifications}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={skillOptions}
                getOptionLabel={(option) => option}
                onChange={(event, newValue) => handleInputChange(event, newValue)}
                onBlur={handleBlur}
                value={formData.skills ? formData.skills.split(', ') : []} // Ensure a fallback if undefined
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Skills"
                    placeholder="Select skills"
                    fullWidth
                    error={!!error.skills}
                    helperText={error.skills}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Experience"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.experience}
                helperText={error.experience}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Contact Details"
                name="contactDetails"
                value={formData.contactDetails}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.contactDetails}
                helperText={error.contactDetails}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Last Date to Apply"
                name="lastDate"
                type="date"
                value={formData.lastDate}
                onChange={handleInputChange}
                onBlur={handleBlur}
                InputLabelProps={{ shrink: true }}
                fullWidth
                required
                error={!!error.lastDate}
                helperText={error.lastDate}
              />
            </Grid><Grid item xs={12} md={6}>
              <TextField
                label="No.Of.Vaccancies"
                name="vaccancy"
                value={formData.vaccancy}
                onChange={handleInputChange}
                onBlur={handleBlur}
                fullWidth
                required
                error={!!error.vaccancy}
                helperText={error.vaccancy}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Job Description"
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleInputChange}
                onBlur={handleBlur}
                multiline
                rows={4}
                fullWidth
                required
                error={!!error.jobDescription}
                helperText={error.jobDescription}
              />
            </Grid>


            <Grid item xs={12}>
              <Button
                variant="contained"
                onClick={handleCancel}
                style={{ backgroundColor: '#cc0000', color: 'white', marginRight: '20px', marginTop: '' }}>
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary" >
                Post Job
              </Button>

            </Grid>

          </Grid>

        </form>
      </Container>

      {/* Success Dialog */}
      <Dialog open={openPopup} onClose={handleClosePopup}>
        <DialogTitle>Job Posted</DialogTitle>
        <DialogContent>
          <DialogContentText>Your job has been posted successfully!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClosePopup} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>

      <Footer />
    </div>
  );
};

export default EmployerPage;



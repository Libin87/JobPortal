
// import React, { useState, useEffect } from 'react';
// import {
//   Container, Grid, Button, TextField, Typography, Avatar, MenuItem,
// } from '@mui/material';
// import { Autocomplete } from '@mui/material';
// import { styled } from '@mui/system';
// import Footer from '../../components/Footer';
// import NavbarEmployee from './NavbarEmployee';
// import axios from 'axios';
// import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const ProfileContainer = styled(Container)(({ theme }) => ({
//   maxWidth: '90%',
//   marginTop: '50px',
//   backgroundColor: '#F7F9FC',
//   borderRadius: '20px',
//   padding: '50px',
//   minHeight: '500px',
//   marginBottom: '30px',
//   boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
// }));

// const ProfileAvatar = styled(Avatar)(({ theme }) => ({
//   width: '160px',
//   height: '160px',
//   marginBottom: '10px',
// }));

// const UploadButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#5A5BFF',
//   color: '#FFF',
//   width: '100%',
//   marginTop: '10px',
//   '&:hover': {
//     backgroundColor: '#4748CC',
//   },
// }));

// const ActionButton = styled(Button)(({ theme }) => ({
//   backgroundColor: '#3A3B3C',
//   color: '#FFF',
//   width: '100%',
//   marginTop: '10px',
//   '&:hover': {
//     backgroundColor: '#2A2B2C',
//   },
// }));

// const EmployeeProfile = () => {

//   const [photoPreview, setPhotoPreview] = useState('');
//   const [photoFile, setPhotoFile] = useState(null);  // Store the selected photo file
//   const [resumeFile, setResumeFile] = useState(null);
//   const [isProfileExists, setIsProfileExists] = useState(false); // Tracks if profile exists

//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     degree: '',
//     experience: '',
//     skills: [],
//     jobPreferences: [],
//     dob: '',
//   });

//   const [fieldError, setFieldError] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     degree: '',
//     experience: '',
//     dob: '',
//   });

//   useEffect(() => {
//     const name = sessionStorage.getItem('name');
//     const email = sessionStorage.getItem('email');
//     const phone = sessionStorage.getItem('phone');

//     setFormData((prevData) => ({
//       ...prevData,
//       name: name || '',
//       email: email || '',
//       phone: phone || '',
//     }));

//     const userId = sessionStorage.getItem('userId');
//     if (userId) {
//       fetchProfile(userId);
//     }
//   }, []);

//   const fetchProfile = async (userId) => {
//     try {
//       const response = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
//       const profileData = response.data;
//       console.log(profileData)

//       if (profileData) {
//         // Profile exists, update the formData with the fetched profile data
//         setFormData((prevData) => ({
//           ...prevData,
//           // ...profileData,
//           name: profileData.name || '',
//           email: profileData.email || '',
//           phone: profileData.phone || '',
//           address: profileData.address || '',
//           degree: profileData.degree || '',
//           experience: profileData.experience || '',
//           // Ensure skills and jobPreferences are arrays
//           skills: Array.isArray(profileData.skills) ? profileData.skills : [], // Set skills
//           jobPreferences: Array.isArray(profileData.jobPreferences) ? profileData.jobPreferences : [], // Set job preferences
//           dob: profileData.dob ? profileData.dob.slice(0, 10) : '', // Set dob // Add dob
//         }));
//         setPhotoPreview(`http://localhost:3000/${profileData.photo}`);
//         setResumePreview(`http://localhost:3000/${profileData.resume}`);
//         setIsProfileExists(true);  // Profile exists
//       } else {
//         setIsProfileExists(false); // Profile doesn't exist, prepare to create a new one
//       }
//     } catch (error) {
//       console.error('Error fetching profile:', error);
//       setIsProfileExists(false); // Assume no profile exists if there is an error
//     }
//   };

//   const jobPreferencesOptions = [
//     'Frontend Developer', 'UI Designer', 'Backend Developer', 'Fullstack Developer',
//     'Project Manager', 'Data Scientist', 'Product Designer', 'DevOps Engineer',
//     'QA Engineer', 'Marketing Specialist', 'HR Manager', 'Content Writer',
//   ];

//   const skillOptions = [
//     'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'C++', 'C#',
//     'HTML', 'CSS', 'Ruby on Rails', 'PHP', 'Go', 'Kotlin', 'Swift', 'TypeScript',
//     'Angular', 'Vue.js', 'Django', 'Flutter', 'Machine Learning', 'Data Science',
//     'DevOps', 'Blockchain', 'Docker', 'Kubernetes', 'TensorFlow', 'R', 'Scala',
//     'Unity', 'Unreal Engine',
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const updatedFormData = {
//       ...formData,
//       [name]: value,
//     };

//     // Reset field errors on change
//     setFieldError({ ...fieldError, [name]: '' });

//     // Validation logic
//     switch (name) {
//       case 'name':
//         if (!/^[A-Za-z\s]+$/.test(value) || /(\w)\1{2,}/.test(value)) {
//           setFieldError((prev) => ({ ...prev, name: 'Name should only contain letters and should not have repeating letters.' }));
//         }
//         break;

//       case 'email':
//         const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/;
//         if (!emailRegex.test(value)) {
//           setFieldError((prev) => ({ ...prev, email: 'Enter a valid email address.' }));
//         }
//         break;

//       case 'phone':
//         const phoneRegex = /^\d{10}$/; // 10-digit phone number
//         const repeatedDigitsRegex = /(\d)\1{4,}/; // No more than 4 consecutive same digits
//         if (!phoneRegex.test(value) || repeatedDigitsRegex.test(value)) {
//           setFieldError((prev) => ({ ...prev, phone: 'Enter a valid phone number (10 digits, no more than 4 consecutive same digits).' }));
//         }
//         break;

//       case 'address':
//         const titleLocationRegex = /^[A-Za-z\s]+(?:\d{0,2})?$/;
//         if (!titleLocationRegex.test(value)) {
//           setFieldError((prev) => ({ ...prev, address: 'Enter a valid address.' }));
//         }
//         break;

//       case 'experience':
//         if (value && (!/^\d+$/.test(value) || value < 0 || value > 60)) {
//           setFieldError((prev) => ({ ...prev, experience: 'Enter a valid experience (0-60 years).' }));
//         }
//         break;

//       case 'degree':
//       case 'skills':
//       case 'jobPreferences':
//         if (/\d/.test(value)) {
//           setFieldError((prev) => ({ ...prev, [name]: 'This field should not contain any numbers.' }));
//         }
//         break;

//       case 'dob':
//         const dob = new Date(value);
//         const today = new Date();
//         const age = today.getFullYear() - dob.getFullYear();
//         const monthDiff = today.getMonth() - dob.getMonth();
//         if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
//           age--;
//         }
//         if (age < 15) {
//           setFieldError((prev) => ({ ...prev, dob: 'You must be at least 15 years old.' }));
//         }
//         break;

//       default:
//         break;
//     }

//     setFormData(updatedFormData);
//   };
//   const handleCancel = () => {
//     setFormData({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       degree: '',
//       experience: '',
//       skills: [],
//       jobPreferences: [],
//       dob: '',
//     });
//     setPhotoPreview(''); // Reset photo preview
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
  
//     const data = new FormData();
//     data.append('name', formData.name);
//     data.append('email', formData.email);
//     data.append('phone', formData.phone);
//     data.append('address', formData.address);
//     data.append('degree', formData.degree);
//     data.append('experience', formData.experience);
//     data.append('skills', formData.skills.join(',')); // Convert array to comma-separated string
//     data.append('jobPreferences', formData.jobPreferences.join(',')); // Same for jobPreferences
//     data.append('dob', formData.dob);
  
//     // Append photo and resume files if selected
//     if (photoFile) data.append('photo', photoFile);
//     if (resumeFile) data.append('resume', resumeFile);
  
//     const userId = sessionStorage.getItem('userId');
//     if (userId) {
//       data.append('userId', userId);
  
//       try {
//         let response;
  
//         if (isProfileExists) {
//           // Update profile
//           response = await axios.put(`http://localhost:3000/Employeeprofile/update/${userId}`, data, {
//             headers: {
//               'Content-Type': 'multipart/form-data', // Indicate that we are sending FormData
//             },
//           });
//           toast.success('Profile updated successfully!', { position: 'top-right', autoClose: 3000 });
//         } else {
//           // Create new profile
//           response = await axios.post('http://localhost:3000/Employeeprofile/create', data, {
//             headers: {
//               'Content-Type': 'multipart/form-data',
//             },
//           });
//           toast.success('Profile created successfully!', { position: 'top-right', autoClose: 3000 });
//           setIsProfileExists(true); // Set to true after successful creation
//         }
  
//         console.log('Profile saved successfully:', response.data);
//       } catch (error) {
//         console.error('Error saving profile:', error);
//         toast.error('Failed to save profile. Please try again.', { position: 'top-right', autoClose: 3000 });
//       }
//     }
//   };
    
  
//   const [resumePreview, setResumePreview] = useState('');
//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setResumeFile(file);  // Store the resume file in state
//       setResumePreview(URL.createObjectURL(file));  // Generate preview URL
//     }
//   };

//   return (
//     <div>
//       <NavbarEmployee />
//       <ProfileContainer>
//         <ToastContainer />
//         <Typography variant="h4" align="center" color="#360275" style={{ marginBottom: '20px' }}>
//           Update Employee Profile
//         </Typography>
//         <form onSubmit={handleSubmit}>
//           <Grid container spacing={3}>
//             <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
//               <Grid container direction="column" alignItems="center">
//                 <ProfileAvatar src={photoPreview} alt="Profile Photo" />
//                 <Typography variant="h6">{formData.name || 'Your Name'}</Typography>
//                 <input
//                   accept=".jpg, .png"
//                   id="photo-upload"
//                   type="file"
//                   style={{ display: 'none' }}
//                   onChange={(e) => {
//                     const file = e.target.files[0];
//                     const reader = new FileReader();
//                     reader.onloadend = () => setPhotoPreview(reader.result); // Set preview
//                     if (file) {
//                       setPhotoFile(file); // Store the file in state
//                       reader.readAsDataURL(file); // Read file
//                     }
//                   }}
//                 />
//                 <label htmlFor="photo-upload">
//                   <UploadButton variant="contained" component="span">
//                     Upload Photo
//                   </UploadButton>
//                 </label>
//                 <input
//                   accept=".pdf, .doc, .docx"
//                   id="resume-upload"
//                   type="file"
//                   style={{ display: 'none', marginTop: '60px' }}
//                   onChange={handleFileChange}
//                 />

//                 <label htmlFor="resume-upload">
//                   <UploadButton variant="contained" component="span">
//                     Upload Resume
//                   </UploadButton>
//                 </label>
//               </Grid>
//               {resumePreview && (
//                 <Grid item>
//                   <Typography variant="body2" style={{ marginTop: '10px' }}>
//                     <a
//                       href={resumePreview}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       style={{ color: '#007bff', textDecoration: 'none' }}
//                     >
//                       View Resume
//                     </a>
//                   </Typography>
//                 </Grid>
//               )}
//             </Grid>

//             <Grid item xs={12} md={8}>
//               <Grid container spacing={2}>
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Name"
//                     name="name"
//                     fullWidth
//                     required
//                     value={formData.name}
//                     onChange={handleChange}
//                     error={!!fieldError.name}
//                     helperText={fieldError.name}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Email"
//                     name="email"
//                     fullWidth
//                     value={formData.email}
//                     onChange={handleChange}
//                     error={!!fieldError.email}
//                     helperText={fieldError.email}
//                     InputProps={{
//                       readOnly: true, // Make the email field read-only
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Phone"
//                     name="phone"
//                     fullWidth
//                     value={formData.phone}
//                     onChange={handleChange}
//                     error={!!fieldError.phone}
//                     helperText={fieldError.phone}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Address"
//                     name="address"
//                     fullWidth
//                     required
//                     value={formData.address}
//                     onChange={handleChange}
//                     error={!!fieldError.address}
//                     helperText={fieldError.address}
//                   />
//                 </Grid>

//                 {/* Qualification Dropdown */}
//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     select
//                     label="Qualification"
//                     name="degree"
//                     fullWidth
//                     required
//                     value={formData.degree}
//                     onChange={handleChange}
//                     error={!!fieldError.degree}
//                     helperText={fieldError.degree}
//                     MenuProps={{
//                       PaperProps: {
//                         style: {
//                           textAlign: 'left',
//                         },
//                       },
//                     }}
//                     sx={{ textAlign: 'left' }}
//                   >
//                     <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
//                     <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
//                     <MenuItem value="Master's Degree">Master's Degree</MenuItem>
//                     <MenuItem value="PhD">PhD</MenuItem>
//                     <MenuItem value="PhD">BCA</MenuItem>
//                     <MenuItem value="PhD">MCA</MenuItem>
//                     <MenuItem value="PhD">BSC Compter.App</MenuItem>
//                     <MenuItem value="PhD">MCS Computer.App</MenuItem>
//                     <MenuItem value="Other">Other</MenuItem>
//                   </TextField>
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     label="Experience (Years)"
//                     name="experience"
//                     fullWidth
//                     required
//                     value={formData.experience}
//                     onChange={handleChange}
//                     error={!!fieldError.experience}
//                     helperText={fieldError.experience}
//                   />
//                 </Grid>
//                 <Grid item xs={12} md={6}>
//                   <Autocomplete
//                     multiple
//                     options={skillOptions}
//                     value={formData.skills} // Ensure this uses the formData value
//                     onChange={(event, value) => setFormData({ ...formData, skills: value })}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Skills"
//                         placeholder="Add Skills"
//                         error={!!fieldError.skills}
//                         helperText={fieldError.skills}
//                       />
//                     )}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <TextField
//                     type="date"
//                     label="Date of Birth"
//                     name="dob"
//                     fullWidth
//                     required
//                     value={formData.dob} // Ensure this uses the formData value
//                     onChange={(e) => setFormData({ ...formData, dob: e.target.value })} // Adjust to set dob directly
//                     error={!!fieldError.dob}
//                     helperText={fieldError.dob}
//                     InputLabelProps={{
//                       shrink: true,
//                     }}
//                   />
//                 </Grid>

//                 <Grid item xs={12} md={6}>
//                   <Autocomplete
//                     multiple
//                     options={jobPreferencesOptions}
//                     value={formData.jobPreferences} // Ensure this uses the formData value
//                     onChange={(event, value) => setFormData({ ...formData, jobPreferences: value })}
//                     renderInput={(params) => (
//                       <TextField
//                         {...params}
//                         label="Job Preferences"
//                         placeholder="Add Job Preferences"
//                         error={!!fieldError.jobPreferences}
//                         helperText={fieldError.jobPreferences}
//                       />
//                     )}
//                   />
//                 </Grid>

//               </Grid>


//               <Grid item xs={12} md={6}>
//                 <ActionButton type="submit" variant="contained">
//                   {isProfileExists ? 'Update Profile' : 'Create Profile'}
//                 </ActionButton>
//               </Grid>


//               <Grid item xs={6}>
//                 <Button
//                   variant="contained"
//                   style={{ backgroundColor: 'red', width: '100%', marginTop: '10px' }}
//                   onClick={handleCancel} // Call handleCancel on click
//                 >
//                   Cancel
//                 </Button>
//               </Grid>
//             </Grid>
//           </Grid>
//         </form>
//       </ProfileContainer>
//       <Footer />
//     </div>

//   );
// };

// export default EmployeeProfile;


  // import React, { useState, useEffect } from 'react';
  // import {
  //   Container, Grid, Button, TextField, Typography, Avatar, MenuItem,
  // } from '@mui/material';
  // import { Autocomplete } from '@mui/material';
  // import { styled } from '@mui/system';
  // import Footer from '../../components/Footer';
  // import NavbarEmployee from './NavbarEmployee';
  // import axios from 'axios';
  // import { toast, ToastContainer } from 'react-toastify';
  // import 'react-toastify/dist/ReactToastify.css';

  // const ProfileContainer = styled(Container)(({ theme }) => ({
  //   maxWidth: '90%',
  //   marginTop: '50px',
  //   backgroundColor: '#F7F9FC',
  //   borderRadius: '20px',
  //   padding: '50px',
  //   minHeight: '500px',
  //   marginBottom: '30px',
  //   boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
  // }));

  // const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  //   width: '160px',
  //   height: '160px',
  //   marginBottom: '10px',
  // }));

  // const UploadButton = styled(Button)(({ theme }) => ({
  //   backgroundColor: '#5A5BFF',
  //   color: '#FFF',
  //   width: '100%',
  //   marginTop: '10px',
  //   '&:hover': {
  //     backgroundColor: '#4748CC',
  //   },
  // }));

  // const ActionButton = styled(Button)(({ theme }) => ({
  //   backgroundColor: '#3A3B3C',
  //   color: '#FFF',
  //   width: '100%',
  //   marginTop: '10px',
  //   '&:hover': {
  //     backgroundColor: '#2A2B2C',
  //   },
  // }));

  // const EmployeeProfile = () => {

  //   const [photoPreview, setPhotoPreview] = useState('');
  //   const [photoFile, setPhotoFile] = useState(null);  // Store the selected photo file
  //   const [resumeFile, setResumeFile] = useState(null);
  //   const [isProfileExists, setIsProfileExists] = useState(false); // Tracks if profile exists

  //   const [formData, setFormData] = useState({
  //     name: '',
  //     email: '',
  //     phone: '',
  //     address: '',
  //     degree: '',
  //     experience: '',
  //     skills: [],
  //     jobPreferences: [],
  //     dob: '',
  //   });

  //   const [fieldError, setFieldError] = useState({
  //     name: '',
  //     email: '',
  //     phone: '',
  //     address: '',
  //     degree: '',
  //     experience: '',
  //     dob: '',
  //   });

  //   useEffect(() => {
  //     const loadSessionData = () => {
  //         const name = sessionStorage.getItem('name');
  //         const email = sessionStorage.getItem('email');
  //         const phone = sessionStorage.getItem('phone');

  //         setFormData((prevData) => ({
  //             ...prevData,
  //             name: name || '',
  //             email: email || '',
  //             phone: phone || '',
  //         }));
  //     };

  //     const userId = sessionStorage.getItem('userId');
  //     if (userId) {
  //         fetchProfile(userId, loadSessionData);
  //     } else {
  //         // Load session data directly if no userId is found
  //         loadSessionData();
  //     }
  // }, []);

  // const fetchProfile = async (userId, fallback) => {
  //     try {
  //         const response = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
  //         const profileData = response.data;
  //         console.log(profileData);

  //         if (profileData) {
  //             // Profile exists, update formData with the fetched profile data
  //             setFormData((prevData) => ({
  //                 ...prevData,
  //                 name: profileData.name || '',
  //                 email: profileData.email || '',
  //                 phone: profileData.phone || '',
  //                 address: profileData.address || '',
  //                 degree: profileData.degree || '',
  //                 experience: profileData.experience || '',
  //                 skills: Array.isArray(profileData.skills) ? profileData.skills : [],
  //                 jobPreferences: Array.isArray(profileData.jobPreferences) ? profileData.jobPreferences : [],
  //                 dob: profileData.dob ? profileData.dob.slice(0, 10) : '',
  //             }));
  //             setPhotoPreview(`http://localhost:3000/${profileData.photo}`);
  //             setResumePreview(`http://localhost:3000/${profileData.resume}`);
  //             setIsProfileExists(true);
  //         } else {
  //             // Profile does not exist, use session data as a fallback
  //             setIsProfileExists(false);
  //             fallback();
  //         }
  //     } catch (error) {
  //         console.error('Error fetching profile:', error);
  //         setIsProfileExists(false);
  //         fallback(); // Use session data if there's an error fetching the profile
  //     }
  // };


  //   const jobPreferencesOptions = [
  //     'Frontend Developer', 'UI Designer', 'Backend Developer', 'Fullstack Developer',
  //     'Project Manager', 'Data Scientist', 'Product Designer', 'DevOps Engineer',
  //     'QA Engineer', 'Marketing Specialist', 'HR Manager', 'Content Writer',
  //   ];

  //   const skillOptions = [
  //     'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'C++', 'C#',
  //     'HTML', 'CSS', 'Ruby on Rails', 'PHP', 'Go', 'Kotlin', 'Swift', 'TypeScript',
  //     'Angular', 'Vue.js', 'Django', 'Flutter', 'Machine Learning', 'Data Science',
  //     'DevOps', 'Blockchain', 'Docker', 'Kubernetes', 'TensorFlow', 'R', 'Scala',
  //     'Unity', 'Unreal Engine',
  //   ];

  //   const handleChange = (e) => {
  //     const { name, value } = e.target;
  //     const updatedFormData = {
  //       ...formData,
  //       [name]: value,
  //     };

  //     // Reset field errors on change
  //     setFieldError({ ...fieldError, [name]: '' });

  //     // Validation logic
  //     switch (name) {
  //       case 'name':
  //   // Regex to check if the name contains only letters and spaces and has at least 3 letters
  //   if (!/^[A-Za-z\s]{3,}$/.test(value) || /(\w)\1{2,}/.test(value)) {
  //     setFieldError((prev) => ({ ...prev, name: 'Enter a valid Name' }));
  //   } else {
  //     // Clear error if validation passes
  //     setFieldError((prev) => ({ ...prev, name: '' }));
  //   }
  //   break;


  //       case 'email':
  //         const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/;
  //         if (!emailRegex.test(value)) {
  //           setFieldError((prev) => ({ ...prev, email: 'Enter a valid email address.' }));
  //         }
  //         break;

  //       case 'phone':
  //         const phoneRegex = /^\d{10}$/; // 10-digit phone number
  //         const repeatedDigitsRegex = /(\d)\1{4,}/; // No more than 4 consecutive same digits
  //         if (!phoneRegex.test(value) || repeatedDigitsRegex.test(value)) {
  //           setFieldError((prev) => ({ ...prev, phone: 'Enter a valid phone number (10 digits, no more than 4 consecutive same digits).' }));
  //         }
  //         break;

      
  //   //     case 'address':
  //   // const addressRegex = /^[A-Za-z][A-Za-z\s\d,(,)]{3,}$/; // Updated regex
  //   // if (!addressRegex.test(value)) {
  //   //   setFieldError((prev) => ({ ...prev, address: 'Enter a valid address (minimum 4 characters, cannot start with digits).' }));
  //   // }
  //   // break;
  //   case 'address':
  //   // Regex to ensure it doesn't start with a digit, can contain letters, spaces, commas, parentheses, and digits
  //   const addressRegex = /^(?!\d)[A-Za-z\s(),]*[A-Za-z0-9\s(),]*$/; 
  //   const digitCount = (value.match(/\d/g) || []).length; // Count the total number of digits

  //   // Validate the address
  //   if (!addressRegex.test(value) || digitCount > 7 || value.length < 4) {
  //     setFieldError((prev) => ({
  //       ...prev,
  //       address: 'Enter a valid address '
  //     }));
  //   } else {
  //     // Clear the error if validation passes
  //     setFieldError((prev) => ({ ...prev, address: '' }));
  //   }
  //   break;

  //       case 'experience':
  //         if (value && (!/^\d+$/.test(value) || value < 0 || value > 50)) {
  //           setFieldError((prev) => ({ ...prev, experience: 'Enter a valid experience (0-50 years).' }));
  //         }
  //         break;

  //       case 'degree':
  //       case 'skills':
  //       case 'jobPreferences':
  //         if (/\d/.test(value)) {
  //           setFieldError((prev) => ({ ...prev, [name]: 'This field should not contain any numbers.' }));
  //         }
  //         break;

  //       case 'dob':
  //   const dob = new Date(value);
  //   const today = new Date();
    
  //   // Calculate age
  //   let age = today.getFullYear() - dob.getFullYear();
  //   const monthDiff = today.getMonth() - dob.getMonth();
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
  //     age--;
  //   }

  //   // Minimum age validation (15 years)
  //   if (age < 15) {
  //     setFieldError((prev) => ({ ...prev, dob: 'You must be at least 15 years old.' }));
  //   } 
  //   // Maximum age validation (60 years)
  //   else if (age > 60) {
  //     setFieldError((prev) => ({ ...prev, dob: 'You must be less than 60 years old.' }));
  //   } 
  //   // Clear error if validation passes
  //   else {
  //     setFieldError((prev) => ({ ...prev, dob: '' }));
  //   }
  //   break;


  //       default:
  //         break;
  //     }

  //     setFormData(updatedFormData);
  //   };
  //   const handleCancel = () => {
  //     setFormData({
  //       name: '',
  //       email: '',
  //       phone: '',
  //       address: '',
  //       degree: '',
  //       experience: '',
  //       skills: [],
  //       jobPreferences: [],
  //       dob: '',
  //     });
  //     setPhotoPreview(''); // Reset photo preview
  //   };



  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const data = new FormData();
  //   data.append('name', formData.name);
  //   data.append('email', formData.email);
  //   data.append('phone', formData.phone);
  //   data.append('address', formData.address);
  //   data.append('degree', formData.degree);
  //   data.append('experience', formData.experience);
  //   data.append('skills', formData.skills.join(',')); // Convert array to comma-separated string
  //   data.append('jobPreferences', formData.jobPreferences.join(',')); // Same for jobPreferences
  //   data.append('dob', formData.dob);

  //   // Append photo and resume files if selected
  //   if (photoFile) data.append('photo', photoFile);
  //   if (resumeFile) data.append('resume', resumeFile);

  //   const userId = sessionStorage.getItem('userId');
  //   if (userId) {
  //       data.append('userId', userId);

  //       try {
  //           let response;

  //           if (isProfileExists) {
  //               // Update profile
  //               response = await axios.put(`http://localhost:3000/Employeeprofile/update/${userId}`, data, {
  //                   headers: {
  //                       'Content-Type': 'multipart/form-data', // Indicate that we are sending FormData
  //                   },
  //               });
  //               toast.success('Profile updated successfully!', { position: 'top-right', autoClose: 3000 });

  //               // Update the signup database
  //               await axios.put(`http://localhost:3000/user/update/${userId}`, {
  //                   name: formData.name,
  //                   phone: formData.phone,
  //               }, {
  //                   headers: {
  //                       'Content-Type': 'application/json', // Set correct headers for JSON request
  //                   }
  //               });
  //           } else {
  //               // Create new profile
  //               response = await axios.post('http://localhost:3000/Employeeprofile/create', data, {
  //                   headers: {
  //                       'Content-Type': 'multipart/form-data',
  //                   },
  //               });
  //               toast.success('Profile created successfully!', { position: 'top-right', autoClose: 3000 });
  //               setIsProfileExists(true); // Set to true after successful creation

  //               // Update the signup database
  //               await axios.put(`http://localhost:3000/user/update/${userId}`, {
  //                   name: formData.name,
  //                   phone: formData.phone,
  //               }, {
  //                   headers: {
  //                       'Content-Type': 'application/json', // Set correct headers for JSON request
  //                   }
  //               });
  //           }
  //           console.log("Profile saved successfully:", response.data);
  //       } 
        
  //       catch (error) {
  //         console.error('Error saving profile:', error);
      
  //         // Check if there's a response from the backend
  //         if (error.response) {
  //             const errorMessage = error.response.data.message; // Access the message from the backend
  //             console.error('Error Response:', errorMessage);
      
  //             // Show the backend error message in a toast
  //             toast.error(errorMessage || 'Phone number already exists', {
  //                 position: 'top-right',
  //                 autoClose: 3000,
  //             });
  //         } else {
  //             // If there's no backend response, show a generic error
  //             console.error('Error Message:', error.message);
  //             toast.error('Failed to save profile. Please try again.', {
  //                 position: 'top-right',
  //                 autoClose: 3000,
  //             });
  //         }
  //     }
      
  //   }
  // };

      
    
  //   const [resumePreview, setResumePreview] = useState('');
  //   const handleFileChange = (e) => {
  //     const file = e.target.files[0];
  //     if (file) {
  //       setResumeFile(file);  // Store the resume file in state
  //       setResumePreview(URL.createObjectURL(file));  // Generate preview URL
  //     }
  //   };

  //   return (
  //     <div>
  //       <NavbarEmployee />
  //       <ProfileContainer>
  //         <ToastContainer />
  //         <Typography variant="h4" align="center" color="#360275" style={{ marginBottom: '20px' }}>
  //           Update Employee Profile
  //         </Typography>
  //         <form onSubmit={handleSubmit}>
  //           <Grid container spacing={3}>
  //             <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
  //               <Grid container direction="column" alignItems="center">
  //                 <ProfileAvatar src={photoPreview} alt="Profile Photo" />
  //                 <Typography variant="h6">{formData.name || 'Your Name'}</Typography>
  //                 <input
  //                   accept=".jpg, .png"
  //                   id="photo-upload"
  //                   type="file"
  //                   style={{ display: 'none' }}
  //                   onChange={(e) => {
  //                     const file = e.target.files[0];
  //                     const reader = new FileReader();
  //                     reader.onloadend = () => setPhotoPreview(reader.result); // Set preview
  //                     if (file) {
  //                       setPhotoFile(file); // Store the file in state
  //                       reader.readAsDataURL(file); // Read file
  //                     }
  //                   }}
  //                 />
  //                 <label htmlFor="photo-upload">
  //                   <UploadButton variant="contained" component="span">
  //                     Upload Photo
  //                   </UploadButton>
  //                 </label>
  //                 <input
  //                   accept=".pdf, .doc, .docx"
  //                   id="resume-upload"
  //                   type="file"
  //                   style={{ display: 'none', marginTop: '60px' }}
  //                   onChange={handleFileChange}
  //                 />

  //                 <label htmlFor="resume-upload">
  //                   <UploadButton variant="contained" component="span">
  //                     Upload Resume
  //                   </UploadButton>
  //                 </label>
  //               </Grid>
  //               {resumePreview && (
  //                 <Grid item>
  //                   <Typography variant="body2" style={{ marginTop: '10px' }}>
  //                     <a
  //                       href={resumePreview}
  //                       target="_blank"
  //                       rel="noopener noreferrer"
  //                       style={{ color: '#007bff', textDecoration: 'none' }}
  //                     >
  //                       View Resume
  //                     </a>
  //                   </Typography>
  //                 </Grid>
  //               )}
  //             </Grid>

  //             <Grid item xs={12} md={8}>
  //               <Grid container spacing={2}>
  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     label="Name"
  //                     name="name"
  //                     fullWidth
  //                     required
  //                     value={formData.name}
  //                     onChange={handleChange}
  //                     error={!!fieldError.name}
  //                     helperText={fieldError.name}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     label="Email"
  //                     name="email"
  //                     fullWidth
  //                     value={formData.email}
  //                     onChange={handleChange}
  //                     error={!!fieldError.email}
  //                     helperText={fieldError.email}
  //                     InputProps={{
  //                       readOnly: true, // Make the email field read-only
  //                     }}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     label="Phone"
  //                     name="phone"
  //                     fullWidth
  //                     value={formData.phone}
  //                     onChange={handleChange}
  //                     error={!!fieldError.phone}
  //                     helperText={fieldError.phone}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     label="Address"
  //                     name="address"
  //                     fullWidth
  //                     required
  //                     value={formData.address}
  //                     onChange={handleChange}
  //                     error={!!fieldError.address}
  //                     helperText={fieldError.address}
  //                   />
  //                 </Grid>

  //                 {/* Qualification Dropdown */}
  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     select
  //                     label="Qualification"
  //                     name="degree"
  //                     fullWidth
  //                     required
  //                     value={formData.degree}
  //                     onChange={handleChange}
  //                     error={!!fieldError.degree}
  //                     helperText={fieldError.degree}
  //                     MenuProps={{
  //                       PaperProps: {
  //                         style: {
  //                           textAlign: 'left',
  //                         },
  //                       },
  //                     }}
  //                     sx={{ textAlign: 'left' }}
  //                   >
  //                     <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
  //                     <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
  //                     <MenuItem value="Master's Degree">Master's Degree</MenuItem>
  //                     <MenuItem value="PhD">PhD</MenuItem>
  //                     <MenuItem value="bca">BCA</MenuItem>
  //                     <MenuItem value="mca">MCA</MenuItem>
  //                     <MenuItem value="bsc computer app">BSC Compter.App</MenuItem>
  //                     <MenuItem value="msc computer app">MCS Computer.App</MenuItem>
  //                     <MenuItem value="Other">Other</MenuItem>
  //                   </TextField>
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     label="Experience (Years)"
  //                     name="experience"
  //                     fullWidth
  //                     required
  //                     value={formData.experience}
  //                     onChange={handleChange}
  //                     error={!!fieldError.experience}
  //                     helperText={fieldError.experience}
  //                   />
  //                 </Grid>
  //                 <Grid item xs={12} md={6}>
  //                   <Autocomplete
  //                     multiple
  //                     options={skillOptions}
  //                     value={formData.skills} // Ensure this uses the formData value
  //                     onChange={(event, value) => setFormData({ ...formData, skills: value })}
  //                     renderInput={(params) => (
  //                       <TextField
  //                         {...params}
  //                         label="Skills"
  //                         placeholder="Add Skills"
  //                         error={!!fieldError.skills}
  //                         helperText={fieldError.skills}
  //                       />
  //                     )}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <TextField
  //                     type="date"
  //                     label="Date of Birth"
  //                     name="dob"
  //                     fullWidth
  //                     required
  //                     value={formData.dob} // Ensure this uses the formData value
  //                     onChange={handleChange} // Adjust to set dob directly
  //                     error={!!fieldError.dob}
  //                     helperText={fieldError.dob}
  //                     InputLabelProps={{
  //                       shrink: true,
  //                     }}
  //                   />
  //                 </Grid>

  //                 <Grid item xs={12} md={6}>
  //                   <Autocomplete
  //                     multiple
  //                     options={jobPreferencesOptions}
  //                     value={formData.jobPreferences} // Ensure this uses the formData value
  //                     onChange={(event, value) => setFormData({ ...formData, jobPreferences: value })}
  //                     renderInput={(params) => (
  //                       <TextField
  //                         {...params}
  //                         label="Job Preferences"
  //                         placeholder="Add Job Preferences"
  //                         error={!!fieldError.jobPreferences}
  //                         helperText={fieldError.jobPreferences}
  //                       />
  //                     )}
  //                   />
  //                 </Grid>

  //               </Grid>


  //               <Grid item xs={12} md={6}>
  //                 <ActionButton type="submit" variant="contained">
  //                   {isProfileExists ? 'Update Profile' : 'Create Profile'}
  //                 </ActionButton>
  //               </Grid>


  //               <Grid item xs={6}>
  //                 <Button
  //                   variant="contained"
  //                   style={{ backgroundColor: 'red', width: '100%', marginTop: '10px' }}
  //                   onClick={handleCancel} // Call handleCancel on click
  //                 >
  //                   Cancel
  //                 </Button>
  //               </Grid>
  //             </Grid>
  //           </Grid>
  //         </form>
  //       </ProfileContainer>
  //       <Footer />
  //     </div>

  //   );
  // };

  // export default EmployeeProfile;


  import React, { useState, useEffect } from 'react';
  import {
    Container, Grid, Button, TextField, Typography, Avatar, MenuItem,
  } from '@mui/material';
  import { Autocomplete } from '@mui/material';
  import { styled } from '@mui/system';
  import Footer from '../../components/Footer';
  import NavbarEmployee from './NavbarEmployee';
  import axios from 'axios';
  import { toast, ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

  const ProfileContainer = styled(Container)(({ theme }) => ({
    maxWidth: '90%',
    marginTop: '50px',
    backgroundColor: '#F7F9FC',
    borderRadius: '20px',
    padding: '50px',
    minHeight: '500px',
    marginBottom: '30px',
    boxShadow: '0px 10px 15px rgba(0, 0, 0, 0.1)',
  }));

  const ProfileAvatar = styled(Avatar)(({ theme }) => ({
    width: '160px',
    height: '160px',
    marginBottom: '10px',
  }));

  const UploadButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#5A5BFF',
    color: '#FFF',
    width: '100%',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#4748CC',
    },
  }));

  const ActionButton = styled(Button)(({ theme }) => ({
    backgroundColor: '#3A3B3C',
    color: '#FFF',
    width: '100%',
    marginTop: '10px',
    '&:hover': {
      backgroundColor: '#2A2B2C',
    },
  }));

  const EmployeeProfile = () => {

    const [photoPreview, setPhotoPreview] = useState('');
    const [photoFile, setPhotoFile] = useState(null);  // Store the selected photo file
    const [resumeFile, setResumeFile] = useState(null);
    const [isProfileExists, setIsProfileExists] = useState(false); // Tracks if profile exists

    const [formData, setFormData] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      degree: '',
      experience: '',
      skills: [],
      jobPreferences: [],
      dob: '',
    });

    const [fieldError, setFieldError] = useState({
      name: '',
      email: '',
      phone: '',
      address: '',
      degree: '',
      experience: '',
      dob: '',
    });

    useEffect(() => {
      const loadSessionData = () => {
          const name = sessionStorage.getItem('name');
          const email = sessionStorage.getItem('email');
          const phone = sessionStorage.getItem('phone');

          setFormData((prevData) => ({
              ...prevData,
              name: name || '',
              email: email || '',
              phone: phone || '',
          }));
      };

      const userId = sessionStorage.getItem('userId');
      console.log('userId', userId); // Replace `googleUserId` with the actual Google UID

      if (userId) {
          fetchProfile(userId, loadSessionData);
      } else {
          // Load session data directly if no userId is found
          loadSessionData();
      }
  }, []);

  const fetchProfile = async (userId, fallback) => {
      try {
          const response = await axios.get(`http://localhost:3000/Employeeprofile/profile/${userId}`);
          const profileData = response.data;
          console.log(profileData);

          if (profileData) {
              // Profile exists, update formData with the fetched profile data
              setFormData((prevData) => ({
                  ...prevData,
                  name: profileData.name || '',
                  email: profileData.email || '',
                  phone: profileData.phone || '',
                  address: profileData.address || '',
                  degree: profileData.degree || '',
                  experience: profileData.experience || '',
                  skills: Array.isArray(profileData.skills) ? profileData.skills : [],
                  jobPreferences: Array.isArray(profileData.jobPreferences) ? profileData.jobPreferences : [],
                  dob: profileData.dob ? profileData.dob.slice(0, 10) : '',
              }));
              setPhotoPreview(`http://localhost:3000/${profileData.photo}`);
              setResumePreview(`http://localhost:3000/${profileData.resume}`);
              setIsProfileExists(true);
          } else {
              // Profile does not exist, use session data as a fallback
              setIsProfileExists(false);
              fallback();
          }
      } catch (error) {
          console.error('Error fetching profile:', error);
          setIsProfileExists(false);
          fallback(); // Use session data if there's an error fetching the profile
      }
  };


    const jobPreferencesOptions = [
      'Frontend Developer', 'UI Designer', 'Backend Developer', 'Fullstack Developer',
      'Project Manager', 'Data Scientist', 'Product Designer', 'DevOps Engineer',
      'QA Engineer', 'Marketing Specialist', 'HR Manager', 'Content Writer',
    ];

    const skillOptions = [
      'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'SQL', 'AWS', 'C++', 'C#',
      'HTML', 'CSS', 'Ruby on Rails', 'PHP', 'Go', 'Kotlin', 'Swift', 'TypeScript',
      'Angular', 'Vue.js', 'Django', 'Flutter', 'Machine Learning', 'Data Science',
      'DevOps', 'Blockchain', 'Docker', 'Kubernetes', 'TensorFlow', 'R', 'Scala',
      'Unity', 'Unreal Engine',
    ];

    const handleChange = (e) => {
      const { name, value } = e.target;
      const updatedFormData = {
        ...formData,
        [name]: value,
      };

      // Reset field errors on change
      setFieldError({ ...fieldError, [name]: '' });

      // Validation logic
      switch (name) {
        case 'name':
    // Regex to check if the name contains only letters and spaces and has at least 3 letters
    if (!/^[A-Za-z\s]{3,}$/.test(value) || /(\w)\1{2,}/.test(value)) {
      setFieldError((prev) => ({ ...prev, name: 'Enter a valid Name' }));
    } else {
      // Clear error if validation passes
      setFieldError((prev) => ({ ...prev, name: '' }));
    }
    break;


        case 'email':
          const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]{2,}@[A-Za-z0-9.-]{3,}\.(com|in|org|net|edu|gov|mil|co|info|biz|me)$/;
          if (!emailRegex.test(value)) {
            setFieldError((prev) => ({ ...prev, email: 'Enter a valid email address.' }));
          }
          break;

        case 'phone':
          const phoneRegex = /^\d{10}$/; // 10-digit phone number
          const repeatedDigitsRegex = /(\d)\1{4,}/; // No more than 4 consecutive same digits
          if (!phoneRegex.test(value) || repeatedDigitsRegex.test(value)) {
            setFieldError((prev) => ({ ...prev, phone: 'Enter a valid phone number (10 digits, no more than 4 consecutive same digits).' }));
          }
          break;
    case 'address':
    // Regex to ensure it doesn't start with a digit, can contain letters, spaces, commas, parentheses, and digits
    const addressRegex = /^(?!\d)[A-Za-z\s(),]*[A-Za-z0-9\s(),]*$/; 
    const digitCount = (value.match(/\d/g) || []).length; // Count the total number of digits

    // Validate the address
    if (!addressRegex.test(value) || digitCount > 7 || value.length < 4) {
      setFieldError((prev) => ({
        ...prev,
        address: 'Enter a valid address '
      }));
    } else {
      // Clear the error if validation passes
      setFieldError((prev) => ({ ...prev, address: '' }));
    }
    break;

        case 'experience':
          if (value && (!/^\d+$/.test(value) || value < 0 || value > 50)) {
            setFieldError((prev) => ({ ...prev, experience: 'Enter a valid experience (0-50 years).' }));
          }
          break;

        case 'degree':
        case 'skills':
        case 'jobPreferences':
          if (/\d/.test(value)) {
            setFieldError((prev) => ({ ...prev, [name]: 'This field should not contain any numbers.' }));
          }
          break;

        case 'dob':
    const dob = new Date(value);
    const today = new Date();
    
    // Calculate age
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    // Minimum age validation (15 years)
    if (age < 15) {
      setFieldError((prev) => ({ ...prev, dob: 'You must be at least 15 years old.' }));
    } 
    // Maximum age validation (60 years)
    else if (age > 60) {
      setFieldError((prev) => ({ ...prev, dob: 'You must be less than 60 years old.' }));
    } 
    // Clear error if validation passes
    else {
      setFieldError((prev) => ({ ...prev, dob: '' }));
    }
    break;


        default:
          break;
      }

      setFormData(updatedFormData);
    };
    const handleCancel = () => {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        degree: '',
        experience: '',
        skills: [],
        jobPreferences: [],
        dob: '',
      });
      setPhotoPreview(''); // Reset photo preview
    };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('address', formData.address);
    data.append('degree', formData.degree);
    data.append('experience', formData.experience);
    data.append('skills', formData.skills.join(',')); // Convert array to comma-separated string
    data.append('jobPreferences', formData.jobPreferences.join(',')); // Same for jobPreferences
    data.append('dob', formData.dob);
  
    // Append photo and resume files if selected
    if (photoFile) data.append('photo', photoFile);
    if (resumeFile) data.append('resume', resumeFile);
  
    const userId = sessionStorage.getItem('userId');
    if (userId) {
        data.append('userId', userId);
  
        try {
            // Step 1: Check if phone number already exists
            const phoneCheckResponse = await axios.get('http://localhost:3000/user/checkPhoneNumber', {
                params: { phone: formData.phone },
            });
  
            // If phone number exists and belongs to another user, show error and stop
            if (phoneCheckResponse.data.exists && phoneCheckResponse.data.userId !== userId) {
                toast.error('Phone number already exists. Please use a different phone number.', {
                    position: 'top-right',
                    autoClose: 3000,
                });
                return; // Exit early if the phone number exists for another user
            }
  
            let response;
  
            // Step 2: Update or create profile
            if (isProfileExists) {
                // Update profile
                response = await axios.put(`http://localhost:3000/Employeeprofile/update/${userId}`, data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Profile updated successfully!', { position: 'top-right', autoClose: 3000 });
  
                // Update the signup database
                await axios.put(`http://localhost:3000/user/update/${userId}`, {
                    name: formData.name,
                    phone: formData.phone,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            } else {
                // Create new profile
                response = await axios.post('http://localhost:3000/Employeeprofile/create', data, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
                toast.success('Profile created successfully!', { position: 'top-right', autoClose: 3000 });
                setIsProfileExists(true); // Set to true after successful creation
  
                // Update the signup database
                await axios.put(`http://localhost:3000/user/update/${userId}`, {
                    name: formData.name,
                    phone: formData.phone,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });
            }
            console.log("Profile saved successfully:", response.data);
        } 
        
      //   catch (error) {
      //     console.error('Error saving profile:', error);
      
      //     if (error.response) {
      //         const errorMessage = error.response.data.message;
      //         console.error('Error Response:', errorMessage);
      
      //         toast.error(errorMessage || 'Error', {
      //             position: 'top-right',
      //             autoClose: 3000,
      //         });
      //     } else {
      //         console.error('Error Message:', error.message);
      //         toast.error('Failed to save profile. Please try again.', {
      //             position: 'top-right',
      //             autoClose: 3000,
      //         });
      //     }
      // }
      catch (error) {
        console.error('Error saving profile:', error);
      
        if (error.response) {
          const errorMessage = error.response.data.message || error.response.statusText;
          console.error('Error Response:', errorMessage);
      
          toast.error(errorMessage || 'Error', {
            position: 'top-right',
            autoClose: 3000,
          });
        } else {
          console.error('Error Message:', error.message);
          toast.error('Failed to save profile. Please try again.', {
            position: 'top-right',
            autoClose: 3000,
          });
        }
      }
      
    }
  };
  
      
    
    const [resumePreview, setResumePreview] = useState('');
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setResumeFile(file);  // Store the resume file in state
        setResumePreview(URL.createObjectURL(file));  // Generate preview URL
      }
    };

    return (
      <div>
        <NavbarEmployee />
        <ProfileContainer>
          <ToastContainer />
          <Typography variant="h4" align="center" color="#360275" style={{ marginBottom: '20px' }}>
            Update Employee Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4} style={{ textAlign: 'center' }}>
                <Grid container direction="column" alignItems="center">
                  <ProfileAvatar src={photoPreview} alt="Profile Photo" />
                  <Typography variant="h6">{formData.name || 'Your Name'}</Typography>
                  <input
                    accept=".jpg, .png"
                    id="photo-upload"
                    type="file"
                    style={{ display: 'none' }}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onloadend = () => setPhotoPreview(reader.result); // Set preview
                      if (file) {
                        setPhotoFile(file); // Store the file in state
                        reader.readAsDataURL(file); // Read file
                      }
                    }}
                  />
                  <label htmlFor="photo-upload">
                    <UploadButton variant="contained" component="span">
                      Upload Photo
                    </UploadButton>
                  </label>
                  <input
                    accept=".pdf, .doc, .docx"
                    id="resume-upload"
                    type="file"
                    style={{ display: 'none', marginTop: '60px' }}
                    onChange={handleFileChange}
                  />

                  <label htmlFor="resume-upload">
                    <UploadButton variant="contained" component="span">
                      Upload Resume
                    </UploadButton>
                  </label>
                </Grid>
                {resumePreview && (
                  <Grid item>
                    <Typography variant="body2" style={{ marginTop: '10px' }}>
                      <a
                        href={resumePreview}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#007bff', textDecoration: 'none' }}
                      >
                        View Resume
                      </a>
                    </Typography>
                  </Grid>
                )}
              </Grid>

              <Grid item xs={12} md={8}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Name"
                      name="name"
                      fullWidth
                      required
                      value={formData.name}
                      onChange={handleChange}
                      error={!!fieldError.name}
                      helperText={fieldError.name}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Email"
                      name="email"
                      fullWidth
                      value={formData.email}
                      onChange={handleChange}
                      error={!!fieldError.email}
                      helperText={fieldError.email}
                      InputProps={{
                        readOnly: true, // Make the email field read-only
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Phone"
                      name="phone"
                      fullWidth
                      value={formData.phone}
                      onChange={handleChange}
                      error={!!fieldError.phone}
                      helperText={fieldError.phone}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Address"
                      name="address"
                      fullWidth
                      required
                      value={formData.address}
                      onChange={handleChange}
                      error={!!fieldError.address}
                      helperText={fieldError.address}
                    />
                  </Grid>

                  {/* Qualification Dropdown */}
                  <Grid item xs={12} md={6}>
                    <TextField
                      select
                      label="Qualification"
                      name="degree"
                      fullWidth
                      required
                      value={formData.degree}
                      onChange={handleChange}
                      error={!!fieldError.degree}
                      helperText={fieldError.degree}
                      MenuProps={{
                        PaperProps: {
                          style: {
                            textAlign: 'left',
                          },
                        },
                      }}
                      sx={{ textAlign: 'left' }}
                    >
                      <MenuItem value="Associate's Degree">Associate's Degree</MenuItem>
                      <MenuItem value="Bachelor's Degree">Bachelor's Degree</MenuItem>
                      <MenuItem value="Master's Degree">Master's Degree</MenuItem>
                      <MenuItem value="PhD">PhD</MenuItem>
                      <MenuItem value="bca">BCA</MenuItem>
                      <MenuItem value="mca">MCA</MenuItem>
                      <MenuItem value="bsc computer app">BSC Compter.App</MenuItem>
                      <MenuItem value="msc computer app">MCS Computer.App</MenuItem>
                      <MenuItem value="Other">Other</MenuItem>
                    </TextField>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      label="Experience (Years)"
                      name="experience"
                      fullWidth
                      required
                      value={formData.experience}
                      onChange={handleChange}
                      error={!!fieldError.experience}
                      helperText={fieldError.experience}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={skillOptions}
                      value={formData.skills} // Ensure this uses the formData value
                      onChange={(event, value) => setFormData({ ...formData, skills: value })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Skills"
                          placeholder="Add Skills"
                          error={!!fieldError.skills}
                          helperText={fieldError.skills}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <TextField
                      type="date"
                      label="Date of Birth"
                      name="dob"
                      fullWidth
                      required
                      value={formData.dob} // Ensure this uses the formData value
                      onChange={handleChange} // Adjust to set dob directly
                      error={!!fieldError.dob}
                      helperText={fieldError.dob}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Autocomplete
                      multiple
                      options={jobPreferencesOptions}
                      value={formData.jobPreferences} // Ensure this uses the formData value
                      onChange={(event, value) => setFormData({ ...formData, jobPreferences: value })}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Job Preferences"
                          placeholder="Add Job Preferences"
                          error={!!fieldError.jobPreferences}
                          helperText={fieldError.jobPreferences}
                        />
                      )}
                    />
                  </Grid>

                </Grid>


                <Grid item xs={12} md={6}>
                  <ActionButton type="submit" variant="contained">
                    {isProfileExists ? 'Update Profile' : 'Create Profile'}
                  </ActionButton>
                </Grid>


                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    style={{ backgroundColor: 'red', width: '100%', marginTop: '10px' }}
                    onClick={handleCancel} // Call handleCancel on click
                  >
                    Cancel
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        </ProfileContainer>
        <Footer />
      </div>

    );
  };

  export default EmployeeProfile;


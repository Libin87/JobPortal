// import React, { useState, useEffect } from 'react';
// import { Container, Grid, Button, TextField, Typography } from '@mui/material';
// import Footer from '../../components/Footer';
// import axios from 'axios';
// import NavbarEmployee from './NavbarEmployee';

// const EmployeeProfile = () => {
//   const [profileData, setProfileData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     address: '',
//     position: '',
//     degree: '',
//     experience: '',
//     skills: '',
//   });

//   const [photo, setPhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState('');
//   const [resume, setResume] = useState(null);
//   const [isUpdating, setIsUpdating] = useState(false);
//   const [errors, setErrors] = useState({ email: '', phone: '' });

//   const userId = sessionStorage.getItem('userId');

//   useEffect(() => {
//     axios.get(`http://localhost:3000/employee-profile/${userId}`)
//       .then((response) => {
//         if (response.data) {
//           setProfileData({
//             name: response.data.name,
//             email: response.data.email,
//             phone: response.data.phone,
//             address: response.data.address,
//             position: response.data.position,
//             degree: response.data.degree,
//             experience: response.data.experience,
//             skills: response.data.skills,
//           });
//           setPhotoPreview(`http://localhost:3000/${response.data.photoUrl}`);
//           setIsUpdating(true);
//         }
//       })
//       .catch((error) => console.log('Error fetching employee profile:', error));
//   }, [userId]);

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData((prevData) => ({ ...prevData, [name]: value }));
//     if (name === 'email') setErrors((prev) => ({ ...prev, email: '' }));
//     if (name === 'phone') setErrors((prev) => ({ ...prev, phone: '' }));
//   };

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     setPhoto(file);
//     const reader = new FileReader();
//     reader.onloadend = () => setPhotoPreview(reader.result);
//     if (file) reader.readAsDataURL(file);
//   };

//   const handleResumeChange = (e) => {
//     const file = e.target.files[0];
//     setResume(file);
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
//       setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
//       alert('Invalid email format!');
//       return;
//     }
//     if (!/^\d+$/.test(profileData.phone)) {
//       setErrors((prev) => ({ ...prev, phone: 'Invalid phone number' }));
//       alert('Phone number must contain only digits!');
//       return;
//     }

//     const formData = new FormData();
//     Object.keys(profileData).forEach((key) => formData.append(key, profileData[key]));
//     if (photo) formData.append('photoUrl', photo);
//     if (resume) formData.append('resume', resume);

//     const url = isUpdating
//       ? `http://localhost:3000/employee-profile/update/${userId}`
//       : 'http://localhost:3000/employee-profile/create';

//     axios.post(url, formData)
//       .then((response) => {
//         const employeeData = response.data.updatedProfile || response.data.profile;
//         if (employeeData) {
//           sessionStorage.setItem('name', employeeData.name);
//           setPhotoPreview(`http://localhost:3000/${employeeData.photoUrl}`);
//           alert(`${isUpdating ? 'Updated' : 'Created'} employee profile successfully`);
//           if (!isUpdating) {
//             setIsUpdating(true);
//           }
//         } else {
//           throw new Error("Profile data is missing in the response.");
//         }
//       })
//       .catch((error) => {
//         console.log(`Error ${isUpdating ? 'updating' : 'creating'} employee profile:`, error);
//         alert(`Error ${isUpdating ? 'updating' : 'creating'} employee profile: ${error.message}`);
//       });
//   };

//   const handleCancel = () => {
//     setProfileData({
//       name: '',
//       email: '',
//       phone: '',
//       address: '',
//       position: '',
//       degree: '',
//       experience: '',
//       skills: '',
//     });
//     setPhoto(null);
//     setPhotoPreview('');
//     setResume(null);
//   };

//   return (
//     <div>
//       <NavbarEmployee />
//       <Container style={containerStyle}>
//         <Typography variant="h4" align="center" style={titleStyle}>
//           {isUpdating ? 'Update' : 'Create'} Employee Profile
//         </Typography>
//         <Container style={formContainerStyle}>
//           <form onSubmit={handleSubmit}>
//             <Grid container spacing={2}>
//               {['name', 'email', 'phone','age', 'degree', 'experience','address', 'skills'].map((field, index) => (
//                 <Grid item xs={12} md={6} key={index}>
//                   <TextField
//                     label={field.charAt(0).toUpperCase() + field.slice(1)}
//                     name={field}
//                     value={profileData[field]}
//                     onChange={handleInputChange}
//                     fullWidth
//                     required
//                     multiline={field === 'address'}
//                     rows={field === 'address' ? 4 : 1}
//                     error={!!errors[field]}
//                     helperText={errors[field]}
//                   />
//                 </Grid>
//               ))}
//               <Grid item xs={12} md={6}>
//                 <input
//                   accept="image/*"
//                   id="photo-upload"
//                   type="file"
//                   style={{ display: 'none' }}
//                   onChange={handlePhotoChange}
//                 />
//                 <label htmlFor="photo-upload">
//                   <Button variant="contained" component="span" fullWidth style={{ marginTop: '20px' }}>
//                     Upload Photo
//                   </Button>
//                 </label>
//                 {photoPreview && (
//                   <div style={{ marginTop: '20px' }}>
//                     <img
//                       src={photoPreview}
//                       alt="Employee Photo Preview"
//                       style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
//                     />
//                   </div>
//                 )}
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <input
//                   accept=".pdf, .doc, .docx"
//                   id="resume-upload"
//                   type="file"
//                   style={{ display: 'none' }}
//                   onChange={handleResumeChange}
//                 />
//                 <label htmlFor="resume-upload">
//                   <Button variant="contained" component="span" fullWidth style={{ marginTop: '20px' }}>
//                     Upload Resume
//                   </Button>
//                 </label>
//               </Grid>
//               <Grid item xs={12} container justifyContent="center" spacing={2} style={{ marginTop: '20px' }}>
//               <Grid item xs={12} md={3}>
//                   <Button
//                     variant="contained"
//                     color='error'
//                     fullWidth
//                     onClick={handleCancel}
//                   >
//                     Cancel
//                   </Button>
//                 </Grid>
//                 <Grid item xs={12} md={3}>
//                   <Button
//                     type="submit"
//                     variant="contained"
//                     fullWidth
//                     style={{ backgroundColor: 'green' }}
//                   >
//                     {isUpdating ? 'Update Profile' : 'Create Profile'}
//                   </Button>
//                 </Grid>
                
//               </Grid>
//             </Grid>
//           </form>
//         </Container>
//       </Container>
//       <Footer />
//     </div>
//   );
// };

// const containerStyle = {
//   maxWidth: '100rem',
//   marginTop: '50px',
//   backgroundColor: '#423B47',
//   borderRadius: '20px',
//   padding: '50px',
//   minHeight: '15rem',
//   marginBottom: '20px',
// };

// const titleStyle = {
//   color: 'aliceblue',
//   paddingTop: '30px',
// };

// const formContainerStyle = {
//   maxWidth: '100rem',
//   backgroundColor: 'aliceblue',
//   borderRadius: '20px',
//   padding: '50px',
//   minHeight: '35rem',
//   marginBottom: '20px',
// };
// export default EmployeeProfile;


import React, { useState, useEffect } from 'react';
import { Container, Grid, Button, TextField, Typography, Avatar } from '@mui/material';
import { styled } from '@mui/system';
import Footer from '../../components/Footer';
import axios from 'axios';
import NavbarEmployee from './NavbarEmployee';

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

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: '360275',
  fontWeight: 'bold',
  marginBottom: '20px',
}));

const ProfilePicContainer = styled('div')(({ theme }) => ({
  textAlign: 'center',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center', // Center horizontally
  justifyContent: 'center',
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  width: '160px',
  height: '160px',
  marginLeft:'40',
  marginBottom: '10px',
}));

const ProfileInput = styled(TextField)(({ theme }) => ({
  marginBottom: '20px',
  width: '100%',
  '& label.Mui-focused': {
    color: '#3A3B3C',
  },
  '& .MuiOutlinedInput-root': {
    '&.Mui-focused fieldset': {
      borderColor: '#3A3B3C',
    },
  },
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
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    position: '',
    degree: '',
    experience: '',
    skills: '',
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [resume, setResume] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [errors, setErrors] = useState({ email: '', phone: '' });

  const userId = sessionStorage.getItem('userId');

  useEffect(() => {
    axios.get(`http://localhost:3000/employee-profile/${userId}`)
      .then((response) => {
        if (response.data) {
          setProfileData({
            name: response.data.name,
            email: response.data.email,
            phone: response.data.phone,
            address: response.data.address,
            position: response.data.position,
            degree: response.data.degree,
            experience: response.data.experience,
            skills: response.data.skills,
          });
          setPhotoPreview(`http://localhost:3000/${response.data.photoUrl}`);
          setIsUpdating(true);
        }
      })
      .catch((error) => console.log('Error fetching employee profile:', error));
  }, [userId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
    if (name === 'email') setErrors((prev) => ({ ...prev, email: '' }));
    if (name === 'phone') setErrors((prev) => ({ ...prev, phone: '' }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    const reader = new FileReader();
    reader.onloadend = () => setPhotoPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    setResume(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      setErrors((prev) => ({ ...prev, email: 'Invalid email' }));
      alert('Invalid email format!');
      return;
    }
    if (!/^\d+$/.test(profileData.phone)) {
      setErrors((prev) => ({ ...prev, phone: 'Invalid phone number' }));
      alert('Phone number must contain only digits!');
      return;
    }

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => formData.append(key, profileData[key]));
    if (photo) formData.append('photoUrl', photo);
    if (resume) formData.append('resume', resume);

    const url = isUpdating
      ? `http://localhost:3000/employee-profile/update/${userId}`
      : 'http://localhost:3000/employee-profile/create';

    axios.post(url, formData)
      .then((response) => {
        const employeeData = response.data.updatedProfile || response.data.profile;
        if (employeeData) {
          sessionStorage.setItem('name', employeeData.name);
          setPhotoPreview(`http://localhost:3000/${employeeData.photoUrl}`);
          alert(`${isUpdating ? 'Updated' : 'Created'} employee profile successfully`);
          if (!isUpdating) {
            setIsUpdating(true);
          }
        } else {
          throw new Error("Profile data is missing in the response.");
        }
      })
      .catch((error) => {
        console.log(`Error ${isUpdating ? 'updating' : 'creating'} employee profile:`, error);
        alert(`Error ${isUpdating ? 'updating' : 'creating'} employee profile: ${error.message}`);
      });
  };

  const handleCancel = () => {
    setProfileData({
      name: '',
      email: '',
      phone: '',
      address: '',
      position: '',
      degree: '',
      experience: '',
      skills: '',
    });
    setPhoto(null);
    setPhotoPreview('');
    setResume(null);
  };

  return (
    <div>
      <NavbarEmployee />
      <ProfileContainer>
        <SectionTitle variant="h4" align="center" color='#360275'>
          {isUpdating ? 'Update' : 'Create'} Employee Profile
        </SectionTitle>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <ProfilePicContainer>
              <Typography variant="h5" align="center" style={{ marginBottom: '10px' }}>
                {profileData.name || 'Your Name'}
              </Typography>
              <ProfileAvatar align="center" src={photoPreview} alt="Profile Photo" />
              <input
                accept="image/*"
                id="photo-upload"
                type="file"
                style={{ display: 'none', marginLeft:'60px' }}
                onChange={handlePhotoChange}
              />
              <label htmlFor="photo-upload">
                <UploadButton variant="contained" component="span" >
                  Upload Photo
                </UploadButton>
              </label>
              <br />
              <input
                accept=".pdf, .doc, .docx"
                id="resume-upload"
                type="file"
                style={{ display: 'none', marginTop:'50px' }}
                onChange={handleResumeChange}
              />
              <label htmlFor="resume-upload">
                <UploadButton variant="contained" component="span" style={{ marginTop: '10px' ,marginTop:'50px'}} >
                  Upload Resume
                </UploadButton>
              </label>
            </ProfilePicContainer>
          </Grid>

          {/* Second Component: Profile Information */}
          <Grid item xs={12} md={8}>
            <Grid container spacing={2}>
              {['name', 'email', 'phone', 'address', 'position', 'degree', 'experience', 'skills'].map((field, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <ProfileInput
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    name={field}
                    value={profileData[field]}
                    onChange={handleInputChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              ))}
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2} alignContent={'center'}>
                <Grid item xs={6} sm={3}>
                  <ActionButton variant="cancel" onClick={handleCancel} style={{ backgroundColor: 'red' }}>
                    Cancel
                  </ActionButton>
                </Grid>
                <Grid item xs={6} sm={3}>
                  <ActionButton variant="contained" onClick={handleSubmit} style={{ backgroundColor: 'green' }}>
                    {isUpdating ? 'Update Profile' : 'Create Profile'}
                  </ActionButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </ProfileContainer>
      <Footer />
    </div>
  );
};

export default EmployeeProfile;

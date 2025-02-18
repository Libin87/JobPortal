import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, TablePagination } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';
import Navbar from '../../components/Navbar';
import NavbarAdmin from './NavbarAdmin';

const AdminApplicants = () => {
  const [applicants, setApplicants] = useState([]);
  const [userToken, setUserToken] = useState(sessionStorage.getItem('userToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(7);

  const fetchApplicants = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/apply/${userToken}`);
      const applicantsData = response.data;
      setApplicants(applicantsData);
    } catch (error) {
      console.error('Error fetching applicants data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, []);

  const handleApprove = (applicantId) => {
    axios
      .put(`http://localhost:5000/api/apply/${applicantId}`, { approved: true })
      .then((response) => {
        console.log('Applicant approved successfully:', response.data);
        fetchApplicants();
      })
      .catch((error) => {
        console.error('Error approving applicant:', error);
      });
  };

  const handleReject = (applicantId) => {
    axios
      .put(`http://localhost:5000/api/apply/${applicantId}`, { approved: false })
      .then((response) => {
        console.log('Applicant rejected successfully:', response.data);
        fetchApplicants();
      })
      .catch((error) => {
        console.error('Error rejecting applicant:', error);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <div>
      <NavbarAdmin style={{ marginBottom: '20px' }} />
      <Container style={{ backgroundColor: '#423B47', marginBottom: '30px', borderRadius: '50px', maxWidth: '84.5%' }}>
        <h2 style={{ textAlign: 'center', fontWeight: 'bolder', marginTop: '40px', backgroundColor: '', color: 'white' }}>ADMIN REVIEW - JOB APPLICANTS</h2>
      </Container>
      <Container>
        <TableContainer
          component={Paper}
          style={{
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px', backgroundColor: '' }}>
              <CircularProgress style={{ color: "#360275" }} />
            </div>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', color: 'aliceblue' }}>SL No</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue' }}>Job Title</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue' }}>Applicant Name</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue' }}>Phone Number</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue' }}>Resume Link</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue', textAlign: 'center' }}>Actions</TableCell>
                  <TableCell style={{ backgroundColor: '#360275', fontWeight: 'bold', width: '', color: 'aliceblue' }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {applicants.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((applicant, index) => (
                  <TableRow key={applicant._id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{applicant.jobTitle}</TableCell>
                    <TableCell>{applicant.name}</TableCell>
                    <TableCell>{applicant.phone}</TableCell>
                    <TableCell style={{ maxWidth: '10rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {applicant.resumeLink}
                    </TableCell>
                    <TableCell style={{ textAlign: 'center' }}>
                      <div>
                        <FontAwesomeIcon
                          icon={faCheck}
                          style={{ cursor: 'pointer', color: 'green', marginRight: '10px' }}
                          onClick={() => handleApprove(applicant._id)}
                        />
                        <FontAwesomeIcon
                          icon={faTimes}
                          style={{ cursor: 'pointer', color: 'darkred' }}
                          onClick={() => handleReject(applicant._id)}
                        />
                      </div>
                    </TableCell>
                    <TableCell style={{ fontWeight: 'bold', color: applicant.approved ? 'green' : 'red', textAlign: 'center', padding: '0.5px', borderRadius: '50px' }}>
                      {applicant.approved ? 'Approved' : 'Rejected'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </TableContainer>
        <TablePagination
          component="div"
          count={applicants.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[7]}
          sx={{
            '.MuiTablePagination-selectLabel, .MuiTablePagination-select, .MuiTablePagination-selectIcon': {
              display: 'none',
            },
          }}
        />
      </Container>
    </div>
  );
};

export default AdminApplicants;


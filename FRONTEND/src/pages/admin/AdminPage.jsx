import React from 'react'
import { Button, Container } from 'react-bootstrap'
import { Grid } from '@mui/material'
import { Link } from 'react-router-dom'

const Adminpage = () => {
  return (
    <div>
      <Container style={{ maxWidth: '100em',minHeight:'15rem', marginTop: '50px', backgroundColor: 'aliceblue', borderRadius: '20px', paddingLeft: '100px', paddingRight: '100px' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 'bolder' }}>Job dashboard</h1>
        </div>
        <br /><br />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/AddJobs"> 
              <Button variant="contained" color="primary" fullWidth>
                Add a Job
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
            <Link to="/ApprovedJobs">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'darkseagreen' }}>
                APPROVED JOBS
              </Button>
            </Link>
          </Grid>
          <Grid item xs={12} sm={3} md={3}>
            <Link to="/Applicants">
              <Button variant="contained" fullWidth style={{ backgroundColor: 'midnightblue' }}>
                Applicants
              </Button>
            </Link>
          </Grid>
        </Grid>
      </Container>
    </div>
  )
}

export default Adminpage
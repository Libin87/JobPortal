import React from 'react';
import { Card, CardContent, Typography, Container, Grid } from '@mui/material';

const JobCard = ({ job }) => {
  return (
    <Card sx={{ minWidth: 275, marginBottom: 2 }}>
      <CardContent>
        <Typography variant="h5" component="div">
          {job.title}
        </Typography>
        <Typography color="text.secondary">
          {job.company}
        </Typography>
        <Typography variant="body2">
          {job.description}
        </Typography>
        <Typography sx={{ mt: 1.5 }} color="text.secondary">
          {job.location}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Viewjob = ({ jobs }) => {
  return (
    <Container>
      <Grid container spacing={3}>
        {jobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <JobCard job={job} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Viewjob;

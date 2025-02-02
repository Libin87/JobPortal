import React, { useState } from 'react';
import { TextField, Button, Box, Card, CardContent, Typography } from '@mui/material';

const JobSearchPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobs, setFilteredJobs] = useState(jobs);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const results = jobs.filter((job) =>
      job.title.toLowerCase().includes(query) || job.company.toLowerCase().includes(query)
    );
    setFilteredJobs(results);
  };

  return (
    <Box
      sx={{
        padding: 4,
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <Typography variant="h4" textAlign="center" marginBottom={4}>
        Job Search Portal
      </Typography>

      {/* Search Field */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 4,
        }}
      >
        <TextField
          label="Search for jobs"
          variant="outlined"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          sx={{ maxWidth: 600, marginRight: 2, backgroundColor: '#fff' }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{
            padding: '10px 20px',
            backgroundColor: '#360275',
            '&:hover': {
              backgroundColor: '#27015a',
            },
          }}
        >
          Search
        </Button>
      </Box>

      {/* Job Results */}
      <Box
        sx={{
          display: 'grid',
          gap: 2,
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        }}
      >
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id} sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" fontWeight="bold">
                  {job.title}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  {job.company}
                </Typography>
                <Typography variant="body2">{job.description}</Typography>
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="h6" textAlign="center" color="text.secondary">
            No jobs found for your search query.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

// Mock Job Data
const jobs = [
  {
    id: 1,
    title: 'Software Engineer',
    company: 'TechCorp',
    description: 'Develop and maintain software applications.',
  },
  {
    id: 2,
    title: 'UI/UX Designer',
    company: 'Designify',
    description: 'Create user-friendly and visually appealing designs.',
  },
  {
    id: 3,
    title: 'Data Analyst',
    company: 'DataGenics',
    description: 'Analyze and interpret complex data sets.',
  },
  {
    id: 4,
    title: 'Marketing Specialist',
    company: 'MarketEase',
    description: 'Develop and execute marketing campaigns.',
  },
];

export default JobSearchPage;

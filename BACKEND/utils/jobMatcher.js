const { spawn } = require('child_process');
const path = require('path');

class JobMatcher {
  async matchJobs(inputData) {
    console.log('Starting job matching in Node.js layer');
    console.log('Input data:', JSON.stringify(inputData, null, 2));

    return new Promise((resolve, reject) => {
      try {
        const pythonProcess = spawn('python', [path.join(__dirname, '../job_matcher.py')]);
        let resultData = '';
        let errorData = '';

        // Send input data to Python script
        pythonProcess.stdin.write(JSON.stringify(inputData));
        pythonProcess.stdin.end();

        // Collect data from Python script
        pythonProcess.stdout.on('data', (data) => {
          console.log('Python output:', data.toString());
          resultData += data.toString();
        });

        // Collect error data
        pythonProcess.stderr.on('data', (data) => {
          console.log('Python debug:', data.toString());
          errorData += data.toString();
        });

        // Handle process completion
        pythonProcess.on('close', (code) => {
          if (code !== 0) {
            console.error('Python process error:', errorData);
            reject(new Error(`Job matching process failed: ${errorData}`));
            return;
          }

          try {
            // Clean the resultData before parsing
            const cleanedData = resultData.trim();
            console.log('Raw result data:', cleanedData);
            
            if (!cleanedData) {
              reject(new Error('No data received from Python script'));
              return;
            }

            // Parse the final result
            const matches = JSON.parse(cleanedData);
            
            if (!Array.isArray(matches)) {
              reject(new Error('Invalid data format received from Python script'));
              return;
            }

            console.log(`Processed ${matches.length} job matches`);
            resolve(matches);
          } catch (error) {
            console.error('Error parsing matches:', error);
            console.error('Raw result data:', resultData);
            reject(new Error(`Failed to parse job matches: ${error.message}`));
          }
        });

        // Handle process errors
        pythonProcess.on('error', (error) => {
          console.error('Error spawning Python process:', error);
          reject(error);
        });

      } catch (error) {
        console.error('Error in job matching:', error);
        reject(error);
      }
    });
  }

  // Fallback matching method if Python script fails
  fallbackMatch(inputData) {
    try {
      const { skills, experience, jobPreferences, jobs } = inputData;

      return jobs.map(job => {
        let score = 0;
        let matchReasons = [];

        // Skills matching (40% weight)
        const skillsScore = this.calculateSkillsScore(skills, job.skills);
        score += skillsScore * 0.4;

        // Experience matching (30% weight)
        const expScore = this.calculateExperienceScore(experience, job.experience);
        score += expScore * 0.3;

        // Job preferences matching (30% weight)
        const prefScore = this.calculatePreferenceScore(jobPreferences, job.jobType);
        score += prefScore * 0.3;

        return {
          id: job._id,
          title: job.jobTitle,
          companyName: job.companyName,
          location: job.location,
          salary: job.salary,
          jobType: job.jobType,
          description: job.jobDescription,
          requiredSkills: job.skills,
          requiredExperience: job.experience,
          qualifications: job.qualifications,
          score: score,
          skillScore: skillsScore,
          experienceScore: expScore,
          preferenceScore: prefScore,
          matchReasons
        };
      }).filter(job => job.score > 0.5);
    } catch (error) {
      console.error('Error in fallback matching:', error);
      throw error;
    }
  }

  calculateSkillsScore(userSkills, jobSkills) {
    if (!Array.isArray(userSkills) || !Array.isArray(jobSkills)) return 0;
    
    const normalizedUserSkills = userSkills.map(s => s.toLowerCase().trim());
    const normalizedJobSkills = jobSkills.map(s => s.toLowerCase().trim());
    
    const matchedSkills = normalizedUserSkills.filter(skill => 
      normalizedJobSkills.some(jobSkill => 
        jobSkill.includes(skill) || skill.includes(jobSkill)
      )
    );

    return matchedSkills.length / Math.max(normalizedJobSkills.length, 1);
  }

  calculateExperienceScore(userExp, jobExp) {
    const userMonths = (userExp.years || 0) * 12 + (userExp.months || 0);
    const jobMonths = (jobExp?.years || 0) * 12 + (jobExp?.months || 0);
    
    if (jobMonths === 0) return 1; // No experience required
    if (userMonths >= jobMonths) return 1; // Meets or exceeds requirements
    
    const diff = Math.abs(jobMonths - userMonths);
    if (diff <= 12) return 0.8; // Within 1 year
    if (diff <= 24) return 0.6; // Within 2 years
    if (diff <= 36) return 0.4; // Within 3 years
    return 0.2;
  }

  calculatePreferenceScore(preferences, jobType) {
    if (!Array.isArray(preferences) || !preferences.length || !jobType) return 0.5;
    
    const jobTypeLower = jobType.toLowerCase();
    let maxScore = 0;

    for (const pref of preferences) {
      const prefLower = pref.toLowerCase();
      if (jobTypeLower.includes(prefLower) || prefLower.includes(jobTypeLower)) {
        return 1;
      }
      // Check for partial matches
      const prefWords = prefLower.split(' ');
      const typeWords = jobTypeLower.split(' ');
      const hasPartialMatch = prefWords.some(word => 
        typeWords.some(typeWord => typeWord.includes(word) || word.includes(typeWord))
      );
      if (hasPartialMatch) maxScore = Math.max(maxScore, 0.5);
    }

    return maxScore;
  }
}

module.exports = new JobMatcher(); 
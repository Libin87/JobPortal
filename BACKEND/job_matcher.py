from transformers import DistilBertTokenizer, DistilBertModel
import torch
import json
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class JobMatcher:
    def __init__(self):
        self.tokenizer = DistilBertTokenizer.from_pretrained('distilbert-base-uncased')
        self.model = DistilBertModel.from_pretrained('distilbert-base-uncased')
        
        # Define qualification mappings for better matching
        self.qualification_mappings = {
            'phd': ['phd', 'ph.d', 'ph.d.', 'doctorate', 'doctor of philosophy'],
            'masters': ['masters', "master's", 'master', 'msc', 'm.sc', 'm.tech', 'mca'],
            'bachelors': ['bachelors', "bachelor's", 'bachelor', 'bsc', 'b.sc', 'b.tech', 'bca'],
            'diploma': ['diploma', 'certificate']
        }
        
        # Define qualification levels
        self.qualification_levels = {
            'phd': 4,
            'masters': 3,
            'bachelors': 2,
            'diploma': 1
        }

    def encode_text(self, text):
        inputs = self.tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=512)
        outputs = self.model(**inputs)
        return outputs.last_hidden_state.mean(dim=1).detach().numpy()

    def calculate_skill_match(self, profile_skills, job_skills):
        """
        Calculate skill match with role-specific weighting
        Returns tuple of (score, matched_skills, unmatched_skills)
        """
        if not profile_skills or not job_skills:
            return 0.0, [], job_skills
        
        profile_skills = [skill.lower() for skill in profile_skills]
        job_skills = [skill.lower() for skill in job_skills]
        
        # Find exact matches
        matched_skills = [skill for skill in job_skills if skill in profile_skills]
        unmatched_skills = [skill for skill in job_skills if skill not in profile_skills]
        exact_match_score = len(matched_skills) / len(job_skills)
        
        # Calculate match percentage
        match_percentage = (len(matched_skills) / len(job_skills)) * 100
        
        # Calculate final score
        if match_percentage == 100:
            return 1.0, matched_skills, []
        elif match_percentage >= 75:
            return 0.8, matched_skills, unmatched_skills
        elif match_percentage >= 50:
            return 0.6, matched_skills, unmatched_skills
        elif match_percentage >= 25:
            return 0.4, matched_skills, unmatched_skills
        else:
            return 0.2, matched_skills, unmatched_skills

    def calculate_experience_match(self, profile_exp, job_exp):
        """
        Calculate experience match score and provide a reason
        Returns tuple of (score, reason)
        """
        years = profile_exp.get('years', 0)
        months = profile_exp.get('months', 0)
        required_years = job_exp.get('years', 0)
        required_months = job_exp.get('months', 0)
        
        # Convert to total months for comparison
        total_profile_months = (years * 12) + months
        total_required_months = (required_years * 12) + required_months

        # Check if experience is 0 years and 0 months
        if years == 0 and months == 0:
            if total_required_months == 0:
                return 1.0, "Entry level position - No experience required"
            else:
                return 0.0, f"No experience - Position requires {required_years}y {required_months}m"
        
        # Check if meets or exceeds requirements
        elif years >= required_years and (years > required_years or months >= required_months):
            return 1.0, "Perfect experience match"
        
        # Allow slight flexibility (within 1 year)
        elif years >= required_years - 1:
            return 0.8, f"Close experience match - Have: {years}y {months}m, Required: {required_years}y {required_months}m"
        
        # Insufficient experience
        else:
            percentage = total_profile_months / total_required_months if total_required_months > 0 else 0
            return percentage * 0.5, f"Insufficient experience - Have: {years}y {months}m, Required: {required_years}y {required_months}m"

    def normalize_job_title(self, title):
        """Normalize job titles for better matching"""
        # Remove special characters and convert to lowercase
        normalized = title.lower().replace('-', ' ').replace('_', ' ')
        
        # Define common job title variations
        job_mappings = {
            'frontend developer': ['frontend developer', 'front end developer', 'front-end developer', 'ui developer', 'react developer', 'vue developer', 'angular developer'],
            'ui designer': ['ui designer', 'user interface designer', 'ux designer', 'ui/ux designer', 'ui ux designer', 'visual designer'],
            'backend developer': ['backend developer', 'back end developer', 'back-end developer', 'server-side developer', 'api developer', 'node.js developer', 'django developer', 'flask developer'],
            'fullstack developer': ['fullstack developer', 'full stack developer', 'full-stack developer', 'full stack engineer', 'full-stack engineer', 'mern stack developer', 'mean stack developer'],
            'project manager': ['project manager', 'technical project manager', 'it project manager', 'agile project manager', 'scrum master'],
            'data scientist': ['data scientist', 'datascientist', 'data science', 'ds', 'machine learning scientist', 'data analyst'],
            'product designer': ['product designer', 'ui designer', 'ux designer', 'ui/ux designer', 'ui ux designer', 'interaction designer'],
            'devops engineer': ['devops engineer', 'site reliability engineer', 'sre', 'cloud devops engineer', 'devsecops engineer'],
            'qa engineer': ['qa engineer', 'quality assurance engineer', 'software tester', 'test engineer', 'automation tester', 'manual tester'],
            'marketing specialist': ['marketing specialist', 'digital marketing specialist', 'marketing analyst', 'growth hacker', 'seo specialist'],
            'hr manager': ['hr manager', 'human resources manager', 'talent acquisition manager', 'hr business partner'],
            'content writer': ['content writer', 'copywriter', 'technical writer', 'blog writer', 'editor'],
            'software engineer': ['software engineer', 'software developer', 'application developer', 'software programmer'],
            'cybersecurity analyst': ['cybersecurity analyst', 'security analyst', 'information security analyst', 'cyber analyst'],
            'cloud engineer': ['cloud engineer', 'cloud architect', 'cloud solutions engineer', 'aws engineer', 'azure engineer', 'gcp engineer'],
            'ai engineer': ['ai engineer', 'artificial intelligence engineer', 'ai researcher', 'deep learning engineer'],
            'machine learning engineer': ['machine learning engineer', 'ml engineer', 'ai/ml engineer', 'deep learning engineer'],
            'business analyst': ['business analyst', 'ba', 'business intelligence analyst', 'bi analyst'],
            'blockchain developer': ['blockchain developer', 'crypto developer', 'web3 developer', 'smart contract developer'],
            'game developer': ['game developer', 'game programmer', 'unity developer', 'unreal engine developer'],
            'embedded systems engineer': ['embedded systems engineer', 'firmware engineer', 'hardware engineer'],
            'mobile app developer': ['mobile app developer', 'android developer', 'ios developer', 'flutter developer', 'react native developer'],
            'systems administrator': ['systems administrator', 'sysadmin', 'system admin', 'it administrator'],
            'network engineer': ['network engineer', 'network administrator', 'network security engineer'],
            'seo specialist': ['seo specialist', 'search engine optimization specialist', 'seo analyst'],
            'digital marketer': ['digital marketer', 'online marketer', 'social media marketer'],
            'it support specialist': ['it support specialist', 'helpdesk technician', 'technical support engineer'],
            'technical writer': ['technical writer', 'documentation specialist', 'tech writer'],
            'e-commerce manager': ['e-commerce manager', 'ecommerce strategist', 'ecommerce specialist'],
            'it consultant': ['it consultant', 'technology consultant', 'business technology consultant'],
            'scrum master': ['scrum master', 'agile coach', 'scrum lead'],
            'solution architect': ['solution architect', 'software architect', 'enterprise architect'],
            'salesforce developer': ['salesforce developer', 'salesforce engineer', 'crm developer'],
            'sap consultant': ['sap consultant', 'sap functional consultant', 'sap basis consultant'],
            'big data engineer': ['big data engineer', 'data engineer', 'hadoop engineer'],
            'iot engineer': ['iot engineer', 'internet of things engineer', 'embedded iot developer']
        }
        
        # Check for matches in mappings
        for standard, variations in job_mappings.items():
            if any(var in normalized for var in variations):
                return standard
            
        return normalized

    def calculate_preference_match(self, profile_preferences, job_type):
        """Calculate job preference match using semantic matching"""
        if not profile_preferences or not job_type:
            return 0.0, "No job preference specified"
        
        # Normalize job type
        normalized_job_type = self.normalize_job_title(job_type)
        
        # Normalize and check each preference
        for pref in profile_preferences:
            normalized_pref = self.normalize_job_title(pref)
            
            # Direct match
            if normalized_pref == normalized_job_type:
                return 1.0, f"✓ Matches your preferred role: {pref}"
            
            # Check related roles
            if self.are_roles_related(normalized_pref, normalized_job_type):
                return 0.7, f"✓ Related to your preferred role: {pref}"
        
        return 0.0, f"This job type ({job_type}) doesn't match your preferences"

    def are_roles_related(self, role1, role2):
        """Check if two roles are related"""
        related_roles = {
            'frontend developer': ['ui developer', 'web developer', 'javascript developer'],
            'backend developer': ['api developer', 'server developer', 'python developer'],
            'fullstack developer': ['web developer', 'software engineer', 'frontend developer', 'backend developer'],
            'data scientist': ['data analyst', 'machine learning engineer', 'ai engineer'],
            'product designer': ['ui designer', 'ux designer', 'web designer']
        }
        
        # Check if roles are in related groups
        for main_role, related in related_roles.items():
            if (role1 in [main_role] + related and role2 in [main_role] + related):
                return True
            
        return False

    def normalize_qualification(self, qualification):
        """Normalize qualification text for better matching"""
        if not qualification:
            return None
        
        qual = qualification.lower().strip()
        
        # Standardize common variations
        qual = qual.replace("'s", "s")  # Convert Master's to Masters
        qual = qual.replace("master's", "masters")
        qual = qual.replace("bachelor's", "bachelors")
        qual = qual.replace("phd", "ph.d")
        qual = qual.replace("ph.d.", "ph.d")
        qual = qual.replace("doctorate", "ph.d")
        
        # Check each qualification type
        for std_qual, variants in self.qualification_mappings.items():
            if any(variant in qual for variant in variants):
                # Extract field if present
                fields = ['computer science', 'engineering', 'technology', 'it', 'information technology']
                for field in fields:
                    if field in qual:
                        return f"{std_qual} in {field}"
                return std_qual
        
        return qual

    def calculate_qualification_match(self, profile_qualifications, job_qualifications):
        """Calculate qualification match using semantic matching"""
        print(f"Checking qualifications - Profile: {profile_qualifications}, Job: {job_qualifications}", file=sys.stderr)
        
        if not job_qualifications:
            return 1.0, "No specific qualification requirements"
        
        if not profile_qualifications:
            return 0.0, f"Required qualifications: {', '.join(job_qualifications)}"

        # Ensure we're working with lists
        if isinstance(profile_qualifications, str):
            profile_qualifications = [profile_qualifications]
        if isinstance(job_qualifications, str):
            job_qualifications = [job_qualifications]
        
        # Normalize all qualifications
        norm_profile_quals = [self.normalize_qualification(q) for q in profile_qualifications if q]
        norm_job_quals = [self.normalize_qualification(q) for q in job_qualifications if q]
        
        print(f"Normalized qualifications - Profile: {norm_profile_quals}, Job: {norm_job_quals}", file=sys.stderr)
        
        # Get highest qualification level from profile
        profile_levels = [self.qualification_levels.get(self.normalize_qualification(q), 0) 
                         for q in profile_qualifications]
        max_profile_level = max(profile_levels) if profile_levels else 0
        
        # Check for matches
        for job_qual in norm_job_quals:
            for profile_qual in norm_profile_quals:
                # Direct match
                if profile_qual and job_qual and (
                    profile_qual.lower() == job_qual.lower() or
                    any(variant.lower() in profile_qual.lower() for variant in self.qualification_mappings.get(job_qual.lower(), []))
                ):
                    return 1.0, f"✓ Qualified with {profile_qual}"
                
                # Check if profile qualification is higher level
                profile_level = self.qualification_levels.get(profile_qual.split()[0].lower(), 0)
                job_level = self.qualification_levels.get(job_qual.split()[0].lower(), 0)
                if profile_level > job_level:
                    return 1.0, f"✓ Overqualified with {profile_qual}"
        
        return 0.0, f"Required qualifications: {', '.join(job_qualifications)}"

    def generate_match_reasons(self, skills_score, experience_score, preference_score, job):
        reasons = []
        
        # Add skill match reasons
        if skills_score > 0.8:
            reasons.append("Strong skill match")
        elif skills_score > 0.5:
            reasons.append("Good skill match")
        elif skills_score > 0.3:
            reasons.append("Some matching skills")
        
        # Add experience match reasons
        if experience_score > 0.8:
            reasons.append("Experience level is an excellent match")
        elif experience_score > 0.5:
            reasons.append("Experience level is suitable")
        else:
            required_years = job.get('experience', {}).get('years', 0)
            required_months = job.get('experience', {}).get('months', 0)
            reasons.append(f"Required experience: {required_years}y {required_months}m")
        
        # Add preference match reasons
        if preference_score > 0.8:
            reasons.append("Matches your job preferences")
        elif preference_score > 0.5:
            reasons.append("Partially matches your preferences")
        
        return reasons

    def match_jobs(self, data):
        try:
            print("Starting job matching process...", file=sys.stderr)
            
            if not data:
                print("Error: No input data received", file=sys.stderr)
                return json.dumps([])

            # Extract all input data with validation
            resume_text = data.get('resumeText', '')
            ats_score = float(data.get('atsScore', 0))
            profile_skills = data.get('skills', [])
            profile_exp = data.get('experience', {})
            profile_preferences = data.get('jobPreferences', [])
            profile_qualifications = data.get('qualifications', [])
            jobs = data.get('jobs', [])

            if not jobs:
                print("No jobs to process", file=sys.stderr)
                return json.dumps([])

            job_scores = []
            processed_count = 0

            for job in jobs:
                try:
                    if not job.get('id'):
                        print(f"Skipping job due to missing ID", file=sys.stderr)
                        continue

                    # Calculate scores
                    skill_score, matched_skills, unmatched_skills = self.calculate_skill_match(
                        profile_skills, 
                        job.get('requiredSkills', [])
                    )
                    print(f"Skills Match: {skill_score * 100}%", file=sys.stderr)
                    print(f"Matched Skills: {matched_skills}", file=sys.stderr)
                    print(f"Unmatched Skills: {unmatched_skills}", file=sys.stderr)
                    
                    exp_score, exp_reason = self.calculate_experience_match(
                        profile_exp, 
                        job.get('requiredExperience', {})
                    )
                    print(f"Experience Match: {exp_score * 100}%", file=sys.stderr)
                    print(f"Experience Reason: {exp_reason}", file=sys.stderr)
                    
                    pref_score, pref_reason = self.calculate_preference_match(
                        profile_preferences,
                        job.get('jobType', '')
                    )
                    print(f"Preference Match: {pref_score * 100}%", file=sys.stderr)
                    
                    qual_score, qual_reason = self.calculate_qualification_match(
                        profile_qualifications,
                        job.get('qualifications', [])
                    )
                    print(f"Qualification Match: {qual_score * 100}%", file=sys.stderr)
                    
                    # Calculate ATS score match
                    min_ats_score = job.get('minimumAtsScore', 0)
                    ats_match_score = 1.0 if ats_score >= min_ats_score else (ats_score / min_ats_score if min_ats_score > 0 else 0.5)
                    print(f"ATS Score: {ats_match_score * 100}%", file=sys.stderr)
                    
                    # Calculate resume relevance
                    resume_relevance = 0.5
                    if resume_text and job.get('description'):
                        try:
                            resume_embedding = self.encode_text(resume_text)
                            job_embedding = self.encode_text(job['description'])
                            resume_relevance = float(cosine_similarity(resume_embedding, job_embedding)[0][0])
                        except Exception as e:
                            print(f"Error calculating resume relevance: {e}", file=sys.stderr)
                    print(f"Resume Relevance: {resume_relevance * 100}%", file=sys.stderr)

                    # Calculate final score
                    final_score = (
                        skill_score * 0.30 +
                        exp_score * 0.20 +
                        pref_score * 0.10 +
                        qual_score * 0.15 +
                        ats_match_score * 0.15 +
                        resume_relevance * 0.10
                    )
                    print(f"Final Score: {final_score * 100}%", file=sys.stderr)
                    
                    # Ensure all scores are valid numbers
                    final_score = max(0, min(1, final_score))  # Clamp between 0 and 1
                    
                    job_match = {
                        'id': job['id'],
                        'title': job.get('title', ''),
                        'companyName': job.get('companyName', ''),
                        'location': job.get('location', 'N/A'),
                        'salary': job.get('salary', 'N/A'),
                        'experience': job.get('requiredExperience', {'years': 0, 'months': 0}),
                        'logoUrl': job.get('logoUrl', ''),
                        'jobType': job.get('jobType', ''),
                        'score': final_score,
                        'skillScore': skill_score,
                        'experienceScore': exp_score,
                        'preferenceScore': pref_score,
                        'qualificationScore': qual_score,
                        'atsMatchScore': ats_match_score,
                        'resumeRelevance': resume_relevance,
                        'matchedSkills': matched_skills,
                        'requiredSkills': job.get('requiredSkills', [])
                    }
                    
                    job_scores.append(job_match)
                    processed_count += 1

                except Exception as e:
                    print(f"Error processing job: {str(e)}", file=sys.stderr)
                    continue

            # Sort job_scores by final_score in descending order
            job_scores.sort(key=lambda x: x['score'], reverse=True)
            
            print(f"Successfully processed {processed_count} jobs", file=sys.stderr)
            # Only print the JSON result to stdout
            result = json.dumps(job_scores)
            sys.stdout.write(result)
            sys.stdout.flush()
            return result

        except Exception as e:
            print(f"Error in match_jobs: {str(e)}", file=sys.stderr)
            return json.dumps([])

if __name__ == "__main__":
    try:
        input_data = json.loads(sys.stdin.read())
        matcher = JobMatcher()
        result = matcher.match_jobs(input_data)
        # Don't print result here as it's already printed in match_jobs
        sys.stdout.flush()
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        print(f"Error in job matcher main: {str(e)}", file=sys.stderr)
        sys.exit(1)

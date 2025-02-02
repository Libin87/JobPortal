const mongoose = require('mongoose');
const QuestionBank = require('../model/questionBank');

const sampleQuestions = [
    // Level 1 (Easy)
    {
      question: "What does HTML stand for?",
      options: ["HyperText Markup Language", "HyperTool Markup Language", "HighText Machine Language", "Hyperloop Markup Language"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    {
      question: "Which programming language is known as the backbone of web development?",
      options: ["Python", "C#", "JavaScript", "Ruby"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    {
      question: "Which of the following is a CSS framework?",
      options: ["Angular", "Bootstrap", "Node.js", "Django"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Web Design"
    },
    {
      question: "What does SQL stand for?",
      options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "Sequential Query Language"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Databases"
    },
    {
      question: "Which of these is used to style web pages?",
      options: ["HTML", "CSS", "Java", "SQL"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    
    // Level 2
    {
      question: "Which JavaScript framework is used for building user interfaces?",
      options: ["React", "Spring", "Django", "Flask"],
      correctAnswer: "1",
      marks: 3,
      level: "Intermediate",
      category: "Frontend Development"
    },
    {
      question: "Which of the following is NOT a Python data type?",
      options: ["List", "Set", "Map", "Tuple"],
      correctAnswer: "3",
      marks: 3,
      level: "Intermediate",
      category: "Programming"
    },
    {
      question: "What is the default port number for HTTP?",
      options: ["80", "443", "8080", "21"],
      correctAnswer: "1",
      marks: 3,
      level: "Intermediate",
      category: "Networking"
    },
    {
      question: "Which tag is used in HTML to define a clickable hyperlink?",
      options: ["<p>", "<link>", "<a>", "<href>"],
      correctAnswer: "3",
      marks: 3,
      level: "Intermediate",
      category: "Web Development"
    },
    {
      question: "Which company developed the Java programming language?",
      options: ["Oracle", "Microsoft", "Google", "Sun Microsystems"],
      correctAnswer: "4",
      marks: 3,
      level: "Intermediate",
      category: "Programming"
    },
    
    // Level 3
    {
      question: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "Oracle DB"],
      correctAnswer: "3",
      marks: 4,
      level: "Advanced",
      category: "Databases"
    },
    {
      question: "What is the time complexity of binary search in a sorted array?",
      options: ["O(n)", "O(log n)", "O(n^2)", "O(1)"],
      correctAnswer: "2",
      marks: 4,
      level: "Advanced",
      category: "Algorithms"
    },
    {
      question: "Which Git command is used to combine branches?",
      options: ["git merge", "git branch", "git checkout", "git commit"],
      correctAnswer: "1",
      marks: 4,
      level: "Advanced",
      category: "Version Control"
    },
    {
      question: "Which of the following is NOT an HTTP method?",
      options: ["GET", "POST", "FETCH", "PUT"],
      correctAnswer: "3",
      marks: 4,
      level: "Advanced",
      category: "Web Development"
    },
    {
      question: "What is Docker primarily used for?",
      options: ["Creating virtual machines", "Containerization", "Web hosting", "Version control"],
      correctAnswer: "2",
      marks: 4,
      level: "Advanced",
      category: "DevOps"
    },
    
    // Level 4
    {
      question: "What is the Big-O complexity of the Quicksort algorithm in the worst case?",
      options: ["O(log n)", "O(n)", "O(n^2)", "O(n log n)"],
      correctAnswer: "3",
      marks: 5,
      level: "Expert",
      category: "Algorithms"
    },
    {
      question: "Which protocol is used to securely transfer files over a network?",
      options: ["HTTP", "FTP", "SFTP", "SMTP"],
      correctAnswer: "3",
      marks: 5,
      level: "Expert",
      category: "Networking"
    },
    {
      question: "What is the default file used to define dependencies in Node.js projects?",
      options: ["package.json", "node_modules.json", "app.json", "config.json"],
      correctAnswer: "1",
      marks: 5,
      level: "Expert",
      category: "Backend Development"
    },
    {
      question: "Which design pattern involves one class having only one instance?",
      options: ["Factory", "Observer", "Singleton", "Decorator"],
      correctAnswer: "3",
      marks: 5,
      level: "Expert",
      category: "Design Patterns"
    },
    {
      question: "What is Kubernetes primarily used for?",
      options: ["Source code management", "Load balancing", "Orchestrating containers", "Security testing"],
      correctAnswer: "3",
      marks: 5,
      level: "Expert",
      category: "DevOps"
    },
    
    // Level 5
    {
      question: "What is the primary purpose of the CAP theorem in distributed systems?",
      options: ["Define network latency", "Balance performance and security", "Describe trade-offs between Consistency, Availability, and Partition tolerance", "Optimize throughput"],
      correctAnswer: "3",
      marks: 6,
      level: "Expert",
      category: "Distributed Systems"
    },
    {
      question: "Which data structure is best suited for implementing Dijkstra's algorithm?",
      options: ["Stack", "Queue", "Priority Queue", "Linked List"],
      correctAnswer: "3",
      marks: 6,
      level: "Expert",
      category: "Algorithms"
    },
    {
      question: "What is the primary goal of Continuous Integration (CI)?",
      options: ["To create backups", "To deploy applications", "To integrate and test code frequently", "To perform stress testing"],
      correctAnswer: "3",
      marks: 6,
      level: "Expert",
      category: "DevOps"
    },
    {
      question: "What does the term 'event-driven architecture' imply in software design?",
      options: ["Design based on commands", "Architecture focused on data flow", "Architecture focused on responding to events", "Sequential execution of processes"],
      correctAnswer: "3",
      marks: 6,
      level: "Expert",
      category: "Architecture"
    },
    {
      question: "Which protocol ensures message integrity and confidentiality in secure communications?",
      options: ["TCP", "SSL/TLS", "FTP", "ICMP"],
      correctAnswer: "2",
      marks: 6,
      level: "Expert",
      category: "Networking"
    }
  ];  

const seedQuestionBank = async () => {
  try {
    // Clear existing questions
    await QuestionBank.deleteMany({});
    
    // Insert new questions
    await QuestionBank.insertMany(sampleQuestions);
    
    console.log('Question bank seeded successfully');
    return { success: true, message: 'Question bank seeded successfully' };
  } catch (error) {
    console.error('Error seeding question bank:', error);
    return { success: false, message: error.message };
  }
};

module.exports = seedQuestionBank; 
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
      question: "Which programming language is primarily used for front-end development?",
      options: ["Python", "Java", "JavaScript", "C++"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Frontend Development"
    },
    {
      question: "Which of the following is a relational database?",
      options: ["MongoDB", "MySQL", "Redis", "Elasticsearch"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Databases"
    },
    {
      question: "What does CSS stand for?",
      options: ["Cascading Style Sheets", "Central Styling System", "Coded Style Syntax", "Custom Style Script"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Web Design"
    },
    {
      question: "Which HTTP method is used to fetch data from a server?",
      options: ["POST", "DELETE", "GET", "UPDATE"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    {
      question: "Which company developed Java?",
      options: ["Oracle", "Microsoft", "Google", "Sun Microsystems"],
      correctAnswer: "4",
      marks: 2,
      level: "Easy",
      category: "Programming"
    },
    {
      question: "Which tag is used to define a table in HTML?",
      options: ["<div>", "<table>", "<section>", "<form>"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    {
      question: "Which of these is NOT a programming language?",
      options: ["Java", "Python", "HTML", "C++"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Programming"
    },
    {
      question: "Which of the following is used for styling web pages?",
      options: ["HTML", "CSS", "SQL", "Python"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Web Development"
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
      question: "Which programming language is best suited for data analysis?",
      options: ["JavaScript", "Python", "C++", "Ruby"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Programming"
    },
    {
      question: "Which of the following is NOT a database management system?",
      options: ["PostgreSQL", "MongoDB", "Excel", "Oracle DB"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Databases"
    },
    {
      question: "What does API stand for?",
      options: ["Application Programming Interface", "Automated Processing Input", "Advanced Program Integration", "Applied Protocol Interaction"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Backend Development"
    },
    {
      question: "Which of these is a version control system?",
      options: ["JIRA", "Docker", "Git", "Jenkins"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Version Control"
    },
    {
      question: "What is the default port number for HTTP?",
      options: ["80", "443", "22", "8080"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Networking"
    },
    {
      question: "Which of these is a backend framework?",
      options: ["React", "Bootstrap", "Node.js", "Vue.js"],
      correctAnswer: "3",
      marks: 2,
      level: "Easy",
      category: "Backend Development"
    },
    {
      question: "Which symbol is used to denote an ID in CSS?",
      options: ["#", ".", "/", "*"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Web Design"
    },
    {
      question: "Which HTTP status code means 'Not Found'?",
      options: ["200", "404", "500", "403"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Web Development"
    },
    {
      question: "Which of these is a frontend JavaScript framework?",
      options: ["Django", "Angular", "Flask", "Spring"],
      correctAnswer: "2",
      marks: 2,
      level: "Easy",
      category: "Frontend Development"
    },
    {
      question: "What is the extension of a JavaScript file?",
      options: [".js", ".jsx", ".java", ".json"],
      correctAnswer: "1",
      marks: 2,
      level: "Easy",
      category: "Programming"
    },
    {
      "question": "Which programming language is used to build Android applications?",
      "options": ["Swift", "Kotlin", "C#", "PHP"],
      "correctAnswer": "2",
      "marks": 2,
      "level": "Easy",
      "category": "Mobile Development"
    },
    {
      "question": "Which of the following is used to structure content on the web?",
      "options": ["CSS", "JavaScript", "HTML", "Python"],
      "correctAnswer": "3",
      "marks": 2,
      "level": "Easy",
      "category": "Web Development"
    },
    {
      "question": "Which company created React.js?",
      "options": ["Google", "Microsoft", "Facebook", "Apple"],
      "correctAnswer": "3",
      "marks": 2,
      "level": "Easy",
      "category": "Frontend Development"
    },
    {
      "question": "Which CSS property is used to change text color?",
      "options": ["font-color", "color", "text-style", "background"],
      "correctAnswer": "2",
      "marks": 2,
      "level": "Easy",
      "category": "Web Design"
    },
    {
      "question": "Which of the following is an operating system?",
      "options": ["Python", "Windows", "HTML", "MySQL"],
      "correctAnswer": "2",
      "marks": 2,
      "level": "Easy",
      "category": "Operating Systems"
    },
    

    
    // Level 2 (Intermediate)
    
      { 
        "question": "What is the difference between == and === in JavaScript?", 
        "options": ["Both are the same", "== compares values, === compares values and type", "=== compares values, == compares values and type", "No difference"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which design pattern is used in React Hooks?", 
        "options": ["Observer", "Singleton", "Factory", "Stateful Pattern"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "React" 
      },
      { 
        "question": "What is the purpose of useEffect in React?", 
        "options": ["To manage component state", "To perform side effects in a component", "To create a new component", "To manage component styles"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "React" 
      },
      { 
        "question": "Which of the following is NOT a valid JavaScript data type?", 
        "options": ["Number", "Boolean", "Float", "Symbol"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "What does the 'this' keyword refer to in JavaScript inside a method?", 
        "options": ["The global object", "The object that called the method", "The parent object", "Undefined"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which database follows the ACID properties strictly?", 
        "options": ["MongoDB", "Cassandra", "MySQL", "Redis"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Databases" 
      },
      { 
        "question": "Which of the following is NOT a lifecycle method in React class components?", 
        "options": ["componentDidMount", "componentWillUpdate", "componentDidRender", "componentWillUnmount"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "React" 
      },
      { 
        "question": "Which statement is true about REST APIs?", 
        "options": ["They use SOAP for communication", "They must use XML", "They follow stateless architecture", "They require WebSockets"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "APIs" 
      },
      { 
        "question": "What does the async keyword do in JavaScript?", 
        "options": ["Makes a function return a promise", "Blocks the execution of code", "Runs code synchronously", "Stops execution completely"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which protocol is commonly used for real-time web applications?", 
        "options": ["HTTP", "FTP", "WebSockets", "SMTP"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Networking" 
      },
      { 
        "question": "Which HTTP status code represents 'Unauthorized'?", 
        "options": ["200", "403", "401", "500"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Web Development" 
      },
      { 
        "question": "Which of the following is a NoSQL database?", 
        "options": ["PostgreSQL", "MongoDB", "MySQL", "SQLite"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Databases" 
      },
      { 
        "question": "What is the default state management library in React?", 
        "options": ["Redux", "Context API", "MobX", "Vuex"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "React" 
      },
      { 
        "question": "Which of the following CSS properties is used to create a flex container?", 
        "options": ["display", "align-items", "justify-content", "flex-direction"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "CSS" 
      },
      { 
        "question": "What does the try...catch block do in JavaScript?", 
        "options": ["Handles errors", "Defines variables", "Loops through an array", "Declares a function"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which JavaScript function converts a JSON string into an object?", 
        "options": ["JSON.parse()", "JSON.stringify()", "parseJSON()", "stringifyJSON()"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "What is the purpose of the useState hook in React?", 
        "options": ["To create a new component", "To store component state", "To fetch API data", "To modify props"], 
        "correctAnswer": "2", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "React" 
      },
      { 
        "question": "Which function is used to schedule a function execution in JavaScript?", 
        "options": ["setInterval()", "delay()", "executeLater()", "setTimeout()"], 
        "correctAnswer": "4", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which of the following is NOT a Git command?", 
        "options": ["git clone", "git commit", "git push", "git deploy"], 
        "correctAnswer": "4", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Git" 
      },
      { 
        "question": "Which JavaScript framework is based on a virtual DOM?", 
        "options": ["Angular", "Vue", "React", "Svelte"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "JavaScript" 
      },
      { 
        "question": "Which CSS unit is relative to the font size of the root element?", 
        "options": ["px", "em", "rem", "%"], 
        "correctAnswer": "3", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "CSS" 
      },
      { 
        "question": "What does CRUD stand for in database operations?", 
        "options": ["Create, Read, Update, Delete", "Create, Retrieve, Update, Drop", "Compile, Run, Update, Delete", "Cache, Retrieve, Update, Deploy"], 
        "correctAnswer": "1", 
        "marks": 3, 
        "level": "Intermediate", 
        "category": "Databases" 
      }
  ,
  
    
  
    { 
      "question": "Which of the following is true about REST APIs?", 
      "options": ["They must always use JSON", "They are stateful", "They follow CRUD principles", "They can only be used with JavaScript"], 
      "correctAnswer": "3", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "APIs" 
    },
    { 
      "question": "What does the ACID property in databases stand for?", 
      "options": ["Atomicity, Consistency, Isolation, Durability", "Access, Control, Integrity, Dependability", "Automation, Computation, Integrity, Data", "Advanced, Code, Isolation, Distribution"], 
      "correctAnswer": "1", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Databases" 
    },
    { 
      "question": "Which algorithm is used for garbage collection in V8 (JavaScript engine)?", 
      "options": ["Mark and Sweep", "Reference Counting", "Stop and Copy", "Generational GC"], 
      "correctAnswer": "4", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "JavaScript" 
    },
    { 
      "question": "In React, what is the purpose of reconciliation?", 
      "options": ["To update the DOM efficiently", "To store component state", "To manage API calls", "To handle errors"], 
      "correctAnswer": "1", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "React" 
    },
    { 
      "question": "Which of the following is NOT a characteristic of GraphQL?", 
      "options": ["Strongly typed schema", "Over-fetching of data", "Client-driven queries", "Single endpoint"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "APIs" 
    },
    { 
      "question": "What is a major disadvantage of using WebSockets?", 
      "options": ["They do not support real-time communication", "They require a persistent connection", "They cannot be used with JavaScript", "They are stateless"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Networking" 
    },
    { 
      "question": "Which of the following is NOT a part of the Event Loop in JavaScript?", 
      "options": ["Call Stack", "Callback Queue", "Heap", "Microtask Queue"], 
      "correctAnswer": "3", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "JavaScript" 
    },
    { 
      "question": "Which method is used to prevent Clickjacking attacks?", 
      "options": ["CSP (Content Security Policy)", "X-Frame-Options", "SameSite Cookie Policy", "CORS Headers"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Security" 
    },
    { 
      "question": "In a microservices architecture, how do services typically communicate?", 
      "options": ["Monolithic function calls", "Direct database access", "REST or gRPC", "Local function execution"], 
      "correctAnswer": "3", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "System Design" 
    },
    { 
      "question": "Which of the following is an example of a NoSQL database?", 
      "options": ["PostgreSQL", "MongoDB", "MySQL", "MariaDB"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Databases" 
    },
    { 
      "question": "What is the role of memoization in JavaScript?", 
      "options": ["To store computed results for future use", "To compress data in memory", "To prevent memory leaks", "To manage garbage collection"], 
      "correctAnswer": "1", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "JavaScript" 
    },
    { 
      "question": "Which React hook is used to optimize performance by caching function definitions?", 
      "options": ["useMemo", "useCallback", "useEffect", "useState"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "React" 
    },
    { 
      "question": "What is the primary benefit of using Redux over React's Context API for state management?", 
      "options": ["Faster rendering", "Better debugging tools", "Less boilerplate", "Easier to learn"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "React" 
    },
    { 
      "question": "Which indexing technique improves read performance in databases?", 
      "options": ["B-Tree Indexing", "Linear Search", "Full Table Scan", "Bubble Sort"], 
      "correctAnswer": "1", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Databases" 
    },
    { 
      "question": "What is the main purpose of a load balancer?", 
      "options": ["To increase network speed", "To distribute incoming requests across servers", "To store frequently used data", "To improve database indexing"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "System Design" 
    },
    { 
      "question": "Which of the following is NOT a feature of OAuth 2.0?", 
      "options": ["Access tokens", "Client credentials", "Stateful sessions", "Scopes"], 
      "correctAnswer": "3", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Security" 
    },
    { 
      "question": "Which JavaScript feature is used to improve execution speed in loops?", 
      "options": ["Memoization", "Tail Call Optimization", "Event Delegation", "Loop Unrolling"], 
      "correctAnswer": "4", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "JavaScript" 
    },
    { 
      "question": "Which command is used to create a new branch in Git?", 
      "options": ["git branch newBranch", "git checkout -b newBranch", "git new-branch newBranch", "git create branch newBranch"], 
      "correctAnswer": "2", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Git" 
    },
    { 
      "question": "Which performance metric measures time taken for a page to become interactive?", 
      "options": ["Time to First Byte (TTFB)", "First Contentful Paint (FCP)", "Largest Contentful Paint (LCP)", "Time to Interactive (TTI)"], 
      "correctAnswer": "4", 
      "marks": 4, 
      "level": "Advanced", 
      "category": "Performance" 
    }
    ,
    {
      "question": "What is the main advantage of a multi-threaded event loop in Node.js?",
      "options": ["Improves single-thread performance", "Handles CPU-bound tasks efficiently", "Enhances async I/O operations", "Reduces memory consumption"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "JavaScript"
    },
    {
      "question": "Which type of database index provides the best performance for range queries?",
      "options": ["B-Tree", "Hash Index", "Bitmap Index", "GIST Index"],
      "correctAnswer": "1",
      "marks": 5,
      "level": "Expert",
      "category": "Databases"
    },
    {
      "question": "Which React optimization technique prevents unnecessary re-renders?",
      "options": ["Virtual DOM", "useMemo", "Strict Mode", "useEffect"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "React"
    },
    {
      "question": "Which HTTP status code is used when an API rate limit is exceeded?",
      "options": ["403", "409", "429", "503"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "APIs"
    },
    {
      "question": "Which technique reduces the load on an API server?",
      "options": ["Sharding", "Circuit Breaker", "Rate Limiting", "Lazy Loading"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "System Design"
    },
    {
      "question": "Which of the following is a feature of gRPC over REST?",
      "options": ["Uses text-based communication", "Allows HTTP/1.1 requests", "Uses Protobuf for serialization", "Lack of bidirectional streaming"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "Networking"
    },
    {
      "question": "What is the primary risk of using wildcard '*' in CORS settings?",
      "options": ["Decreased server performance", "Security vulnerability due to unrestricted access", "Increased response time", "CORS errors in browsers"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Security"
    },
    {
      "question": "Which component in a microservices architecture helps with service discovery?",
      "options": ["API Gateway", "Load Balancer", "Service Registry", "Message Queue"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "System Design"
    },
    {
      "question": "In Kubernetes, which object is responsible for ensuring a set number of replicas are running?",
      "options": ["Deployment", "Pod", "ReplicaSet", "StatefulSet"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "DevOps"
    },
    {
      "question": "Which of the following is NOT a feature of OAuth 2.0?",
      "options": ["Access Tokens", "Implicit Grant Flow", "Stateful Sessions", "Scopes"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "Security"
    },
    {
      "question": "What is the best strategy to optimize database writes at scale?",
      "options": ["Use single-threaded transactions", "Implement database sharding", "Store everything in a single table", "Use synchronous writes"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Databases"
    },
    {
      "question": "Which type of caching is best for reducing database query load?",
      "options": ["Page caching", "Object caching", "DNS caching", "Browser caching"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Performance"
    },
    {
      "question": "Which of the following is the most secure way to store passwords?",
      "options": ["Plain text", "MD5 hashing", "BCrypt hashing with salt", "Base64 encoding"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "Security"
    },
    {
      "question": "Which design pattern is used to decouple services in microservices architecture?",
      "options": ["Observer", "Singleton", "Circuit Breaker", "Factory"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "System Design"
    },
    {
      "question": "Which is the most effective approach to prevent SQL Injection?",
      "options": ["Escape user inputs", "Use prepared statements", "Filter inputs using regex", "Log user queries"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Security"
    },
    {
      "question": "What is the primary advantage of a WebAssembly module in a browser?",
      "options": ["Faster than JavaScript for computations", "Better styling capabilities", "Replaces the need for HTML", "Runs only in Node.js"],
      "correctAnswer": "1",
      "marks": 5,
      "level": "Expert",
      "category": "Web Performance"
    },
    {
      "question": "Which of the following is NOT a valid HTTP/2 feature?",
      "options": ["Header Compression", "Multiplexing", "Persistent Connections", "UDP Transport"],
      "correctAnswer": "4",
      "marks": 5,
      "level": "Expert",
      "category": "Networking"
    },
    {
      "question": "Which GraphQL feature helps prevent over-fetching?",
      "options": ["Fragments", "Resolvers", "Selective Queries", "Subscriptions"],
      "correctAnswer": "3",
      "marks": 5,
      "level": "Expert",
      "category": "APIs"
    },
    {
      "question": "Which hashing algorithm is commonly used for blockchain integrity?",
      "options": ["MD5", "SHA-256", "Base64", "AES"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Security"
    },
    {
      "question": "Which method is best for scaling a real-time WebSocket application?",
      "options": ["Using horizontal scaling with Redis pub/sub", "Adding more CPU cores", "Reducing socket timeout", "Using long polling"],
      "correctAnswer": "1",
      "marks": 5,
      "level": "Expert",
      "category": "System Design"
    },
    {
      "question": "What does a reverse proxy do?",
      "options": ["Handles client-side caching", "Directs incoming traffic to backend servers", "Encrypts end-to-end requests", "Filters database queries"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "Networking"
    },
    {
      "question": "Which of the following is a key advantage of a CQRS (Command Query Responsibility Segregation) architecture?",
      "options": ["Single database for all operations", "Improved read scalability", "Avoids eventual consistency", "No need for event sourcing"],
      "correctAnswer": "2",
      "marks": 5,
      "level": "Expert",
      "category": "System Design"
    }


    
];

const seedQuestionBank = async () => {
  try {
    await QuestionBank.deleteMany({});
    await QuestionBank.insertMany(sampleQuestions);
    console.log('Question bank seeded successfully');
    return { success: true, message: 'Question bank seeded successfully' };
  } catch (error) {
    console.error('Error seeding question bank:', error);
    return { success: false, message: error.message };
  }
};

module.exports = seedQuestionBank;

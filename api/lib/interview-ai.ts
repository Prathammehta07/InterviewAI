// AI-Powered Interview Service
// Handles question generation, response evaluation, difficulty adaptation, and scoring

export type QuestionType = "technical" | "conceptual" | "behavioral" | "scenario";
export type Difficulty = "easy" | "medium" | "hard";

export interface GeneratedQuestion {
  questionText: string;
  questionType: QuestionType;
  difficulty: Difficulty;
  category: string;
  expectedAnswer: string;
  timeLimit: number;
}

export interface ScoreBreakdown {
  accuracy: number;
  clarity: number;
  depth: number;
  relevance: number;
  timeEfficiency: number;
  overall: number;
}

export interface SkillArea {
  name: string;
  score: number;
  maxScore: number;
}

// Common tech skills and keywords for extraction
const TECH_SKILLS = [
  "javascript", "typescript", "python", "java", "cpp", "c++", "c#", "go", "rust",
  "ruby", "php", "swift", "kotlin", "scala", "r", "matlab",
  "react", "angular", "vue", "svelte", "next.js", "nuxt",
  "node.js", "express", "django", "flask", "spring", "laravel",
  "html", "css", "sass", "less", "tailwind",
  "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
  "aws", "azure", "gcp", "docker", "kubernetes", "terraform",
  "git", "ci/cd", "jenkins", "github actions",
  "machine learning", "deep learning", "nlp", "computer vision",
  "data structures", "algorithms", "system design", "oop",
  "rest api", "graphql", "microservices", "serverless",
  "agile", "scrum", "leadership", "communication", "teamwork",
  "problem solving", "critical thinking", "data analysis",
];

const ROLE_QUESTIONS: Record<string, Record<QuestionType, Record<Difficulty, string[]>>> = {
  "software engineer": {
    technical: {
      easy: [
        "Explain the difference between let, const, and var in JavaScript.",
        "What is the purpose of REST API and what are its main principles?",
        "Describe the box model in CSS and how it affects layout.",
        "What is the difference between SQL and NoSQL databases?",
        "Explain what a closure is in programming.",
      ],
      medium: [
        "Explain how event delegation works in JavaScript and provide a practical example.",
        "Describe the differences between REST and GraphQL. When would you choose one over the other?",
        "How does React's Virtual DOM work and what are its performance benefits?",
        "Explain database indexing. How does it improve query performance and what are the trade-offs?",
        "What are the key principles of microservices architecture and what challenges does it introduce?",
      ],
      hard: [
        "Design a distributed rate limiter that can handle 100,000 requests per second across multiple servers.",
        "Explain how you would implement a real-time collaborative editing system like Google Docs.",
        "Describe the CAP theorem and design a system that prioritizes availability over consistency.",
        "How would you design a message queue system that guarantees exactly-once delivery?",
        "Explain the internals of how JavaScript engines optimize code execution with JIT compilation.",
      ],
    },
    conceptual: {
      easy: [
        "What is the difference between synchronous and asynchronous programming?",
        "Explain what dependency injection is and why it's useful.",
        "What are the SOLID principles in object-oriented design?",
        "Describe the difference between horizontal and vertical scaling.",
        "What is the purpose of version control systems like Git?",
      ],
      medium: [
        "Explain the concept of eventual consistency and where it's applicable.",
        "Describe the observer pattern and give an example of where you've used it.",
        "What is the difference between concurrency and parallelism? Provide real-world examples.",
        "Explain how garbage collection works in modern programming languages.",
        "Describe the principles of Domain-Driven Design (DDD).",
      ],
      hard: [
        "Compare and contrast different consensus algorithms (Raft, Paxos, PBFT) and their trade-offs.",
        "Explain how consistent hashing works and why it's crucial for distributed caching systems.",
        "Describe the challenges and solutions for maintaining data consistency across microservices.",
        "Explain the differences between various garbage collection strategies and their impact on latency.",
        "How would you approach designing a system that needs to process 1 billion events per day?",
      ],
    },
    behavioral: {
      easy: [
        "Tell me about a time you had to learn a new technology quickly.",
        "Describe a situation where you had to work with a difficult team member.",
        "How do you handle tight deadlines and pressure?",
        "Tell me about a project you're particularly proud of.",
        "How do you stay updated with the latest technology trends?",
      ],
      medium: [
        "Describe a time when you had to make a significant technical decision with incomplete information.",
        "Tell me about a time you had to refactor a large codebase. How did you approach it?",
        "Describe a situation where you disagreed with your team's technical approach. How did you handle it?",
        "Tell me about a time you had to debug a production issue under time pressure.",
        "How do you handle situations where business requirements conflict with technical best practices?",
      ],
      hard: [
        "Describe a time when you had to lead a major architectural change that faced significant resistance.",
        "Tell me about a project failure and what you learned from it.",
        "Describe a situation where you had to balance technical debt with delivering features.",
        "How would you handle a situation where a senior team member is consistently producing low-quality code?",
        "Tell me about a time you had to make an unpopular technical decision for long-term benefit.",
      ],
    },
    scenario: {
      easy: [
        "Your API is returning 500 errors. Walk me through your debugging process.",
        "A junior developer asks you to review their code. What do you look for?",
        "You need to add a new feature to an existing application. How do you approach this?",
        "Your application is loading slowly. What steps would you take to improve performance?",
        "How would you handle a database migration in a production environment?",
      ],
      medium: [
        "Your system is experiencing intermittent failures that you can't reproduce locally. How do you approach this?",
        "You need to integrate a third-party API that's poorly documented. Walk me through your approach.",
        "Your team needs to support real-time updates in an existing application. How would you implement this?",
        "You discover a critical security vulnerability in production. What steps do you take?",
        "How would you design a caching strategy for a high-traffic e-commerce website?",
      ],
      hard: [
        "Design a system that can handle a flash sale with 10x normal traffic without crashing.",
        "You need to migrate a monolith to microservices while maintaining 99.9% uptime. How do you approach this?",
        "Design a real-time notification system that can handle millions of users across multiple platforms.",
        "Your system needs to process and analyze 1TB of data daily. Design the architecture.",
        "How would you build a system that can detect and prevent fraudulent transactions in real-time?",
      ],
    },
  },
  "frontend developer": {
    technical: {
      easy: [
        "What is the difference between inline, block, and inline-block elements in CSS?",
        "Explain the difference between == and === in JavaScript.",
        "What is the purpose of the alt attribute in images?",
        "Describe the difference between localStorage and sessionStorage.",
        "What are semantic HTML elements and why are they important?",
      ],
      medium: [
        "Explain React hooks and the rules of using them. Give examples of custom hooks.",
        "Describe CSS Grid vs Flexbox. When would you use each?",
        "How does server-side rendering (SSR) differ from client-side rendering? What are the trade-offs?",
        "Explain the concept of CSS specificity and how to handle specificity conflicts.",
        "What are Web Workers and how can they improve frontend performance?",
      ],
      hard: [
        "Design a component library that needs to support theming, accessibility, and tree-shaking.",
        "Explain how you would optimize a React application that renders a list of 10,000 items.",
        "Describe the internals of a virtual scrolling implementation.",
        "How would you build a real-time collaborative whiteboard application?",
        "Explain how you would implement a CSS-in-JS solution from scratch.",
      ],
    },
    conceptual: {
      easy: [
        "What is responsive design and why is it important?",
        "Explain the concept of progressive enhancement.",
        "What is accessibility (a11y) in web development?",
        "Describe the difference between static and dynamic websites.",
        "What are web standards and why are they important?",
      ],
      medium: [
        "Explain the concept of state management and why it's needed in complex applications.",
        "Describe the principles of component-driven development.",
        "What is the Critical Rendering Path and how can you optimize it?",
        "Explain the concept of hydration in modern frontend frameworks.",
        "Describe the trade-offs between monolithic and modular CSS architectures.",
      ],
      hard: [
        "Explain the differences between various frontend architecture patterns (SPA, MPA, Islands, Streaming SSR).",
        "Describe how you would design a frontend system that needs to support multiple brands with shared components.",
        "Explain the challenges of maintaining large-scale design systems and how to address them.",
        "How would you approach building a framework-agnostic UI component library?",
        "Describe strategies for optimizing Core Web Vitals in a complex single-page application.",
      ],
    },
    behavioral: {
      easy: [
        "How do you stay current with frontend technologies?",
        "Describe your approach to cross-browser compatibility testing.",
        "How do you handle feedback on your UI designs?",
        "Tell me about a time you improved a website's performance.",
        "How do you collaborate with designers and backend developers?",
      ],
      medium: [
        "Describe a time when you had to implement a design that was technically challenging.",
        "Tell me about a time you had to convince your team to adopt a new frontend technology.",
        "How do you handle situations where design requirements conflict with accessibility standards?",
        "Describe a time you had to debug a complex CSS or JavaScript issue.",
        "How do you prioritize between pixel-perfect designs and delivery timelines?",
      ],
      hard: [
        "Describe a time when you had to completely rethink a frontend architecture.",
        "Tell me about a situation where you had to deliver under extremely tight deadlines.",
        "How would you handle a situation where stakeholders want features that hurt performance?",
        "Describe a time you mentored junior developers in frontend best practices.",
        "How do you balance innovation with stability in frontend development?",
      ],
    },
    scenario: {
      easy: [
        "A page is rendering blank on mobile but works on desktop. How do you debug this?",
        "You need to make an existing website responsive. What's your approach?",
        "How would you implement a dark mode toggle in an existing application?",
        "A form submission is slow. How do you improve the user experience?",
        "You need to add animations to improve UX. How do you approach this?",
      ],
      medium: [
        "Design a search autocomplete feature with keyboard navigation and accessibility.",
        "You need to implement a complex dashboard with multiple real-time data sources.",
        "How would you build an image gallery that handles thousands of images efficiently?",
        "Design a multi-step form with validation, progress saving, and error handling.",
        "How would you implement a WYSIWYG editor that's accessible and performant?",
      ],
      hard: [
        "Design a frontend architecture for a SaaS product that supports custom widgets from third parties.",
        "Build a video conferencing UI that needs to support 50+ participants with screen sharing.",
        "Design a real-time collaborative document editor with offline support.",
        "How would you build a visual page builder that non-technical users can use?",
        "Design a frontend system that can A/B test any UI component without code changes.",
      ],
    },
  },
  "backend developer": {
    technical: {
      easy: [
        "What is the difference between PUT and POST HTTP methods?",
        "Explain what middleware is in the context of web frameworks.",
        "What is the purpose of database migrations?",
        "Describe the difference between authentication and authorization.",
        "What are environment variables and why are they important?",
      ],
      medium: [
        "Explain database normalization and when you might want to denormalize.",
        "Describe the differences between JWT sessions and traditional server-side sessions.",
        "How would you design an API rate limiting system?",
        "Explain the concept of database transactions and ACID properties.",
        "What are the key differences between synchronous and asynchronous message processing?",
      ],
      hard: [
        "Design a distributed locking mechanism that handles network partitions gracefully.",
        "Explain how you would build an event sourcing system with CQRS.",
        "Design a database sharding strategy for a rapidly growing multi-tenant SaaS application.",
        "How would you implement a distributed tracing system across microservices?",
        "Design a payment processing system that handles idempotency and failure recovery.",
      ],
    },
    conceptual: {
      easy: [
        "What is an API and why is it important?",
        "Explain the client-server architecture model.",
        "What is caching and why is it used?",
        "Describe the difference between stateful and stateless applications.",
        "What is load balancing and why is it needed?",
      ],
      medium: [
        "Explain eventual consistency and when it's acceptable.",
        "Describe the saga pattern for distributed transactions.",
        "What is circuit breaker pattern and when should you use it?",
        "Explain the differences between RPC and message-based communication.",
        "Describe strategies for handling database connection pooling at scale.",
      ],
      hard: [
        "Compare different strategies for maintaining data consistency across distributed systems.",
        "Explain the trade-offs between strong consistency and high availability.",
        "Describe how you would design a system for zero-downtime deployments.",
        "How would you approach building a globally distributed database system?",
        "Explain the challenges and solutions for handling backpressure in streaming systems.",
      ],
    },
    behavioral: {
      easy: [
        "How do you approach API documentation?",
        "Describe how you handle production incidents.",
        "How do you ensure code quality in your backend services?",
        "Tell me about a time you optimized a slow API endpoint.",
        "How do you stay updated with backend technologies?",
      ],
      medium: [
        "Describe a time you had to choose between multiple database technologies.",
        "Tell me about a time you had to refactor a critical legacy API.",
        "How do you handle disagreements about architecture decisions?",
        "Describe a situation where you had to balance security with user experience.",
        "How do you approach testing for backend systems?",
      ],
      hard: [
        "Describe a time when you had to rebuild a critical system from scratch.",
        "Tell me about handling a major production outage.",
        "How would you approach mentoring a team on backend best practices?",
        "Describe a time you had to push back on unrealistic technical requirements.",
        "How do you evaluate and adopt new technologies for backend systems?",
      ],
    },
    scenario: {
      easy: [
        "An API is returning inconsistent data. How do you debug and fix it?",
        "You need to add authentication to an existing API. Walk me through your approach.",
        "How would you handle a database query that's becoming slower over time?",
        "Design a file upload API with validation and virus scanning.",
        "You need to implement search functionality. What approaches do you consider?",
      ],
      medium: [
        "Design a webhook system that handles delivery retries and idempotency.",
        "How would you build a real-time notification system for a mobile app backend?",
        "Design an API gateway that handles authentication, rate limiting, and request routing.",
        "You need to migrate data from one database to another with zero downtime.",
        "How would you implement a multi-tenant system with data isolation?",
      ],
      hard: [
        "Design a system that can process 100,000 orders per minute on Black Friday.",
        "Build a distributed task scheduler that guarantees execution and handles failures.",
        "Design a banking system that handles concurrent transactions safely.",
        "How would you build a search engine for a dataset with billions of records?",
        "Design a system for real-time fraud detection in financial transactions.",
      ],
    },
  },
  "data scientist": {
    technical: {
      easy: [
        "What is the difference between supervised and unsupervised learning?",
        "Explain what overfitting is and how to prevent it.",
        "What is the difference between classification and regression?",
        "Describe what a confusion matrix is and its components.",
        "What is cross-validation and why is it important?",
      ],
      medium: [
        "Explain gradient descent and its variants (batch, stochastic, mini-batch).",
        "Describe the bias-variance tradeoff. How do you balance it in practice?",
        "What are ensemble methods and how do Random Forests work?",
        "Explain the difference between L1 and L2 regularization.",
        "How would you handle imbalanced datasets in classification problems?",
      ],
      hard: [
        "Explain the mathematical foundations of Support Vector Machines.",
        "Describe how you would build a recommendation system for a streaming platform.",
        "Explain the transformer architecture and its attention mechanism in detail.",
        "How would you approach feature engineering for a time series forecasting problem?",
        "Design an A/B testing framework that can detect small effect sizes with high confidence.",
      ],
    },
    conceptual: {
      easy: [
        "What is the data science lifecycle?",
        "Explain the difference between correlation and causation.",
        "What is feature selection and why is it important?",
        "Describe what p-value means in hypothesis testing.",
        "What is the curse of dimensionality?",
      ],
      medium: [
        "Explain the differences between parametric and non-parametric models.",
        "Describe how you would approach a problem where you have limited labeled data.",
        "What is the difference between generative and discriminative models?",
        "Explain the concept of statistical power and its importance in experiments.",
        "Describe strategies for handling missing data in datasets.",
      ],
      hard: [
        "Explain the theoretical foundations of deep learning optimization.",
        "Describe the challenges of causal inference and methods to address them.",
        "How would you validate the robustness of a machine learning model in production?",
        "Explain the concept of PAC learning and its implications.",
        "Describe how you would design an experiment to measure the true impact of a feature.",
      ],
    },
    behavioral: {
      easy: [
        "How do you explain complex technical findings to non-technical stakeholders?",
        "Describe how you stay current with ML/AI research.",
        "How do you handle situations where data quality is poor?",
        "Tell me about a data science project you're proud of.",
        "How do you approach collaboration with engineering teams?",
      ],
      medium: [
        "Describe a time when your model performed poorly in production. What did you learn?",
        "Tell me about a time you had to make a decision with incomplete data.",
        "How do you handle situations where business stakeholders disagree with data-driven insights?",
        "Describe a time you had to optimize a model for both accuracy and inference speed.",
        "How do you prioritize which data science projects to work on?",
      ],
      hard: [
        "Describe a time you had to challenge a widely accepted business assumption with data.",
        "Tell me about building a data-driven culture in an organization.",
        "How would you handle ethical concerns about data usage in a project?",
        "Describe a situation where you had to balance model complexity with interpretability.",
        "How do you approach building trust in AI systems among skeptical stakeholders?",
      ],
    },
    scenario: {
      easy: [
        "You have a dataset with 50% missing values. How do you handle it?",
        "How would you approach building a customer churn prediction model?",
        "Design a simple sentiment analysis pipeline for product reviews.",
        "You need to segment customers for a marketing campaign. How do you approach this?",
        "How would you detect anomalies in website traffic data?",
      ],
      medium: [
        "Design a complete ML pipeline for predicting house prices.",
        "How would you build a system to detect fraudulent credit card transactions?",
        "Design an approach to recommend products to new users with no history (cold start problem).",
        "You need to forecast demand for a retail chain with multiple stores. How do you approach this?",
        "How would you build a system to automatically tag and categorize support tickets?",
      ],
      hard: [
        "Design a real-time bidding system for ad placement using reinforcement learning.",
        "Build a system that can understand and answer questions about legal documents.",
        "Design a computer vision system for quality control in manufacturing.",
        "How would you build a personalized learning system that adapts to student performance?",
        "Design an NLP system that can detect and mitigate bias in hiring decisions.",
      ],
    },
  },
};

// Generic fallback questions for any tech role
const GENERIC_QUESTIONS: Record<QuestionType, Record<Difficulty, string[]>> = {
  technical: {
    easy: [
      "Explain the difference between a stack and a queue data structure.",
      "What is the time complexity of binary search?",
      "Describe what an API endpoint is.",
      "What is the purpose of version control?",
      "Explain the concept of recursion with a simple example.",
    ],
    medium: [
      "Explain how hash tables work and what makes them efficient.",
      "Describe the differences between Agile and Waterfall methodologies.",
      "What are design patterns and why are they useful?",
      "Explain the concept of Big O notation and why it matters.",
      "How would you optimize a slow-performing database query?",
    ],
    hard: [
      "Design a URL shortening service like bit.ly.",
      "Explain how consistent hashing is used in distributed systems.",
      "Design a leader election protocol for a distributed system.",
      "How would you implement a least recently used (LRU) cache?",
      "Design a system to handle concurrent writes without data corruption.",
    ],
  },
  conceptual: {
    easy: [
      "What is abstraction in software engineering?",
      "Explain the difference between compilation and interpretation.",
      "What is technical debt and how do you manage it?",
      "Describe the importance of writing clean code.",
      "What is test-driven development (TDD)?",
    ],
    medium: [
      "Explain the principle of least privilege and its importance in system design.",
      "Describe the trade-offs between monolithic and distributed architectures.",
      "What is idempotency and why is it important in API design?",
      "Explain the concept of fault tolerance in system design.",
      "How do you approach system design for scalability?",
    ],
    hard: [
      "Describe the challenges of building systems that span multiple data centers.",
      "Explain how you would design a system that can handle network partitions gracefully.",
      "Compare different consistency models in distributed databases.",
      "How would you design a system that maintains privacy while still enabling analytics?",
      "Explain the CAP theorem with real-world examples of CP and AP systems.",
    ],
  },
  behavioral: {
    easy: [
      "Tell me about yourself and your technical background.",
      "How do you handle stress and tight deadlines?",
      "Describe your ideal work environment.",
      "What motivates you in your work?",
      "How do you organize your workday?",
    ],
    medium: [
      "Describe a time when you had to learn something completely new for a project.",
      "Tell me about a time you received critical feedback. How did you respond?",
      "How do you handle situations where you don't know the answer to a technical question?",
      "Describe a time when you had to collaborate with a difficult colleague.",
      "Tell me about a time you went above and beyond on a project.",
    ],
    hard: [
      "Describe a situation where you had to make a decision that was unpopular but correct.",
      "Tell me about a time you failed at something important and what you learned.",
      "How would you handle a situation where your team is consistently missing deadlines?",
      "Describe a time when you had to challenge a senior person's technical opinion.",
      "How do you handle burnout and maintain work-life balance in demanding roles?",
    ],
  },
  scenario: {
    easy: [
      "Walk me through how you would set up a new project from scratch.",
      "How would you investigate a bug report from a user?",
      "Describe how you would review a pull request from a teammate.",
      "A stakeholder asks for an urgent feature. How do you respond?",
      "How would you approach improving the security of an existing application?",
    ],
    medium: [
      "You need to scale an application from 100 to 100,000 users. What's your plan?",
      "Design a system for collecting and analyzing user analytics.",
      "How would you approach migrating a legacy system to modern technology?",
      "Design a notification system that supports multiple channels (email, SMS, push).",
      "You need to reduce infrastructure costs by 50%. What steps do you take?",
    ],
    hard: [
      "Design a social media platform that can handle billions of interactions.",
      "How would you build a system that needs to comply with GDPR and other privacy regulations?",
      "Design an e-commerce platform that can handle flash sales without crashing.",
      "Build a system that can process and analyze medical imaging data in real-time.",
      "Design a platform that can support millions of IoT devices sending data simultaneously.",
    ],
  },
};

// Extract skills from resume text
export function extractSkills(resumeText: string): string[] {
  const text = resumeText.toLowerCase();
  const found = TECH_SKILLS.filter((skill) => text.includes(skill));
  // Also try to extract capitalized tech terms
  const words = text.split(/\s+/);
  const capitalized = words.filter((w) => /^[A-Z][a-z]+/.test(w) && w.length > 2);
  return [...new Set([...found, ...capitalized])];
}

// Extract role from job description
export function extractRole(jobDescription: string): string {
  const jd = jobDescription.toLowerCase();
  if (jd.includes("frontend") || jd.includes("front-end") || jd.includes("front end") || jd.includes("ui") || jd.includes("react") || jd.includes("angular") || jd.includes("vue")) {
    return "frontend developer";
  }
  if (jd.includes("backend") || jd.includes("back-end") || jd.includes("back end") || jd.includes("api") || jd.includes("server")) {
    return "backend developer";
  }
  if (jd.includes("data scientist") || jd.includes("machine learning") || jd.includes("ml engineer") || jd.includes("ai") || jd.includes("deep learning")) {
    return "data scientist";
  }
  if (jd.includes("devops") || jd.includes("sre") || jd.includes("infrastructure") || jd.includes("cloud")) {
    return "software engineer";
  }
  if (jd.includes("software") || jd.includes("developer") || jd.includes("engineer") || jd.includes("full stack") || jd.includes("fullstack")) {
    return "software engineer";
  }
  return "software engineer";
}

// Get questions for a specific role, type, and difficulty
function getQuestionsForRole(role: string, type: QuestionType, difficulty: Difficulty): string[] {
  const roleKey = Object.keys(ROLE_QUESTIONS).find((k) => role.toLowerCase().includes(k));
  if (roleKey) {
    return ROLE_QUESTIONS[roleKey][type][difficulty];
  }
  return GENERIC_QUESTIONS[type][difficulty];
}

// Generate a set of questions for an interview session
export function generateQuestions(
  role: string,
  resumeSkills: string[],
  difficulty: Difficulty,
  totalQuestions: number,
): GeneratedQuestion[] {
  const questions: GeneratedQuestion[] = [];
  const types: QuestionType[] = ["technical", "conceptual", "behavioral", "scenario"];

  // Determine distribution based on role
  const typeDistribution: QuestionType[] = [];
  if (role.includes("frontend") || role.includes("backend")) {
    for (let i = 0; i < totalQuestions; i++) {
      if (i % 4 === 0) typeDistribution.push("technical");
      else if (i % 4 === 1) typeDistribution.push("conceptual");
      else if (i % 4 === 2) typeDistribution.push("behavioral");
      else typeDistribution.push("scenario");
    }
  } else {
    for (let i = 0; i < totalQuestions; i++) {
      if (i % 4 === 0) typeDistribution.push("technical");
      else if (i % 4 === 1) typeDistribution.push("behavioral");
      else if (i % 4 === 2) typeDistribution.push("scenario");
      else typeDistribution.push("conceptual");
    }
  }

  let currentDifficulty = difficulty;
  const usedQuestions = new Set<string>();

  for (let i = 0; i < totalQuestions; i++) {
    const qType = typeDistribution[i];
    const pool = getQuestionsForRole(role, qType, currentDifficulty);

    // Find unused question
    let qText = pool.find((q) => !usedQuestions.has(q));
    if (!qText) {
      // If all used, fall back to generic
      const genericPool = GENERIC_QUESTIONS[qType][currentDifficulty];
      qText = genericPool.find((q) => !usedQuestions.has(q)) || genericPool[0];
    }

    if (qText) {
      usedQuestions.add(qText);
    }

    // Customize question with skills if applicable
    let finalText = qText || "Describe your experience with this technology.";
    if (resumeSkills.length > 0 && Math.random() > 0.5) {
      const skill = resumeSkills[Math.floor(Math.random() * resumeSkills.length)];
      if (qType === "technical" && !finalText.toLowerCase().includes(skill.toLowerCase())) {
        finalText = `Regarding ${skill}: ${finalText}`;
      }
    }

    const timeLimits: Record<Difficulty, number> = { easy: 90, medium: 120, hard: 180 };

    questions.push({
      questionText: finalText,
      questionType: qType,
      difficulty: currentDifficulty,
      category: role,
      expectedAnswer: "A comprehensive answer demonstrating understanding of the concept with practical examples.",
      timeLimit: timeLimits[currentDifficulty],
    });
  }

  return questions;
}

// Evaluate a response and return scores
export function evaluateResponse(
  question: GeneratedQuestion,
  response: string,
  responseTime: number,
): { scores: ScoreBreakdown; feedback: string; aiEvaluation: string } {
  const wordCount = response.split(/\s+/).filter((w) => w.length > 0).length;
  const sentences = response.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  // Calculate time efficiency (0-100)
  const timeRatio = responseTime / question.timeLimit;
  let timeEfficiency = 0;
  if (timeRatio <= 0.3) timeEfficiency = 40; // Too fast, might be too brief
  else if (timeRatio <= 0.6) timeEfficiency = 80; // Good pace
  else if (timeRatio <= 0.9) timeEfficiency = 95; // Excellent time management
  else if (timeRatio <= 1.0) timeEfficiency = 75; // Used most of time
  else timeEfficiency = 50; // Went over time

  // Calculate clarity based on response structure
  const hasStructure = response.includes("first") || response.includes("second") || response.includes("finally") || response.includes("however") || response.includes("therefore");
  const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
  let clarity = 50;
  if (hasStructure && avgSentenceLength > 5 && avgSentenceLength < 25) clarity = 85;
  else if (hasStructure) clarity = 70;
  else if (avgSentenceLength > 10) clarity = 60;
  else clarity = 45;

  // Calculate depth based on response length and specificity
  const hasExamples = response.toLowerCase().includes("example") || response.toLowerCase().includes("instance") || response.toLowerCase().includes("such as");
  const hasDetails = wordCount > 50;
  let depth = 40;
  if (hasExamples && hasDetails) depth = 90;
  else if (hasExamples) depth = 75;
  else if (hasDetails) depth = 65;
  else depth = 40;

  // Calculate relevance based on keyword matching with expected answer
  const responseWords = response.toLowerCase().split(/\s+/);
  const expectedWords = question.expectedAnswer.toLowerCase().split(/\s+/);
  const commonWords = responseWords.filter((w) => expectedWords.some((ew) => ew.includes(w) || w.includes(ew)));
  const relevance = Math.min(95, Math.max(30, (commonWords.length / Math.max(expectedWords.length, 10)) * 100));

  // Calculate accuracy based on confidence indicators and content quality
  const hasConfidenceIndicators = response.toLowerCase().includes("because") || response.toLowerCase().includes("since") || response.toLowerCase().includes("therefore");
  const hasUncertainty = response.toLowerCase().includes("i think") || response.toLowerCase().includes("maybe") || response.toLowerCase().includes("not sure");
  let accuracy = 60;
  if (hasConfidenceIndicators && !hasUncertainty) accuracy = 85;
  else if (hasConfidenceIndicators) accuracy = 75;
  else if (!hasUncertainty) accuracy = 65;
  else accuracy = 45;

  // Adjust scores based on difficulty
  const difficultyMultiplier = question.difficulty === "easy" ? 1.1 : question.difficulty === "medium" ? 1.0 : 0.9;

  const scores: ScoreBreakdown = {
    accuracy: Math.min(100, Math.round(accuracy * difficultyMultiplier)),
    clarity: Math.min(100, Math.round(clarity * difficultyMultiplier)),
    depth: Math.min(100, Math.round(depth * difficultyMultiplier)),
    relevance: Math.min(100, Math.round(relevance * difficultyMultiplier)),
    timeEfficiency: Math.min(100, Math.round(timeEfficiency)),
    overall: 0,
  };

  scores.overall = Math.round(
    (scores.accuracy * 0.25 + scores.clarity * 0.2 + scores.depth * 0.25 + scores.relevance * 0.2 + scores.timeEfficiency * 0.1),
  );

  // Generate feedback
  const feedbackParts: string[] = [];
  if (scores.accuracy >= 80) feedbackParts.push("Excellent technical accuracy.");
  else if (scores.accuracy >= 60) feedbackParts.push("Good understanding, but some inaccuracies present.");
  else feedbackParts.push("Work on improving technical accuracy.");

  if (scores.clarity >= 80) feedbackParts.push("Very clear and well-structured response.");
  else if (scores.clarity >= 60) feedbackParts.push("Response is reasonably clear but could be better organized.");
  else feedbackParts.push("Try to structure your answers more clearly.");

  if (scores.depth >= 80) feedbackParts.push("Great depth with strong examples.");
  else if (scores.depth >= 60) feedbackParts.push("Good depth, but more specific examples would help.");
  else feedbackParts.push("Provide more detailed explanations with examples.");

  if (timeEfficiency < 60) feedbackParts.push("Try to manage your time better.");

  const aiEvaluation = `This ${question.questionType} question at ${question.difficulty} difficulty level assessed ${question.category} skills. The candidate's response was ${scores.overall >= 75 ? "strong" : scores.overall >= 50 ? "average" : "below expectations"}, demonstrating ${scores.accuracy >= 70 ? "solid" : "developing"} technical knowledge with ${scores.clarity >= 70 ? "clear" : "improving"} communication. ${scores.depth >= 70 ? "The answer showed good depth" : "More depth and specific examples would strengthen this response"}. ${scores.relevance >= 70 ? "The response was well-targeted to the question" : "Try to keep responses more focused on the specific question asked"}. Time management was ${scores.timeEfficiency >= 70 ? "good" : "needs improvement"}.`;

  return {
    scores,
    feedback: feedbackParts.join(" "),
    aiEvaluation,
  };
}

// Determine next difficulty based on recent performance
export function adaptDifficulty(
  recentScores: number[],
  currentDifficulty: Difficulty,
): Difficulty {
  if (recentScores.length < 2) return currentDifficulty;

  const avgRecent = recentScores.slice(-2).reduce((a, b) => a + b, 0) / 2;

  if (avgRecent >= 80 && currentDifficulty === "easy") return "medium";
  if (avgRecent >= 80 && currentDifficulty === "medium") return "hard";
  if (avgRecent < 50 && currentDifficulty === "hard") return "medium";
  if (avgRecent < 50 && currentDifficulty === "medium") return "easy";

  return currentDifficulty;
}

// Check if interview should be terminated early
export function shouldTerminateEarly(scores: number[], questionsAnswered: number): { shouldTerminate: boolean; reason?: string } {
  if (questionsAnswered < 3) return { shouldTerminate: false };

  const recentScores = scores.slice(-3);
  const avgRecent = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;

  if (avgRecent < 30) {
    return {
      shouldTerminate: true,
      reason: "Performance consistently below threshold. Multiple consecutive low scores indicate significant gaps in required knowledge.",
    };
  }

  // Check for declining trend
  if (recentScores.length >= 3 && recentScores[0] > recentScores[1] && recentScores[1] > recentScores[2] && recentScores[2] < 40) {
    return {
      shouldTerminate: true,
      reason: "Declining performance trend detected. Candidate showing difficulty with progressively harder questions.",
    };
  }

  return { shouldTerminate: false };
}

// Calculate final readiness score
export function calculateReadinessScore(allScores: ScoreBreakdown[]): {
  readinessScore: number;
  category: string;
  skillAreas: SkillArea[];
  strengths: string[];
  weaknesses: string[];
  summary: string;
} {
  if (allScores.length === 0) {
    return {
      readinessScore: 0,
      category: "No Data",
      skillAreas: [],
      strengths: [],
      weaknesses: [],
      summary: "No responses recorded.",
    };
  }

  const avgAccuracy = Math.round(allScores.reduce((s, r) => s + r.accuracy, 0) / allScores.length);
  const avgClarity = Math.round(allScores.reduce((s, r) => s + r.clarity, 0) / allScores.length);
  const avgDepth = Math.round(allScores.reduce((s, r) => s + r.depth, 0) / allScores.length);
  const avgRelevance = Math.round(allScores.reduce((s, r) => s + r.relevance, 0) / allScores.length);
  const avgTimeEff = Math.round(allScores.reduce((s, r) => s + r.timeEfficiency, 0) / allScores.length);
  const avgOverall = Math.round(allScores.reduce((s, r) => s + r.overall, 0) / allScores.length);

  // Weighted readiness score (0-100)
  const readinessScore = Math.round(
    avgAccuracy * 0.25 + avgClarity * 0.15 + avgDepth * 0.25 + avgRelevance * 0.2 + avgTimeEff * 0.15,
  );

  const skillAreas: SkillArea[] = [
    { name: "Technical Accuracy", score: avgAccuracy, maxScore: 100 },
    { name: "Communication Clarity", score: avgClarity, maxScore: 100 },
    { name: "Answer Depth", score: avgDepth, maxScore: 100 },
    { name: "Relevance", score: avgRelevance, maxScore: 100 },
    { name: "Time Management", score: avgTimeEff, maxScore: 100 },
  ];

  const strengths: string[] = [];
  const weaknesses: string[] = [];

  if (avgAccuracy >= 75) strengths.push("Strong technical knowledge and accuracy");
  else weaknesses.push("Technical accuracy needs improvement");

  if (avgClarity >= 75) strengths.push("Excellent communication and clarity");
  else weaknesses.push("Work on structuring and articulating answers more clearly");

  if (avgDepth >= 75) strengths.push("Deep understanding with good examples");
  else weaknesses.push("Provide more detailed answers with specific examples");

  if (avgRelevance >= 75) strengths.push("Stays focused and relevant to questions");
  else weaknesses.push("Keep responses more targeted to the specific question");

  if (avgTimeEff >= 75) strengths.push("Good time management during responses");
  else weaknesses.push("Practice time management for interview responses");

  let category: string;
  let summary: string;

  if (readinessScore >= 80) {
    category = "Strong Candidate";
    summary = `Excellent interview performance with a readiness score of ${readinessScore}/100. The candidate demonstrates strong technical knowledge, clear communication, and good problem-solving abilities. Well-prepared for the role.`;
  } else if (readinessScore >= 60) {
    category = "Average - Shows Potential";
    summary = `Moderate interview performance with a readiness score of ${readinessScore}/100. The candidate has a foundational understanding but needs improvement in some areas. With focused preparation, they could become a strong candidate.`;
  } else if (readinessScore >= 40) {
    category = "Needs Improvement";
    summary = `Below average performance with a readiness score of ${readinessScore}/100. The candidate shows some understanding but has significant gaps. Structured learning and practice are recommended before attempting interviews.`;
  } else {
    category = "Not Ready";
    summary = `Significant gaps in interview readiness with a score of ${readinessScore}/100. The candidate needs substantial preparation across multiple areas before being ready for technical interviews.`;
  }

  return {
    readinessScore,
    category,
    skillAreas,
    strengths,
    weaknesses,
    summary,
  };
}

// Generate feedback for improvement
export function generateActionableFeedback(weaknesses: string[]): string[] {
  const actionItems: Record<string, string> = {
    "Technical accuracy needs improvement": "Review core technical concepts related to your target role. Practice explaining concepts clearly without jargon.",
    "Work on structuring and articulating answers more clearly": "Use the STAR method (Situation, Task, Action, Result) for behavioral questions. Practice with a friend or record yourself.",
    "Provide more detailed answers with specific examples": "Prepare 5-10 specific examples from your experience before interviews. Use the 'Context, Action, Result' framework.",
    "Keep responses more targeted to the specific question": "Practice active listening. Take a moment to understand the question before answering. Stay focused on what was asked.",
    "Practice time management for interview responses": "Time yourself when practicing. Aim for 1-2 minute responses. Use concise language and avoid rambling.",
  };

  return weaknesses.map((w) => actionItems[w] || `Work on: ${w}`);
}

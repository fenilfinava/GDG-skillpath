export const roles = [
  { id: 'sde', title: 'Software Development Engineer', category: 'Engineering' },
  { id: 'data_analyst', title: 'Data Analyst', category: 'Data' },
  { id: 'ml_engineer', title: 'Machine Learning Engineer', category: 'AI/ML' },
  { id: 'product_analyst', title: 'Product Analyst', category: 'Product' },
  { id: 'fullstack', title: 'Full Stack Developer', category: 'Engineering' }
];

export const mockUser = {
  name: "Aditi Sharma",
  email: "aditi@example.com",
  targetRole: "Software Development Engineer",
  readinessScore: 65,
  streak: 12,
  hoursPerWeek: 15,
  deadline: "4 months"
};

export const skillGaps = [
  { id: 1, name: "Data Structures & Algorithms", currentLevel: 40, targetLevel: 90, priority: "Critical", category: "Core" },
  { id: 2, name: "System Design", currentLevel: 20, targetLevel: 75, priority: "Important", category: "Architecture" },
  { id: 3, name: "React.js", currentLevel: 60, targetLevel: 80, priority: "Important", category: "Frontend" },
  { id: 4, name: "Node.js", currentLevel: 50, targetLevel: 70, priority: "Nice-to-have", category: "Backend" },
  { id: 5, name: "AWS Basics", currentLevel: 10, targetLevel: 50, priority: "Nice-to-have", category: "Cloud" }
];

export const roadmapPhases = [
  {
    id: 'phase1',
    title: 'Foundation',
    status: 'completed',
    tasks: [
      { id: 't1', title: 'Advanced JavaScript Concepts', type: 'course', duration: '5 hrs', completed: true },
      { id: 't2', title: 'React Hooks Deep Dive', type: 'course', duration: '8 hrs', completed: true },
    ]
  },
  {
    id: 'phase2',
    title: 'Intermediate (Current)',
    status: 'in-progress',
    tasks: [
      { id: 't3', title: 'DSA: Trees & Graphs', type: 'practice', duration: '12 hrs', completed: false, recommended: true, rationale: "Crucial for SDE interviews at top companies." },
      { id: 't4', title: 'Build a REST API with Node', type: 'project', duration: '15 hrs', completed: false },
    ]
  },
  {
    id: 'phase3',
    title: 'Advanced',
    status: 'locked',
    tasks: [
      { id: 't5', title: 'System Design Fundamentals', type: 'course', duration: '10 hrs', completed: false },
      { id: 't6', title: 'Full Stack E-commerce Project', type: 'project', duration: '25 hrs', completed: false },
    ]
  },
  {
    id: 'phase4',
    title: 'Interview Ready',
    status: 'locked',
    tasks: [
      { id: 't7', title: 'Mock Interview (Technical)', type: 'interview', duration: '2 hrs', completed: false },
      { id: 't8', title: 'Resume Polish & Portfolio', type: 'career', duration: '3 hrs', completed: false },
    ]
  }
];

export const interviewQuestions = [
  { id: 1, type: "Technical", difficulty: "Medium", question: "Explain the difference between a process and a thread.", topic: "OS" },
  { id: 2, type: "Technical", difficulty: "Hard", question: "Design a URL shortening service like bit.ly.", topic: "System Design" },
  { id: 3, type: "Behavioral", difficulty: "Medium", question: "Tell me about a time you had to work with a difficult team member.", topic: "Soft Skills" },
  { id: 4, type: "Technical", difficulty: "Medium", question: "Write a function to detect a cycle in a linked list.", topic: "DSA" }
];

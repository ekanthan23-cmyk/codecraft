export type LearningResourceSource = {
  id: string;
  title: string;
  topic: string;
  level: "Beginner" | "Intermediate";
  format: "Guide" | "Interactive" | "Reference";
  description: string;
  url: string;
};

/** Curated public references prepared for CodeCraft students. */
export const verifiedLearningResourceSources: LearningResourceSource[] = [
  {
    id: "java-learn",
    title: "Learn Java",
    topic: "Java",
    level: "Beginner",
    format: "Guide",
    description: "Move from your first Java application into language basics, classes, objects, collections, and practical tooling.",
    url: "https://dev.java/learn/",
  },
  {
    id: "python-tutorial",
    title: "The Python Tutorial",
    topic: "Python",
    level: "Beginner",
    format: "Guide",
    description: "Follow a structured tour through Python syntax, control flow, functions, lists, modules, errors, and classes.",
    url: "https://docs.python.org/3/tutorial/",
  },
  {
    id: "cpp-reference",
    title: "C++ Reference",
    topic: "C++",
    level: "Intermediate",
    format: "Reference",
    description: "Use a comprehensive C++ language and standard-library reference while practicing vectors, algorithms, and containers.",
    url: "https://en.cppreference.com/w/cpp",
  },
  {
    id: "learncpp-starter",
    title: "Learn C++: Start Here",
    topic: "C++",
    level: "Beginner",
    format: "Guide",
    description: "Begin with no assumed experience, then learn how to write, compile, debug, and improve your first C++ programs.",
    url: "https://www.learncpp.com/",
  },
  {
    id: "c-reference",
    title: "C Reference",
    topic: "C",
    level: "Intermediate",
    format: "Reference",
    description: "Consult C language fundamentals, functions, headers, input/output, strings, and standard-library references as you practice.",
    url: "https://en.cppreference.com/w/c",
  },
  {
    id: "c-programiz-starter",
    title: "C Programming: Beginner’s Guide",
    topic: "C",
    level: "Beginner",
    format: "Guide",
    description: "Work through C fundamentals, variables, control flow, functions, arrays, pointers, and practical examples one step at a time.",
    url: "https://www.programiz.com/c-programming",
  },
  {
    id: "mdn-web-development",
    title: "MDN Learn Web Development",
    topic: "HTML · CSS · JavaScript",
    level: "Beginner",
    format: "Guide",
    description: "Start with structured web-development modules, then progress through HTML, CSS, and JavaScript foundations.",
    url: "https://developer.mozilla.org/en-US/docs/Learn_web_development",
  },
  {
    id: "react-quick-start",
    title: "React Quick Start",
    topic: "React",
    level: "Beginner",
    format: "Guide",
    description: "Learn component composition, JSX, rendering data, interaction, and state through React’s official learning path.",
    url: "https://react.dev/learn",
  },
  {
    id: "sqlbolt",
    title: "SQLBolt Interactive Lessons",
    topic: "SQL · Database",
    level: "Beginner",
    format: "Interactive",
    description: "Learn SELECT queries, constraints, schema changes, and database fundamentals through browser-based exercises.",
    url: "https://sqlbolt.com/",
  },
  {
    id: "cp-algorithms",
    title: "Algorithms for Competitive Programming",
    topic: "DSA · Graphs · DP",
    level: "Intermediate",
    format: "Reference",
    description: "Use detailed references for data structures, graph traversal, dynamic programming, geometry, strings, and algorithms.",
    url: "https://cp-algorithms.com/",
  },
  {
    id: "dsa-starter-map",
    title: "DSA Step-by-Step Starter Map",
    topic: "DSA · Graphs · DP",
    level: "Beginner",
    format: "Guide",
    description: "Start with arrays, strings, linked lists, stacks, queues, trees, graphs, and easy practice before moving to advanced patterns.",
    url: "https://www.geeksforgeeks.org/dsa/dsa-tutorial-learn-data-structures-and-algorithms/",
  },
];

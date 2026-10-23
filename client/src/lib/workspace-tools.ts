import { Code2, Database, FileCode2, Globe2, Sparkles, type LucideIcon } from "lucide-react";

export type WorkspaceTool = {
  slug: "java" | "python" | "cpp" | "html" | "css" | "javascript" | "react" | "sql";
  label: string;
  mark: string;
  icon: LucideIcon;
  accent: string;
  courseSlug: string;
  courseTitle: string;
  lessonSlug: string;
  lessonTitle: string;
  editorFile: string;
  language: string;
  intro: string;
  prompt: string;
  concepts: string[];
  outputText: string;
  tutorNote: string;
  starterCode: string;
};

export const workspaceTools: WorkspaceTool[] = [
  { slug: "java", label: "Java", mark: "J", icon: Code2, accent: "border-[#e99a64]/45 bg-[#e99a64]/10 text-[#ffc09a]", courseSlug: "java-full-stack", courseTitle: "Java Full Stack", lessonSlug: "java-classes-objects", lessonTitle: "Classes & Objects", editorFile: "Main.java", language: "java", intro: "Give objects a useful shape.", prompt: "Create a Student object, then inspect the value it carries.", concepts: ["Classes", "Fields", "Constructors"], outputText: "Adam", tutorNote: "A constructor receives values for a new object and stores them on that object’s fields.", starterCode: `public class Main {\n  public static void main(String[] args) {\n    Student learner = new Student("Adam");\n    System.out.println(learner.name);\n  }\n}` },
  { slug: "python", label: "Python", mark: "Py", icon: FileCode2, accent: "border-[#63d8bd]/45 bg-[#63d8bd]/10 text-[#8cf3db]", courseSlug: "python-foundations", courseTitle: "Python Foundations", lessonSlug: "python-functions", lessonTitle: "Functions & Parameters", editorFile: "main.py", language: "python", intro: "Turn repeated logic into clear functions.", prompt: "Pass a name into a function, then return a useful greeting.", concepts: ["Functions", "Parameters", "Return values"], outputText: "Hello, learner!", tutorNote: "Functions let you name a repeatable step and pass in the values it needs.", starterCode: `def greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("learner"))` },
  { slug: "cpp", label: "C++", mark: "C++", icon: FileCode2, accent: "border-[#92a9ff]/45 bg-[#92a9ff]/10 text-[#c0cbff]", courseSlug: "cpp-core", courseTitle: "C++ Core", lessonSlug: "cpp-vectors", lessonTitle: "Vectors & Iteration", editorFile: "main.cpp", language: "cpp", intro: "Store a sequence, then traverse it with intent.", prompt: "Add three values to a vector and print each value in order.", concepts: ["Vectors", "Loops", "References"], outputText: "3\n5\n8", tutorNote: "Vectors grow as you add values and let you iterate safely over a sequence.", starterCode: `#include <iostream>\n#include <vector>\n\nint main() {\n  std::vector<int> scores = {3, 5, 8};\n  for (int score : scores) std::cout << score << "\\n";\n}` },
  { slug: "html", label: "HTML", mark: "<>", icon: Globe2, accent: "border-[#ff9d71]/45 bg-[#ff9d71]/10 text-[#ffc2a6]", courseSlug: "web-foundations", courseTitle: "Web Foundations", lessonSlug: "html-semantic-layout", lessonTitle: "Semantic Page Structure", editorFile: "index.html", language: "html", intro: "Give your page a structure people and browsers understand.", prompt: "Build a compact article using meaningful HTML elements.", concepts: ["Main", "Article", "Heading hierarchy"], outputText: "Live preview ready", tutorNote: "Semantic elements explain the role of content before any visual styling is added.", starterCode: `<main>\n  <article>\n    <h1>My learning log</h1>\n    <p>Today I built a semantic page.</p>\n  </article>\n</main>` },
  { slug: "css", label: "CSS", mark: "#", icon: Sparkles, accent: "border-[#ba9dff]/45 bg-[#ba9dff]/10 text-[#dac9ff]", courseSlug: "web-foundations", courseTitle: "Web Foundations", lessonSlug: "css-layout", lessonTitle: "Flexible Layout", editorFile: "styles.css", language: "css", intro: "Shape a layout that adapts to the space around it.", prompt: "Use a flexible row to align a title and a small action.", concepts: ["Flexbox", "Gap", "Alignment"], outputText: "Styles applied", tutorNote: "Flexbox distributes space along one axis, making aligned components easier to compose.", starterCode: `.toolbar {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: 1rem;\n}` },
  { slug: "javascript", label: "JavaScript", mark: "JS", icon: Code2, accent: "border-[#f4cb5d]/45 bg-[#f4cb5d]/10 text-[#ffe48b]", courseSlug: "javascript-essentials", courseTitle: "JavaScript Essentials", lessonSlug: "javascript-arrays", lessonTitle: "Arrays & Methods", editorFile: "app.js", language: "javascript", intro: "Transform a list into a result your interface can use.", prompt: "Map a small list of numbers into their doubled values.", concepts: ["Arrays", "map()", "Arrow functions"], outputText: "2, 4, 6", tutorNote: "Array methods express how data changes without manually managing a loop counter.", starterCode: `const values = [1, 2, 3];\nconst doubled = values.map(value => value * 2);\n\nconsole.log(doubled.join(", "));` },
  { slug: "react", label: "React", mark: "R", icon: Sparkles, accent: "border-[#65d2ff]/45 bg-[#65d2ff]/10 text-[#9ce5ff]", courseSlug: "react-ui", courseTitle: "React UI", lessonSlug: "react-components", lessonTitle: "Components & Props", editorFile: "Greeting.jsx", language: "react", intro: "Compose an interface from small, purposeful components.", prompt: "Pass a learner name through a component prop and render it.", concepts: ["Components", "Props", "JSX"], outputText: "Hello, learner", tutorNote: "Props are the inputs a component receives, allowing one component pattern to serve many cases.", starterCode: `export function Greeting({ name }) {\n  return <h1>Hello, {name}</h1>;\n}\n\nexport default function App() {\n  return <Greeting name="learner" />;\n}` },
  { slug: "sql", label: "Database", mark: "SQL", icon: Database, accent: "border-[#61d6ad]/45 bg-[#61d6ad]/10 text-[#94efcf]", courseSlug: "database-foundations", courseTitle: "Database Foundations", lessonSlug: "sql-select", lessonTitle: "Querying with SELECT", editorFile: "query.sql", language: "sql", intro: "Ask a database for exactly the information you need.", prompt: "Select a learner name and progress score from the progress table.", concepts: ["SELECT", "FROM", "ORDER BY"], outputText: "learner | 62", tutorNote: "A SELECT query names the fields you need, then identifies the table that owns them.", starterCode: `SELECT learner_name, progress_percent\nFROM learning_progress\nORDER BY progress_percent DESC;` },
];

export const defaultWorkspaceTool = workspaceTools[0];

export function isWorkspaceToolSlug(value: string): value is WorkspaceTool["slug"] {
  return workspaceTools.some(tool => tool.slug === value);
}

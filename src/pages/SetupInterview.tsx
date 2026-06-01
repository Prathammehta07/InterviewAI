import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { motion } from "framer-motion";
import {
  Upload,
  FileText,
  Briefcase,
  Settings,
  ArrowRight,
  Sparkles,
  Loader2,
  Brain,
  Target,
  Clock,
  AlertCircle,
  Video,
  MessageSquare,
} from "lucide-react";
import { useState, useRef } from "react";

const sampleJDs: { label: string; text: string }[] = [
  {
    label: "Frontend Developer",
    text: "We are looking for a Frontend Developer with 2+ years of experience in React, TypeScript, and modern CSS frameworks. You will build responsive web applications, optimize performance, and collaborate with designers and backend teams. Experience with Next.js, state management (Redux/Zustand), and testing frameworks is a plus.",
  },
  {
    label: "Backend Developer",
    text: "Seeking a Backend Developer proficient in Node.js, Python, or Java. You will design RESTful APIs, work with SQL and NoSQL databases, and implement microservices architecture. Experience with cloud platforms (AWS/GCP), Docker, Kubernetes, and CI/CD pipelines is required. Knowledge of message queues and caching strategies is a plus.",
  },
  {
    label: "Software Engineer",
    text: "Looking for a Software Engineer with strong fundamentals in data structures, algorithms, and system design. You will develop scalable applications, write clean code, participate in code reviews, and mentor junior developers. Experience with Agile methodologies, version control (Git), and full-stack development is preferred.",
  },
  {
    label: "Data Scientist",
    text: "Hiring a Data Scientist with expertise in machine learning, statistical analysis, and data visualization. You will build predictive models, work with large datasets, and communicate insights to stakeholders. Proficiency in Python, SQL, TensorFlow/PyTorch, and experience with NLP or computer vision is highly desirable.",
  },
];

const sampleResumes: { label: string; text: string }[] = [
  {
    label: "Frontend Dev",
    text: "John Doe - Software Engineer with 3 years of experience building web applications using React, TypeScript, and Next.js. Proficient in HTML, CSS, Tailwind CSS, and state management with Redux. Experience with REST APIs, GraphQL, and testing using Jest and Cypress. Built responsive dashboards and e-commerce platforms. Familiar with CI/CD pipelines, Git workflows, and Agile development.",
  },
  {
    label: "Backend Dev",
    text: "Jane Smith - Backend Developer with 4 years of experience in Node.js, Python, and Java. Expertise in designing RESTful APIs, database optimization with PostgreSQL and MongoDB. Experience with microservices, Docker, Kubernetes, and AWS cloud services. Implemented caching strategies with Redis, message queues with RabbitMQ. Strong understanding of system design, data structures, and algorithms.",
  },
  {
    label: "Full Stack",
    text: "Alex Johnson - Full Stack Developer with 5 years of experience. Frontend: React, Vue.js, TypeScript, Tailwind CSS. Backend: Node.js, Express, Python Django. Databases: PostgreSQL, MongoDB, Redis. DevOps: Docker, AWS, CI/CD with GitHub Actions. Built SaaS platforms, real-time chat applications, and e-commerce systems. Strong problem-solving skills and experience with Agile/Scrum methodologies.",
  },
];

export default function SetupInterview() {
  const { isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [totalQuestions, setTotalQuestions] = useState([10]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [interviewMode, setInterviewMode] = useState<'text' | 'video'>('text');

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Interview title is required";
    if (resumeText.trim().length < 10) newErrors.resume = "Please provide a more detailed resume";
    if (jobDescription.trim().length < 10) newErrors.jd = "Please provide a more detailed job description";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    
    setIsCreating(true);
    
    // Generate a unique session ID
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Save interview session to localStorage
    const sessionData = {
      sessionId,
      title,
      resumeText,
      jobDescription,
      difficulty,
      totalQuestions: totalQuestions[0],
      createdAt: new Date().toISOString(),
      status: "active",
    };
    
    // Store in localStorage
    localStorage.setItem(`interview_${sessionId}`, JSON.stringify(sessionData));
    
    // Add to user's interviews list
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const interviewsKey = `interviews_${user.email}`;
      const existingInterviews = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
      existingInterviews.push({ sessionId, title, createdAt: sessionData.createdAt });
      localStorage.setItem(interviewsKey, JSON.stringify(existingInterviews));
    }
    
    // Navigate to the interview
    setTimeout(() => {
      if (interviewMode === 'video') {
        navigate(`/video/${sessionId}`);
      } else {
        navigate(`/interview/${sessionId}`);
      }
    }, 500);
  };

  const difficultyConfig = {
    easy: { label: "Easy", description: "Basic questions with generous time limits", color: "bg-emerald-100 text-emerald-700 border-emerald-300" },
    medium: { label: "Medium", description: "Standard interview difficulty with moderate timing", color: "bg-amber-100 text-amber-700 border-amber-300" },
    hard: { label: "Hard", description: "Challenging questions with strict time limits", color: "bg-red-100 text-red-700 border-red-300" },
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-10">
            <Badge variant="secondary" className="mb-3">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Setup Interview
            </Badge>
            <h1 className="text-3xl font-bold mb-2">Configure Your Mock Interview</h1>
            <p className="text-muted-foreground">
              Provide your resume and target job description for a personalized interview experience.
            </p>
          </div>

          <div className="space-y-6">
            {/* Interview Title */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-600" />
                  Interview Title
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  placeholder="e.g., Frontend Developer Interview at Google"
                  value={title}
                  onChange={(e) => {
                    setTitle(e.target.value);
                    if (errors.title) setErrors((prev) => ({ ...prev, title: "" }));
                  }}
                  className={errors.title ? "border-red-500" : ""}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.title}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Resume Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-4 h-4 text-violet-600" />
                  Your Resume
                </CardTitle>
                <CardDescription>
                  Paste your resume content or use a sample to get started quickly.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sampleResumes.map((sample) => (
                    <Button
                      key={sample.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setResumeText(sample.text);
                        if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {sample.label}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Paste your resume here... Include your skills, experience, projects, and education."
                  value={resumeText}
                  onChange={(e) => {
                    setResumeText(e.target.value);
                    if (errors.resume) setErrors((prev) => ({ ...prev, resume: "" }));
                  }}
                  className={`min-h-[150px] ${errors.resume ? "border-red-500" : ""}`}
                />
                {errors.resume && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.resume}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Job Description Input */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-violet-600" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste the job description for the role you're targeting.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-3">
                  {sampleJDs.map((jd) => (
                    <Button
                      key={jd.label}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setJobDescription(jd.text);
                        if (errors.jd) setErrors((prev) => ({ ...prev, jd: "" }));
                      }}
                    >
                      <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                      {jd.label}
                    </Button>
                  ))}
                </div>
                <Textarea
                  placeholder="Paste the job description here..."
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (errors.jd) setErrors((prev) => ({ ...prev, jd: "" }));
                  }}
                  className={`min-h-[150px] ${errors.jd ? "border-red-500" : ""}`}
                />
                {errors.jd && (
                  <p className="text-sm text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {errors.jd}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Settings */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="w-4 h-4 text-violet-600" />
                  Interview Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Difficulty */}
                <div>
                  <Label className="text-sm font-medium mb-3 block">Difficulty Level</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {(Object.keys(difficultyConfig) as Array<"easy" | "medium" | "hard">).map((level) => (
                      <button
                        key={level}
                        onClick={() => setDifficulty(level)}
                        className={`p-3 rounded-lg border-2 text-left transition-all ${
                          difficulty === level
                            ? difficultyConfig[level].color
                            : "border-muted bg-background hover:bg-secondary"
                        }`}
                      >
                        <div className="font-semibold text-sm">{difficultyConfig[level].label}</div>
                        <div className="text-xs mt-1 opacity-80">{difficultyConfig[level].description}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Number of Questions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="text-sm font-medium">Number of Questions</Label>
                    <Badge variant="secondary">{totalQuestions[0]} questions</Badge>
                  </div>
                  <Slider
                    value={totalQuestions}
                    onValueChange={setTotalQuestions}
                    min={5}
                    max={20}
                    step={1}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Submit */}
            {/* Interview Mode Selector */}
            <div className="flex gap-3 mb-4 justify-center">
              <Button
                variant={interviewMode === 'text' ? 'default' : 'outline'}
                onClick={() => setInterviewMode('text')}
                className={`gap-2 ${interviewMode === 'text' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700' : ''}`}
              >
                <MessageSquare className="w-4 h-4" />
                Text Interview
              </Button>
              <Button
                variant={interviewMode === 'video' ? 'default' : 'outline'}
                onClick={() => setInterviewMode('video')}
                className={`gap-2 ${interviewMode === 'video' ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700' : ''}`}
              >
                <Video className="w-4 h-4" />
                Video Interview
              </Button>
            </div>

            <motion.div
              className="flex justify-center"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={isCreating}
                className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-10 py-6"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Setting up Interview...
                  </>
                ) : (
                  <>
                    {interviewMode === 'video' ? <Video className="w-5 h-5" /> : <Brain className="w-5 h-5" />}
                    Start {interviewMode === 'video' ? 'Video' : 'AI'} Interview
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

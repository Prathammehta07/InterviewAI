import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import {
  Award,
  ArrowLeft,
  TrendingUp,
  Target,
  Clock,
  Brain,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  BarChart3,
  FileText,
  Lightbulb,
  Loader2,
  AlertCircle,
  Star,
  ThumbsUp,
  ThumbsDown,
  Download,
} from "lucide-react";
import { useState, useEffect } from "react";

const scoreColors = [
  "#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6",
];

export default function Results() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });

  const [reportData, setReportData] = useState<any>(null);
  const [reportLoading, setReportLoading] = useState(true);
  const [error, setError] = useState<string>('');

  // Function to create sample test data
  const createSampleData = () => {
    const testSessionId = sessionId || `session_${Date.now()}_demo`;
    
    const testSession = {
      sessionId: testSessionId,
      title: "Sample Interview - Frontend Developer",
      resumeText: "Experienced frontend developer with React expertise",
      jobDescription: "Looking for a senior React developer",
      difficulty: "medium",
      totalQuestions: 5,
      status: "completed",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      responses: [
        {
          questionId: 1,
          questionText: "Describe your experience with React and modern frontend frameworks.",
          responseText: "I have 3 years of experience building React applications. I've worked with React Hooks, Context API, and state management libraries like Redux. I've also used Next.js for SSR applications and have experience with TypeScript.",
          responseTime: 95,
          scores: { overall: 85, accuracy: 88, clarity: 82, depth: 80, relevance: 90, timeEfficiency: 85 },
          timestamp: new Date(Date.now() - 3000000).toISOString()
        },
        {
          questionId: 2,
          questionText: "How do you optimize React application performance?",
          responseText: "I use several optimization techniques: React.memo for preventing unnecessary re-renders, useMemo and useCallback for memoization, lazy loading components with React.lazy, code splitting, and virtualizing long lists with react-window.",
          responseTime: 110,
          scores: { overall: 92, accuracy: 95, clarity: 90, depth: 88, relevance: 95, timeEfficiency: 90 },
          timestamp: new Date(Date.now() - 2400000).toISOString()
        },
        {
          questionId: 3,
          questionText: "Explain the difference between useState and useReducer hooks.",
          responseText: "useState is simpler and best for local component state with simple updates. useReducer is better for complex state logic, when next state depends on previous state, or when you need to manage multiple related values. useReducer also makes it easier to test state transitions.",
          responseTime: 88,
          scores: { overall: 88, accuracy: 90, clarity: 85, depth: 92, relevance: 88, timeEfficiency: 88 },
          timestamp: new Date(Date.now() - 1800000).toISOString()
        },
        {
          questionId: 4,
          questionText: "Describe a challenging project you worked on and how you solved it.",
          responseText: "I built a real-time collaborative editing platform. The main challenge was handling concurrent edits. I implemented Operational Transformation algorithm and used WebSockets for real-time sync. I also added conflict resolution and offline support with local storage.",
          responseTime: 125,
          scores: { overall: 78, accuracy: 80, clarity: 75, depth: 82, relevance: 78, timeEfficiency: 75 },
          timestamp: new Date(Date.now() - 1200000).toISOString()
        },
        {
          questionId: 5,
          questionText: "What is your approach to testing frontend applications?",
          responseText: "I follow a testing pyramid approach: Unit tests with Jest for utility functions and components, integration tests with React Testing Library for component interactions, and E2E tests with Cypress for critical user flows. I aim for 80% code coverage.",
          responseTime: 102,
          scores: { overall: 82, accuracy: 85, clarity: 80, depth: 78, relevance: 85, timeEfficiency: 80 },
          timestamp: new Date(Date.now() - 600000).toISOString()
        }
      ]
    };

    // Save to localStorage
    localStorage.setItem(`interview_${testSessionId}`, JSON.stringify(testSession));
    
    // Add to user's interview list
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const interviewsKey = `interviews_${user.email}`;
      const interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
      
      // Check if already exists
      const exists = interviewsList.find((i: any) => i.sessionId === testSessionId);
      if (!exists) {
        interviewsList.push({
          sessionId: testSessionId,
          title: testSession.title,
          status: "completed",
          createdAt: testSession.createdAt,
          completedAt: testSession.completedAt
        });
        localStorage.setItem(interviewsKey, JSON.stringify(interviewsList));
      }
    }

    console.log('✅ Sample data created!');
    console.log('Session ID:', testSessionId);
    
    // Reload the page with the new session
    if (!sessionId) {
      navigate(`/results/${testSessionId}`, { replace: true });
    } else {
      // Force reload current page
      window.location.reload();
    }
  };

  // Function to download report as PDF
  const downloadPDF = () => {
    if (!reportData) return;

    const { session, responses, skillScores, actionableFeedback, overallScore, readinessLevel } = reportData;

    // Create PDF content
    const pdfContent = `
INTERVIEW AI - PERFORMANCE REPORT
====================================

Interview Details:
------------------
Title: ${session.title}
Date: ${new Date(session.createdAt).toLocaleDateString()}
Difficulty: ${session.difficulty}
Status: ${session.status}
Overall Score: ${overallScore}%
Readiness Level: ${readinessLevel}

Skill Performance:
------------------
${skillScores.map((s: any) => `${s.skillName}: ${s.score}/100`).join('\n')}

Question-by-Question Analysis:
-------------------------------
${responses.map((r: any, i: number) => `
Q${i + 1}: ${r.questionText}
Your Answer: ${r.responseText}
Response Time: ${r.responseTime} seconds
Scores:
  - Overall: ${r.scores?.overall || 0}%
  - Accuracy: ${r.scores?.accuracy || 0}%
  - Clarity: ${r.scores?.clarity || 0}%
  - Depth: ${r.scores?.depth || 0}%
  - Relevance: ${r.scores?.relevance || 0}%
  - Time Efficiency: ${r.scores?.timeEfficiency || 0}%
`).join('\n')}

Actionable Feedback:
--------------------
${actionableFeedback.map((f: any) => `• ${f.category}: ${f.feedback}`).join('\n')}

Summary:
--------
Total Questions: ${responses.length}
Average Score: ${overallScore}%
Readiness Level: ${readinessLevel}

${overallScore >= 80 ? 'Excellent! You are interview ready!' : overallScore >= 60 ? 'Good progress! Almost ready for interviews.' : 'Keep practicing! Focus on the areas mentioned above.'}

====================================
Generated by Interview AI
${new Date().toLocaleString()}
    `;

    // Create blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Interview-Report-${session.title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    console.log('PDF downloaded!');
  };

  // Load report from localStorage
  useEffect(() => {
    console.log('=== Results Page useEffect Triggered ===');
    console.log('sessionId from URL:', sessionId);
    
    if (!sessionId) {
      console.log('❌ No sessionId provided in URL');
      setError('No session ID provided in URL');
      setReportLoading(false);
      return;
    }

    console.log('=== Results Page Loading ===');
    console.log('Session ID:', sessionId);
    console.log('Full URL:', window.location.href);
    
    const storedSession = localStorage.getItem(`interview_${sessionId}`);
    
    console.log('localStorage key:', `interview_${sessionId}`);
    console.log('storedSession exists:', !!storedSession);
    
    if (storedSession) {
      console.log('✅ Found session data in localStorage');
      console.log('Session data length:', storedSession.length, 'characters');
      try {
        const session = JSON.parse(storedSession);
        console.log('✅ Parsed session successfully');
        console.log('Session status:', session.status);
        console.log('Session title:', session.title);
        console.log('Session responses:', session.responses);
        
        // Calculate scores from responses
        const responses = session.responses || [];
        console.log('Number of responses:', responses.length);
        
        if (responses.length === 0) {
          console.error('❌ No responses found in session');
          setError('No responses found for this interview. Please complete the interview first.');
          setReportLoading(false);
          return;
        }
        
        // Calculate overall score
        const overallScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.overall || 0), 0) / responses.length)
          : 0;

        // Calculate category scores
        const accuracyScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.accuracy || 0), 0) / responses.length)
          : 0;

        const clarityScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.clarity || 0), 0) / responses.length)
          : 0;

        const depthScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.depth || 0), 0) / responses.length)
          : 0;

        const relevanceScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.relevance || 0), 0) / responses.length)
          : 0;

        const timeEfficiencyScore = responses.length > 0
          ? Math.round(responses.reduce((acc: number, r: any) => acc + (r.scores?.timeEfficiency || 0), 0) / responses.length)
          : 0;

        // Prepare skill scores for radar chart
        const skillScores = [
          { skillName: "Accuracy", score: accuracyScore, maxScore: 100 },
          { skillName: "Clarity", score: clarityScore, maxScore: 100 },
          { skillName: "Depth", score: depthScore, maxScore: 100 },
          { skillName: "Relevance", score: relevanceScore, maxScore: 100 },
          { skillName: "Time Management", score: timeEfficiencyScore, maxScore: 100 },
        ];

        // Generate actionable feedback
        const actionableFeedback = [];
        if (accuracyScore < 70) {
          actionableFeedback.push({
            category: "Accuracy",
            feedback: "Focus on providing more precise and accurate information in your responses.",
            priority: "high",
          });
        }
        if (clarityScore < 70) {
          actionableFeedback.push({
            category: "Communication",
            feedback: "Work on structuring your answers more clearly with specific examples.",
            priority: "medium",
          });
        }
        if (depthScore < 70) {
          actionableFeedback.push({
            category: "Depth",
            feedback: "Try to provide more detailed explanations and demonstrate deeper understanding.",
            priority: "medium",
          });
        }
        if (timeEfficiencyScore < 70) {
          actionableFeedback.push({
            category: "Time Management",
            feedback: "Practice managing your time better during interviews. Don't rush, but stay concise.",
            priority: "low",
          });
        }
        if (actionableFeedback.length === 0) {
          actionableFeedback.push({
            category: "Overall",
            feedback: "Great performance! Continue practicing to maintain and improve your skills.",
            priority: "low",
          });
        }

        // Determine readiness level
        let readinessLevel = "Not Ready";
        if (overallScore >= 80) readinessLevel = "Interview Ready";
        else if (overallScore >= 60) readinessLevel = "Almost Ready";

        setReportData({
          session,
          responses,
          skillScores,
          actionableFeedback,
          overallScore,
          readinessLevel,
        });
        console.log('✅ Report data set successfully');
        console.log('Overall score:', overallScore);
      } catch (err) {
        console.error("❌ Failed to parse session data:", err);
        setError('Failed to parse interview data. Please try again.');
      }
    } else {
      console.error('❌ No session data found in localStorage');
      console.log('Expected key:', `interview_${sessionId}`);
      console.log('All interview keys:', Object.keys(localStorage).filter(k => k.startsWith('interview_')));
      setError(`Interview session not found. Please complete an interview first.`);
    }
    setReportLoading(false);
  }, [sessionId]);

  if (authLoading || reportLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          <p className="text-muted-foreground">Generating your report...</p>
        </div>
      </div>
    );
  }

  if (!reportData || !reportData.session || error) {
    // Auto-create sample data if no data exists
    const handleShowDemo = () => {
      createSampleData();
    };

    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="text-center max-w-md px-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            {error ? 'Unable to Load Results' : 'Report Not Found'}
          </h2>
          <p className="text-muted-foreground mb-6">
            {error || 'This interview report doesn\'t exist.'}
          </p>
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleShowDemo} 
              className="bg-gradient-to-r from-violet-600 to-indigo-600"
              size="lg"
            >
              🎯 Show Me Sample Report
            </Button>
            <div className="flex gap-2 justify-center">
              <Button variant="outline" onClick={() => navigate("/setup")}>Create New Interview</Button>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>Dashboard</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { session, responses, skillScores, actionableFeedback, overallScore } = reportData;

  // Prepare radar chart data
  const radarData = skillScores.map((s: any) => ({
    subject: s.skillName,
    score: s.score,
    fullMark: s.maxScore,
  }));

  // Prepare per-question bar chart data
  const questionData = responses.map((r: any, i: number) => ({
    question: `Q${i + 1}`,
    score: r.scores?.overall || 0,
    accuracy: r.scores?.accuracy || 0,
    clarity: r.scores?.clarity || 0,
    depth: r.scores?.depth || 0,
    relevance: r.scores?.relevance || 0,
  }));

  // Calculate category averages
  const categoryScores = {
    accuracy: Math.round(responses.reduce((a: number, r: any) => a + (r.scores?.accuracy || 0), 0) / responses.length),
    clarity: Math.round(responses.reduce((a: number, r: any) => a + (r.scores?.clarity || 0), 0) / responses.length),
    depth: Math.round(responses.reduce((a: number, r: any) => a + (r.scores?.depth || 0), 0) / responses.length),
    relevance: Math.round(responses.reduce((a: number, r: any) => a + (r.scores?.relevance || 0), 0) / responses.length),
    timeEfficiency: Math.round(responses.reduce((a: number, r: any) => a + (r.scores?.timeEfficiency || 0), 0) / responses.length),
  };

  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const readinessScore = overallScore;

  // Determine readiness category color
  const getReadinessColor = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-teal-600";
    if (score >= 60) return "from-amber-500 to-orange-600";
    if (score >= 40) return "from-orange-500 to-red-500";
    return "from-red-500 to-rose-600";
  };

  const getReadinessBadge = (score: number) => {
    if (score >= 80) return { label: "Strong Candidate", color: "bg-emerald-100 text-emerald-700" };
    if (score >= 60) return { label: "Shows Potential", color: "bg-amber-100 text-amber-700" };
    if (score >= 40) return { label: "Needs Improvement", color: "bg-orange-100 text-orange-700" };
    return { label: "Not Ready", color: "bg-red-100 text-red-700" };
  };

  const readinessBadge = getReadinessBadge(readinessScore);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-violet-50/50 to-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <Button variant="ghost" size="sm" className="gap-1 mb-2" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
              <h1 className="text-3xl font-bold">Interview Report</h1>
              <p className="text-muted-foreground mt-1">{session.title}</p>
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={downloadPDF} 
                className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                <Download className="w-4 h-4" />
                Download Report
              </Button>
              <Link to="/setup">
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Readiness Score Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <Card className={`border-2 ${session.status === "terminated" ? "border-red-200" : "border-violet-200"}`}>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="text-center md:text-left">
                  {session.status === "terminated" ? (
                    <>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 text-red-700 mb-4">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold">Interview Terminated</span>
                      </div>
                      <p className="text-muted-foreground mb-4">{session.terminationReason}</p>
                    </>
                  ) : (
                    <>
                      <Badge className={`mb-4 ${readinessBadge.color}`}>
                        <Award className="w-3.5 h-3.5 mr-1.5" />
                        {readinessBadge.label}
                      </Badge>
                      <h2 className="text-5xl font-bold mb-2">
                        <span className={`bg-gradient-to-r ${getReadinessColor(readinessScore)} bg-clip-text text-transparent`}>
                          {readinessScore}
                        </span>
                        <span className="text-2xl text-muted-foreground">/100</span>
                      </h2>
                      <p className="text-muted-foreground">
                        Interview Readiness Score
                      </p>
                    </>
                  )}

                  <div className="flex flex-wrap gap-4 mt-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-violet-600" />
                      <span>{session.role}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <BarChart3 className="w-4 h-4 text-violet-600" />
                      <span>{responses.length} questions answered</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Zap className="w-4 h-4 text-violet-600" />
                      <span className="capitalize">{session.difficulty} difficulty</span>
                    </div>
                  </div>
                </div>

                {/* Circular Score Visualization */}
                <div className="flex justify-center">
                  <div className="relative w-48 h-48">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="8"
                      />
                      <motion.circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#scoreGradient)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${readinessScore * 2.64} ${264 - readinessScore * 2.64}`}
                        initial={{ strokeDasharray: "0 264" }}
                        animate={{ strokeDasharray: `${readinessScore * 2.64} ${264 - readinessScore * 2.64}` }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                      />
                      <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor={readinessScore >= 60 ? "#8b5cf6" : "#ef4444"} />
                          <stop offset="100%" stopColor={readinessScore >= 60 ? "#6366f1" : "#f97316"} />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{readinessScore}</span>
                      <span className="text-xs text-muted-foreground">Score</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Charts Grid */}
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          {/* Radar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Target className="w-4 h-4 text-violet-600" />
                  Skill Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="score"
                      stroke="#8b5cf6"
                      fill="#8b5cf6"
                      fillOpacity={0.3}
                      strokeWidth={2}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Bar Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-violet-600" />
                  Per-Question Scores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={questionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="question" tick={{ fontSize: 12 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{ borderRadius: "8px", fontSize: "12px" }}
                    />
                    <Bar dataKey="score" fill="#8b5cf6" radius={[4, 4, 0, 0]}>
                      {questionData.map((entry: any, index: number) => (
                        <Cell
                          key={index}
                          fill={entry.score >= 75 ? "#10b981" : entry.score >= 50 ? "#f59e0b" : "#ef4444"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="h-full border-emerald-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-emerald-700">
                  <ThumbsUp className="w-4 h-4" />
                  Strengths
                </CardTitle>
              </CardHeader>
              <CardContent>
                {strengths.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No significant strengths identified.</p>
                ) : (
                  <ul className="space-y-2">
                    {strengths.map((s, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card className="h-full border-red-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-red-700">
                  <ThumbsDown className="w-4 h-4" />
                  Areas for Improvement
                </CardTitle>
              </CardHeader>
              <CardContent>
                {weaknesses.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No major weaknesses identified.</p>
                ) : (
                  <ul className="space-y-2">
                    {weaknesses.map((w, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <XCircle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Actionable Feedback */}
        {actionableFeedback && actionableFeedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                  <Lightbulb className="w-4 h-4" />
                  Actionable Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {actionableFeedback.map((feedback: any, i: number) => (
                    <li key={i} className="flex items-start gap-3 text-sm bg-amber-50 rounded-lg p-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-amber-700">{i + 1}</span>
                      </div>
                      <span>{feedback}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Question-by-Question Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4 text-violet-600" />
                Question-by-Question Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {responses.map((response: any, index: number) => (
                  <motion.div
                    key={response.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.05 }}
                    className="border rounded-lg p-4 hover:bg-secondary/30 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      <div className="flex items-center gap-2 sm:w-48 flex-shrink-0">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          (response.scores?.overall || 0) >= 75
                            ? "bg-emerald-100 text-emerald-700"
                            : (response.scores?.overall || 0) >= 50
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {response.scores?.overall || 0}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Question {index + 1}</p>
                          <p className="text-xs text-muted-foreground">
                            {response.responseTime}s
                          </p>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm mb-2">
                          <span className="font-medium">Q: </span>
                          {response.questionText || `Question ${index + 1}`}
                        </p>
                        <p className="text-sm text-muted-foreground mb-2">
                          <span className="font-medium">A: </span>
                          {response.responseText.length > 150
                            ? response.responseText.substring(0, 150) + "..."
                            : response.responseText}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {[
                            { label: "Accuracy", score: response.scores?.accuracy || 0, color: "bg-blue-500" },
                            { label: "Clarity", score: response.scores?.clarity || 0, color: "bg-emerald-500" },
                            { label: "Depth", score: response.scores?.depth || 0, color: "bg-violet-500" },
                            { label: "Relevance", score: response.scores?.relevance || 0, color: "bg-amber-500" },
                          ].map((item) => (
                            <div key={item.label} className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${item.color}`} />
                              <span className="text-xs text-muted-foreground">
                                {item.label}: {item.score}
                              </span>
                            </div>
                          ))}
                        </div>
                        {response.feedback && (
                          <p className="text-xs text-violet-600 mt-2 bg-violet-50 rounded p-2">
                            {response.feedback}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Summary */}
        {session.feedback && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-8"
          >
            <Card className="bg-gradient-to-br from-violet-600 to-indigo-700 text-white">
              <CardContent className="p-8">
                <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Overall Assessment
                </h3>
                <p className="text-violet-100 leading-relaxed">{session.feedback}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="flex justify-center pb-8"
        >
          <Link to="/setup">
            <Button
              size="lg"
              className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8"
            >
              <RotateCcw className="w-5 h-5" />
              Practice Another Interview
              <ChevronRight className="w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

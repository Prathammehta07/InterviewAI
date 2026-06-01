import { Link, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import {
  Plus,
  Clock,
  TrendingUp,
  Award,
  Trash2,
  ArrowRight,
  Brain,
  BarChart3,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  terminated: "bg-red-100 text-red-700",
};

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

export default function Dashboard() {
  const { isAuthenticated, isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const navigate = useNavigate();
  
  const [sessions, setSessions] = useState<any[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Load sessions from localStorage
  useEffect(() => {
    console.log('=== Dashboard Loading Sessions ===');
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        console.log('User email:', user.email);
        const interviewsKey = `interviews_${user.email}`;
        let interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
        console.log('Interviews list:', interviewsList);
        
        // If no interviews exist, create demo data automatically
        if (interviewsList.length === 0) {
          console.log('No interviews found, creating demo data...');
          const demoSessionId = `session_${Date.now()}_demo`;
          const demoSession = {
            sessionId: demoSessionId,
            title: "Demo Interview - Frontend Developer",
            resumeText: "Sample resume",
            jobDescription: "Sample job description",
            difficulty: "medium",
            totalQuestions: 5,
            status: "completed",
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            completedAt: new Date().toISOString(),
            responses: [
              { questionId: 1, questionText: "Tell me about React?", responseText: "React is a JavaScript library...", responseTime: 90, scores: { overall: 85, accuracy: 88, clarity: 82, depth: 80, relevance: 90, timeEfficiency: 85 }, timestamp: new Date().toISOString() },
              { questionId: 2, questionText: "Explain hooks?", responseText: "Hooks let you use state...", responseTime: 110, scores: { overall: 92, accuracy: 95, clarity: 90, depth: 88, relevance: 95, timeEfficiency: 90 }, timestamp: new Date().toISOString() },
              { questionId: 3, questionText: "What is Redux?", responseText: "Redux is state management...", responseTime: 88, scores: { overall: 88, accuracy: 90, clarity: 85, depth: 92, relevance: 88, timeEfficiency: 88 }, timestamp: new Date().toISOString() },
              { questionId: 4, questionText: "Describe a challenge?", responseText: "I faced a performance issue...", responseTime: 125, scores: { overall: 78, accuracy: 80, clarity: 75, depth: 82, relevance: 78, timeEfficiency: 75 }, timestamp: new Date().toISOString() },
              { questionId: 5, questionText: "Testing approach?", responseText: "I use Jest and React Testing Library...", responseTime: 102, scores: { overall: 82, accuracy: 85, clarity: 80, depth: 78, relevance: 85, timeEfficiency: 80 }, timestamp: new Date().toISOString() }
            ]
          };
          
          localStorage.setItem(`interview_${demoSessionId}`, JSON.stringify(demoSession));
          interviewsList.push({
            sessionId: demoSessionId,
            title: demoSession.title,
            status: "completed",
            createdAt: demoSession.createdAt,
            completedAt: demoSession.completedAt
          });
          localStorage.setItem(interviewsKey, JSON.stringify(interviewsList));
          console.log('✅ Demo interview created automatically!');
        }
        
        // Load full session data for each interview
        const loadedSessions = interviewsList.map((interview: any) => {
          const sessionData = localStorage.getItem(`interview_${interview.sessionId}`);
          console.log(`Session ${interview.sessionId}:`, sessionData ? 'FOUND' : 'NOT FOUND');
          return sessionData ? JSON.parse(sessionData) : null;
        }).filter(Boolean);
        
        console.log('Loaded sessions:', loadedSessions.length);
        setSessions(loadedSessions);
      } catch (error) {
        console.error('Failed to load sessions:', error);
      }
    }
    setSessionsLoading(false);
  }, []);

  // Delete session
  const handleDelete = (sessionId: string) => {
    localStorage.removeItem(`interview_${sessionId}`);
    
    // Remove from user's list
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const interviewsKey = `interviews_${user.email}`;
      const interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
      const updatedList = interviewsList.filter((i: any) => i.sessionId !== sessionId);
      localStorage.setItem(interviewsKey, JSON.stringify(updatedList));
    }
    
    // Refresh sessions
    setSessions(prev => prev.filter(s => s.sessionId !== sessionId));
    setDeleteId(null);
  };

  // Refresh sessions from localStorage
  const refreshSessions = () => {
    console.log('Refreshing sessions...');
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const interviewsKey = `interviews_${user.email}`;
      const interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
      
      const loadedSessions = interviewsList.map((interview: any) => {
        const sessionData = localStorage.getItem(`interview_${interview.sessionId}`);
        return sessionData ? JSON.parse(sessionData) : null;
      }).filter(Boolean);
      
      setSessions(loadedSessions);
      console.log('Sessions refreshed:', loadedSessions.length);
    }
  };

  // Create test data for demo
  const createTestData = () => {
    const testSessionId = `session_${Date.now()}_demo`;
    const testSession = {
      sessionId: testSessionId,
      title: "Demo Interview - Frontend Developer",
      resumeText: "Sample resume",
      jobDescription: "Sample job description",
      difficulty: "medium",
      totalQuestions: 5,
      status: "completed",
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      completedAt: new Date().toISOString(),
      responses: [
        { questionId: 1, questionText: "Tell me about React?", responseText: "React is a JavaScript library...", responseTime: 90, scores: { overall: 85, accuracy: 88, clarity: 82, depth: 80, relevance: 90, timeEfficiency: 85 }, timestamp: new Date().toISOString() },
        { questionId: 2, questionText: "Explain hooks?", responseText: "Hooks let you use state...", responseTime: 110, scores: { overall: 92, accuracy: 95, clarity: 90, depth: 88, relevance: 95, timeEfficiency: 90 }, timestamp: new Date().toISOString() },
        { questionId: 3, questionText: "What is Redux?", responseText: "Redux is state management...", responseTime: 88, scores: { overall: 88, accuracy: 90, clarity: 85, depth: 92, relevance: 88, timeEfficiency: 88 }, timestamp: new Date().toISOString() },
        { questionId: 4, questionText: "Describe a challenge?", responseText: "I faced a performance issue...", responseTime: 125, scores: { overall: 78, accuracy: 80, clarity: 75, depth: 82, relevance: 78, timeEfficiency: 75 }, timestamp: new Date().toISOString() },
        { questionId: 5, questionText: "Testing approach?", responseText: "I use Jest and React Testing Library...", responseTime: 102, scores: { overall: 82, accuracy: 85, clarity: 80, depth: 78, relevance: 85, timeEfficiency: 80 }, timestamp: new Date().toISOString() }
      ]
    };

    localStorage.setItem(`interview_${testSessionId}`, JSON.stringify(testSession));
    
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      const interviewsKey = `interviews_${user.email}`;
      const interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
      interviewsList.push({
        sessionId: testSessionId,
        title: testSession.title,
        status: "completed",
        createdAt: testSession.createdAt,
        completedAt: testSession.completedAt
      });
      localStorage.setItem(interviewsKey, JSON.stringify(interviewsList));
    }
    
    console.log('Test data created!');
    refreshSessions();
    alert('Demo interview created! Click "View Report" to see results.');
  };

  if (authLoading || sessionsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const completedSessions = sessions?.filter((s) => s.status === "completed") || [];
  
  // Calculate average score from responses
  const avgScore = completedSessions.length > 0
    ? Math.round(
        completedSessions.reduce((acc: number, s: any) => {
          if (s.responses && s.responses.length > 0) {
            const sessionAvg = s.responses.reduce((sum: number, r: any) => sum + (r.scores?.overall || 0), 0) / s.responses.length;
            return acc + sessionAvg;
          }
          return acc;
        }, 0) / completedSessions.length
      )
    : 0;

  // Calculate best score from all responses
  const bestScore = completedSessions.length > 0
    ? Math.round(
        Math.max(...completedSessions.map((s: any) => {
          if (s.responses && s.responses.length > 0) {
            return s.responses.reduce((sum: number, r: any) => sum + (r.scores?.overall || 0), 0) / s.responses.length;
          }
          return 0;
        }))
      )
    : 0;

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Track your interview practice progress
              </p>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={refreshSessions}
                className="gap-2"
              >
                🔄 Refresh
              </Button>
              <Button 
                variant="outline" 
                onClick={createTestData}
                className="gap-2"
              >
                🎯 Create Demo
              </Button>
              <Link to="/setup">
                <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700">
                  <Plus className="w-4 h-4" />
                  New Interview
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Interviews</p>
                  <p className="text-2xl font-bold mt-1">{sessions?.length || 0}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-violet-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold mt-1">{completedSessions.length}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Score</p>
                  <p className="text-2xl font-bold mt-1">{avgScore}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Best Score</p>
                  <p className="text-2xl font-bold mt-1">{bestScore}</p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sessions List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Interview Sessions</CardTitle>
            </CardHeader>
            <CardContent>
              {!sessions || sessions.length === 0 ? (
                <div className="text-center py-12">
                  <Brain className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No interviews yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start your first AI-powered mock interview to begin practicing.
                  </p>
                  <Link to="/setup">
                    <Button className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600">
                      <Plus className="w-4 h-4" />
                      Start First Interview
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {sessions.map((session: any, index: number) => (
                    <motion.div
                      key={session.sessionId}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-lg border hover:bg-secondary/50 transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium truncate">{session.title}</h3>
                          <Badge className={statusColors[session.status] || ""}>
                            {session.status.replace("_", " ")}
                          </Badge>
                          <Badge className={difficultyColors[session.difficulty] || ""}>
                            {session.difficulty}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(session.createdAt).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Brain className="w-3.5 h-3.5" />
                            {session.role}
                          </span>
                          {session.readinessScore && (
                            <span className="flex items-center gap-1">
                              <Award className="w-3.5 h-3.5" />
                              Score: {session.readinessScore}/100
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {session.readinessScore && (
                          <div className="w-24">
                            <Progress
                              value={session.readinessScore}
                              className="h-2"
                            />
                          </div>
                        )}

                        {session.status === "pending" && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/interview/${session.sessionId}`)}
                          >
                            Start
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}

                        {session.status === "in_progress" && (
                          <Button
                            size="sm"
                            onClick={() => navigate(`/interview/${session.sessionId}`)}
                          >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-1" />
                          </Button>
                        )}

                        {(session.status === "completed" || session.status === "terminated") && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              console.log('View Report clicked for session:', session.sessionId);
                              console.log('Session status:', session.status);
                              console.log('Session responses:', session.responses);
                              navigate(`/results/${session.sessionId}`);
                            }}
                          >
                            View Report
                            <BarChart3 className="w-4 h-4 ml-1" />
                          </Button>
                        )}

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteId(session.sessionId)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Delete Interview</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to delete this interview session? This action cannot be undone.
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setDeleteId(null)}>
                                Cancel
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => {
                                  if (deleteId) {
                                    handleDelete(deleteId);
                                  }
                                }}
                              >
                                Delete
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

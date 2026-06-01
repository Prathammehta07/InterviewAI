import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Send,
  AlertCircle,
  Loader2,
  Brain,
  Target,
  MessageSquare,
  Lightbulb,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";

// Generate mock questions based on session data
function generateMockQuestions(session: any) {
  const allQuestions = [
    {
      id: 1,
      text: `Based on your resume and the role requirements, describe your most relevant experience for this position.`,
      difficulty: session.difficulty || 'medium',
      type: 'behavioral',
      timeLimit: 120,
    },
    {
      id: 2,
      text: 'Tell me about a challenging technical problem you solved. What was your approach?',
      difficulty: session.difficulty || 'medium',
      type: 'technical',
      timeLimit: 150,
    },
    {
      id: 3,
      text: 'How do you prioritize tasks when working on multiple projects with tight deadlines?',
      difficulty: session.difficulty || 'medium',
      type: 'scenario',
      timeLimit: 100,
    },
    {
      id: 4,
      text: 'Explain a complex technical concept to someone without a technical background.',
      difficulty: session.difficulty || 'medium',
      type: 'conceptual',
      timeLimit: 110,
    },
    {
      id: 5,
      text: 'Describe your experience with teamwork and collaboration. Give a specific example.',
      difficulty: session.difficulty || 'medium',
      type: 'behavioral',
      timeLimit: 90,
    },
    {
      id: 6,
      text: 'What strategies do you use to stay updated with industry trends and new technologies?',
      difficulty: session.difficulty || 'medium',
      type: 'behavioral',
      timeLimit: 80,
    },
    {
      id: 7,
      text: 'If you discovered a critical bug in production, what would be your first steps?',
      difficulty: session.difficulty || 'medium',
      type: 'scenario',
      timeLimit: 120,
    },
    {
      id: 8,
      text: 'How do you handle feedback and criticism in a professional environment?',
      difficulty: session.difficulty || 'medium',
      type: 'behavioral',
      timeLimit: 90,
    },
    {
      id: 9,
      text: 'Describe your process for learning a new technology or framework quickly.',
      difficulty: session.difficulty || 'medium',
      type: 'technical',
      timeLimit: 100,
    },
    {
      id: 10,
      text: 'What makes you stand out from other candidates for this role?',
      difficulty: session.difficulty || 'medium',
      type: 'behavioral',
      timeLimit: 110,
    },
  ];

  return allQuestions.slice(0, session.totalQuestions || 5);
}

const difficultyColors: Record<string, string> = {
  easy: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  hard: "bg-red-100 text-red-700",
};

const questionTypeIcons: Record<string, typeof Brain> = {
  technical: Brain,
  conceptual: Lightbulb,
  behavioral: MessageSquare,
  scenario: Target,
};

export default function LiveInterview() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });

  const [sessionData, setSessionData] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionNotFound, setSessionNotFound] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<any[]>([]);
  const [responses, setResponses] = useState<any[]>([]);
  const [answer, setAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(120);
  const [isAnswering, setIsAnswering] = useState(false);
  const [lastScores, setLastScores] = useState<any>(null);
  const [showScores, setShowScores] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  // Load session from localStorage
  useEffect(() => {
    if (!sessionId) {
      setSessionNotFound(true);
      setSessionLoading(false);
      return;
    }

    const storedSession = localStorage.getItem(`interview_${sessionId}`);
    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        const generatedQuestions = generateMockQuestions(session);
        
        setSessionData(session);
        setQuestions(generatedQuestions);
        setSessionNotFound(false);
      } catch {
        setSessionNotFound(true);
      }
    } else {
      setSessionNotFound(true);
    }
    setSessionLoading(false);
  }, [sessionId]);

  // Start interview
  const handleStartInterview = () => {
    if (!sessionData) return;
    
    const updatedSession = {
      ...sessionData,
      status: 'active',
      startedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(`interview_${sessionId}`, JSON.stringify(updatedSession));
    setSessionData(updatedSession);
    setInterviewStarted(true);
    setTimeLeft(questions[0]?.timeLimit || 120);
    startTimeRef.current = Date.now();
  };

  // Timer logic
  useEffect(() => {
    if (!interviewStarted || showScores) return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [interviewStarted, currentQuestionIndex, showScores]);

  const handleSubmit = useCallback(
    async (isAutoSubmit = false) => {
      if (!questions[currentQuestionIndex]) return;

      const responseTime = Math.round((Date.now() - startTimeRef.current) / 1000);
      const finalAnswer = isAutoSubmit && !answer.trim() ? "(No response provided - time ran out)" : answer;

      if (timerRef.current) clearInterval(timerRef.current);
      setIsAnswering(true);

      // Simulate AI scoring with mock data
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockScores = {
        accuracy: Math.floor(Math.random() * 30) + 60,
        clarity: Math.floor(Math.random() * 30) + 60,
        depth: Math.floor(Math.random() * 30) + 55,
        relevance: Math.floor(Math.random() * 30) + 65,
        timeEfficiency: Math.min(100, Math.round((responseTime / (questions[currentQuestionIndex].timeLimit || 120)) * 100)),
        overall: Math.floor(Math.random() * 35) + 60,
        feedback: isAutoSubmit 
          ? "Time ran out. Try to manage your time better in future responses."
          : "Good response! Consider adding more specific examples and structuring your answer more clearly.",
      };

      const newResponse = {
        questionId: questions[currentQuestionIndex].id,
        questionText: questions[currentQuestionIndex].text,
        responseText: finalAnswer,
        responseTime,
        scores: mockScores,
        timestamp: new Date().toISOString(),
      };

      const updatedResponses = [...responses, newResponse];
      setResponses(updatedResponses);
      setLastScores(mockScores);
      setShowScores(true);
      setIsAnswering(false);

      // Check if interview is complete
      const isComplete = updatedResponses.length >= questions.length;
      if (isComplete) {
        console.log('Interview complete! Saving and redirecting...');
        console.log('Total responses:', updatedResponses.length);
        
        // Save responses and redirect to results
        const finalSession = {
          ...sessionData,
          status: 'completed',
          responses: updatedResponses,
          completedAt: new Date().toISOString(),
        };
        
        localStorage.setItem(`interview_${sessionId}`, JSON.stringify(finalSession));
        console.log('Session saved to localStorage');
        
        // Update user's interview list
        const userStr = localStorage.getItem("user");
        if (userStr) {
          const user = JSON.parse(userStr);
          const interviewsKey = `interviews_${user.email}`;
          const interviewsList = JSON.parse(localStorage.getItem(interviewsKey) || "[]");
          const interviewIndex = interviewsList.findIndex((i: any) => i.sessionId === sessionId);
          if (interviewIndex !== -1) {
            interviewsList[interviewIndex].status = 'completed';
            interviewsList[interviewIndex].completedAt = finalSession.completedAt;
            localStorage.setItem(interviewsKey, JSON.stringify(interviewsList));
          }
        }
        
        alert('Interview Complete! Redirecting to results...');
        
        setTimeout(() => {
          console.log('Redirecting to:', `/results/${sessionId}`);
          navigate(`/results/${sessionId}`);
        }, 1500);
      }
    },
    [sessionId, currentQuestionIndex, questions, answer, responses, sessionData, navigate]
  );

  const handleNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentQuestionIndex(nextIndex);
      setAnswer("");
      setLastScores(null);
      setShowScores(false);
      setTimeLeft(questions[nextIndex].timeLimit);
      startTimeRef.current = Date.now();
    }
  };

  // Loading state
  if (authLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Session not found
  if (sessionNotFound) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-md w-full px-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h1 className="text-2xl font-bold mb-2">Interview Not Found</h1>
          <p className="text-muted-foreground mb-6">
            This interview session doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate("/setup")} className="gap-2">
            Create New Interview
          </Button>
        </div>
      </div>
    );
  }

  if (!sessionData || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const QuestionIcon = questionTypeIcons[currentQuestion?.type] || Brain;

  // Show start screen
  if (!interviewStarted) {
    return (
      <div className="pt-24 pb-16 min-h-screen flex items-center justify-center">
        <div className="max-w-2xl w-full px-4">
          <Card className="border-2">
            <CardContent className="p-8">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-6">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold mb-2">{sessionData.title}</h1>
              <p className="text-muted-foreground mb-6">
                {questions.length} questions | Difficulty: {sessionData.difficulty}
              </p>

              <div className="space-y-3 mb-6 text-sm">
                <p className="flex items-center gap-2 justify-center">
                  <Clock className="w-4 h-4 text-violet-600" />
                  {questions.reduce((acc, q) => acc + q.timeLimit, 0)} seconds total
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <Target className="w-4 h-4 text-violet-600" />
                  Questions adapt to your skill level
                </p>
                <p className="flex items-center gap-2 justify-center">
                  <Send className="w-4 h-4 text-violet-600" />
                  Get instant feedback on each answer
                </p>
              </div>

              <Button
                size="lg"
                onClick={handleStartInterview}
                className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
              >
                <Brain className="w-5 h-5" />
                Start Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Interview in progress
  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <Badge variant={timeLeft < 30 ? "destructive" : "secondary"} className="gap-1">
              <Clock className="w-3 h-3" />
              {timeLeft}s
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-6">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                    <QuestionIcon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={difficultyColors[currentQuestion.difficulty]}>
                        {currentQuestion.difficulty}
                      </Badge>
                      <Badge variant="outline">{currentQuestion.type}</Badge>
                    </div>
                    <h2 className="text-lg font-semibold">{currentQuestion.text}</h2>
                  </div>
                </div>

                {/* Answer Input */}
                {!showScores && (
                  <div className="space-y-4">
                    <Textarea
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="Type your answer here..."
                      className="min-h-[200px] text-base resize-none"
                      disabled={isAnswering}
                    />
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {answer.length} characters
                      </p>
                      <Button
                        size="lg"
                        onClick={() => handleSubmit(false)}
                        disabled={isAnswering || !answer.trim()}
                        className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
                      >
                        {isAnswering ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Evaluating...
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            Submit Answer
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                )}

                {/* Scores Display */}
                {showScores && lastScores && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-violet-600">{lastScores.accuracy}%</p>
                        <p className="text-sm text-muted-foreground">Accuracy</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-blue-600">{lastScores.clarity}%</p>
                        <p className="text-sm text-muted-foreground">Clarity</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-emerald-600">{lastScores.depth}%</p>
                        <p className="text-sm text-muted-foreground">Depth</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-amber-600">{lastScores.relevance}%</p>
                        <p className="text-sm text-muted-foreground">Relevance</p>
                      </div>
                      <div className="bg-secondary rounded-lg p-4 text-center">
                        <p className="text-2xl font-bold text-rose-600">{lastScores.timeEfficiency}%</p>
                        <p className="text-sm text-muted-foreground">Time Efficiency</p>
                      </div>
                      <div className="bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg p-4 text-center text-white">
                        <p className="text-2xl font-bold">{lastScores.overall}%</p>
                        <p className="text-sm opacity-90">Overall</p>
                      </div>
                    </div>

                    <div className="bg-secondary rounded-lg p-4">
                      <p className="text-sm font-medium mb-1">Feedback:</p>
                      <p className="text-sm text-muted-foreground">{lastScores.feedback}</p>
                    </div>

                    <Button
                      size="lg"
                      onClick={handleNextQuestion}
                      className="w-full gap-2 bg-gradient-to-r from-violet-600 to-indigo-600"
                    >
                      {currentQuestionIndex + 1 < questions.length ? (
                        <>
                          Next Question
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          View Results
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

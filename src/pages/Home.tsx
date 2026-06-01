import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Brain,
  FileText,
  Target,
  Clock,
  TrendingUp,
  MessageSquare,
  Zap,
  Shield,
  ChevronRight,
  Sparkles,
  BarChart3,
  Award,
  CheckCircle2,
} from "lucide-react";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const features = [
  {
    icon: Brain,
    title: "AI-Powered Interviewer",
    description: "Our intelligent AI adapts questions in real-time based on your responses and skill level.",
    color: "from-violet-500 to-purple-600",
  },
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Upload your resume and let our AI extract skills, experience, and tailor questions accordingly.",
    color: "from-blue-500 to-cyan-600",
  },
  {
    icon: Target,
    title: "Job Description Alignment",
    description: "Paste any job description and get interview questions perfectly aligned with role requirements.",
    color: "from-emerald-500 to-teal-600",
  },
  {
    icon: Clock,
    title: "Timed Responses",
    description: "Practice under realistic time constraints. Get penalized for overtime just like real interviews.",
    color: "from-orange-500 to-amber-600",
  },
  {
    icon: TrendingUp,
    title: "Adaptive Difficulty",
    description: "Questions automatically adjust from Easy to Hard based on your performance in real-time.",
    color: "from-rose-500 to-pink-600",
  },
  {
    icon: BarChart3,
    title: "Detailed Analytics",
    description: "Get comprehensive feedback on accuracy, clarity, depth, relevance, and time management.",
    color: "from-indigo-500 to-blue-600",
  },
];

const howItWorks = [
  {
    step: "01",
    icon: FileText,
    title: "Upload Resume & JD",
    description: "Upload your resume and paste the job description for the role you're targeting.",
  },
  {
    step: "02",
    icon: Sparkles,
    title: "AI Generates Questions",
    description: "Our AI analyzes your background and the role to generate tailored interview questions.",
  },
  {
    step: "03",
    icon: MessageSquare,
    title: "Take the Interview",
    description: "Answer questions under timed conditions while the AI adapts difficulty dynamically.",
  },
  {
    step: "04",
    icon: Award,
    title: "Get Your Report",
    description: "Receive a detailed readiness score, strengths, weaknesses, and actionable feedback.",
  },
];

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="pt-16">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50/50 via-background to-indigo-50/50" />
        <div className="absolute top-20 right-20 w-72 h-72 bg-violet-300/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-indigo-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {/* Left Content */}
            <div className="space-y-8">
              <motion.div variants={fadeInUp}>
                <Badge
                  variant="secondary"
                  className="mb-4 px-4 py-1.5 text-sm bg-violet-100 text-violet-700 hover:bg-violet-100"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                  AI-Powered Interview Platform
                </Badge>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                  Master Your{" "}
                  <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                    Technical Interviews
                  </span>{" "}
                  with AI
                </h1>
                <p className="text-lg text-muted-foreground mt-4 max-w-xl leading-relaxed">
                  Practice with an intelligent AI interviewer that adapts to your skill level,
                  provides real-time feedback, and helps you land your dream job.
                </p>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex flex-wrap gap-4"
              >
                <Link to={isAuthenticated ? "/setup" : "/login"}>
                  <Button
                    size="lg"
                    className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-lg px-8 py-6 shadow-lg shadow-violet-200"
                  >
                    Start Practicing
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 text-lg px-8 py-6"
                  >
                    View Dashboard
                  </Button>
                </Link>
              </motion.div>

              <motion.div
                variants={fadeInUp}
                className="flex items-center gap-6 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Adaptive AI</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Real-time Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Detailed Reports</span>
                </div>
              </motion.div>
            </div>

            {/* Right Content - Visual */}
            <motion.div
              variants={fadeInUp}
              className="hidden lg:block relative"
            >
              <div className="relative">
                {/* Interview Card Mockup */}
                <Card className="w-full max-w-md mx-auto border-2 shadow-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
                        <Brain className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold">AI Interviewer</p>
                        <p className="text-xs text-muted-foreground">Software Engineer Interview</p>
                      </div>
                      <Badge variant="secondary" className="ml-auto">
                        <Zap className="w-3 h-3 mr-1" />
                        Live
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-secondary rounded-lg p-4">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Question 3 of 10</p>
                        <p className="text-sm">
                          "Explain how you would design a URL shortening service that needs to handle 10 million requests per day."
                        </p>
                        <Badge className="mt-2 bg-orange-100 text-orange-700 hover:bg-orange-100">Hard</Badge>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-secondary rounded-lg p-3 text-sm text-muted-foreground">
                          Your answer goes here...
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>1:45 remaining</span>
                        </div>
                        <div className="flex gap-1.5">
                          {[85, 70, 90].map((score, i) => (
                            <div
                              key={i}
                              className="w-16 h-2 rounded-full bg-secondary overflow-hidden"
                            >
                              <div
                                className="h-full rounded-full bg-gradient-to-r from-violet-500 to-indigo-500"
                                style={{ width: `${score}%` }}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Floating Elements */}
                <motion.div
                  className="absolute -top-4 -right-4 bg-white rounded-xl shadow-lg p-3 border"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-emerald-500" />
                    <div>
                      <p className="text-xs font-medium">Accuracy</p>
                      <p className="text-lg font-bold text-emerald-600">92%</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-3 border"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-violet-500" />
                    <div>
                      <p className="text-xs font-medium">Readiness</p>
                      <p className="text-lg font-bold text-violet-600">87/100</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Ace Interviews
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform combines cutting-edge AI with proven interview techniques to give you the most realistic practice experience.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <Card className="h-full hover:shadow-lg transition-shadow group">
                  <CardContent className="p-6">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Badge variant="secondary" className="mb-4">
              Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It{" "}
              <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
                Works
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Four simple steps to start practicing and improving your interview skills.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <motion.div
                key={index}
                className="relative text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 mb-4 shadow-lg">
                  <item.icon className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-xs font-bold text-violet-700">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-violet-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Brain className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Ace Your Next Interview?
            </h2>
            <p className="text-violet-100 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of candidates who have improved their interview skills with our AI-powered platform.
            </p>
            <Link to={isAuthenticated ? "/setup" : "/login"}>
              <Button
                size="lg"
                variant="secondary"
                className="gap-2 text-lg px-10 py-6 bg-white text-violet-700 hover:bg-violet-50"
              >
                Get Started Now
                <ChevronRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                <Brain className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold">InterviewAI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Built for Hack2Hire Hackathon
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

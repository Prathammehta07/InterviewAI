import { useParams, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import {
  Video,
  VideoOff,
  Mic,
  MicOff,
  Monitor,
  PhoneOff,
  MessageSquare,
  Users,
  Settings,
  Loader2,
  Brain,
  Clock,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";

export default function VideoInterview() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const { isLoading: authLoading } = useAuth({ redirectOnUnauthenticated: true });

  const [sessionData, setSessionData] = useState<any>(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [sessionNotFound, setSessionNotFound] = useState(false);
  
  // Video/Audio states
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);
  const [callStarted, setCallStarted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  // Refs
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load session
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
        setSessionData(session);
      } catch {
        setSessionNotFound(true);
      }
    } else {
      setSessionNotFound(true);
    }
    setSessionLoading(false);
  }, [sessionId]);

  // Start camera/mic
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: true,
      });
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      streamRef.current = stream;
      return true;
    } catch (error) {
      console.error('Error accessing camera:', error);
      return false;
    }
  };

  // Stop camera/mic
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
  };

  // Toggle video
  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setVideoEnabled(videoTrack.enabled);
      }
    }
  };

  // Toggle audio
  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setAudioEnabled(audioTrack.enabled);
      }
    }
  };

  // Start call
  const handleStartCall = async () => {
    setIsConnecting(true);
    const success = await startCamera();
    
    if (success) {
      setTimeout(() => {
        setIsConnecting(false);
        setCallStarted(true);
        
        // Start timer
        timerRef.current = setInterval(() => {
          setCallDuration(prev => prev + 1);
        }, 1000);
      }, 2000);
    } else {
      setIsConnecting(false);
      alert('Unable to access camera. Please check permissions.');
    }
  };

  // End call
  const handleEndCall = () => {
    stopCamera();
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Update session
    if (sessionData) {
      const updatedSession = {
        ...sessionData,
        videoInterviewCompleted: true,
        videoCallDuration: callDuration,
        completedAt: new Date().toISOString(),
      };
      localStorage.setItem(`interview_${sessionId}`, JSON.stringify(updatedSession));
    }
    
    navigate(`/results/${sessionId}`);
  };

  // Format duration
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Cleanup
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Loading
  if (authLoading || sessionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-violet-400" />
      </div>
    );
  }

  // Not found
  if (sessionNotFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center text-white">
          <h2 className="text-xl font-semibold mb-2">Interview Not Found</h2>
          <Button onClick={() => navigate("/setup")}>Create New Interview</Button>
        </div>
      </div>
    );
  }

  // Pre-call screen
  if (!callStarted) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl w-full"
        >
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Video Interview</h1>
                <p className="text-gray-400">{sessionData?.title}</p>
              </div>

              {/* Video Preview */}
              <div className="relative bg-gray-700 rounded-xl overflow-hidden mb-6 aspect-video">
                <video
                  ref={localVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
                {!videoEnabled && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                    <div className="text-center">
                      <VideoOff className="w-16 h-16 text-gray-600 mx-auto mb-2" />
                      <p className="text-gray-500">Camera is off</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Interview Info */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <Users className="w-5 h-5 mx-auto mb-2 text-violet-400" />
                  <p className="text-sm text-gray-300">AI Interviewer</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <Clock className="w-5 h-5 mx-auto mb-2 text-violet-400" />
                  <p className="text-sm text-gray-300">~15-20 min</p>
                </div>
                <div className="bg-gray-700 rounded-lg p-4 text-center">
                  <Brain className="w-5 h-5 mx-auto mb-2 text-violet-400" />
                  <p className="text-sm text-gray-300">AI Powered</p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant={videoEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleVideo}
                  className="rounded-full"
                >
                  {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </Button>
                <Button
                  variant={audioEnabled ? "default" : "destructive"}
                  size="icon"
                  onClick={toggleAudio}
                  className="rounded-full"
                >
                  {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </Button>
              </div>

              {/* Start Button */}
              <Button
                size="lg"
                onClick={handleStartCall}
                disabled={isConnecting}
                className="w-full gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isConnecting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Video className="w-5 h-5" />
                    Start Video Interview
                  </>
                )}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By starting, you agree to be recorded for assessment purposes
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Active call screen
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">{sessionData?.title}</h2>
              <p className="text-sm text-gray-400">AI Video Interview</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-green-600 text-white">
              <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse" />
              Recording
            </Badge>
            <div className="text-white font-mono">{formatDuration(callDuration)}</div>
          </div>
        </div>
      </div>

      {/* Video Grid */}
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {/* AI Interviewer */}
          <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Brain className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">AI Interviewer</h3>
                <p className="text-gray-400 text-sm">Asking questions...</p>
              </div>
            </div>
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-violet-600 text-white">AI Host</Badge>
            </div>
          </div>

          {/* Your Video */}
          <div className="bg-gray-800 rounded-xl overflow-hidden aspect-video relative">
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            {!videoEnabled && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-700">
                <VideoOff className="w-16 h-16 text-gray-600" />
              </div>
            )}
            <div className="absolute bottom-4 left-4">
              <Badge className="bg-blue-600 text-white">You</Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-gray-800 border-t border-gray-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-center gap-4">
          <Button
            variant={videoEnabled ? "secondary" : "destructive"}
            size="icon"
            onClick={toggleVideo}
            className="rounded-full"
          >
            {videoEnabled ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
          </Button>
          
          <Button
            variant={audioEnabled ? "secondary" : "destructive"}
            size="icon"
            onClick={toggleAudio}
            className="rounded-full"
          >
            {audioEnabled ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
          </Button>

          <Button
            variant={screenSharing ? "default" : "secondary"}
            size="icon"
            onClick={() => setScreenSharing(!screenSharing)}
            className="rounded-full"
          >
            <Monitor className="w-5 h-5" />
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <MessageSquare className="w-5 h-5" />
          </Button>

          <Button variant="secondary" size="icon" className="rounded-full">
            <Settings className="w-5 h-5" />
          </Button>

          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-full gap-2 ml-4"
          >
            <PhoneOff className="w-5 h-5" />
            End Interview
          </Button>
        </div>
      </div>
    </div>
  );
}

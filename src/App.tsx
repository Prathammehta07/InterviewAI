import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import Dashboard from './pages/Dashboard'
import SetupInterview from './pages/SetupInterview'
import LiveInterview from './pages/LiveInterview'
import VideoInterview from './pages/VideoInterview'
import Results from './pages/Results'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup" element={<SetupInterview />} />
        <Route path="/interview/:sessionId" element={<LiveInterview />} />
        <Route path="/video/:sessionId" element={<VideoInterview />} />
        <Route path="/results/:sessionId" element={<Results />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

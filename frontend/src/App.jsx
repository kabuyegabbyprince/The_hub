import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { AuthModal } from './components/AuthModal';
import { DashboardPage } from './pages/DashboardPage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { LearningPathsPage } from './pages/LearningPathsPage';
import { NisrInsightsPage } from './pages/NisrInsightsPage';
import { SkillPassportPage } from './pages/SkillPassportPage';
import { PeerMatchingPage } from './pages/PeerMatchingPage';
import { YouthOpportunitiesPage } from './pages/YouthOpportunitiesPage';
import { ChallengesPage } from './pages/ChallengesPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminCourseEditor } from './pages/AdminCourseEditor';

import {
  fetchHealth,
  fetchCourses,
  fetchNisrIndicators,
  enrollCourse,
  defaultCourses,
  defaultNisrIndicators
} from './services/api';

export function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState(null);

  const [lowBandwidth, setLowBandwidth] = useState(() => {
    return localStorage.getItem('hub_low_bandwidth') === 'true';
  });

  const [courses, setCourses] = useState(defaultCourses);
  const [nisrIndicators, setNisrIndicators] = useState(defaultNisrIndicators);
  const [healthData, setHealthData] = useState(null);
  const [backendConnected, setBackendConnected] = useState(false);

  // Auth modal control
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [targetCourseForAuth, setTargetCourseForAuth] = useState(null);

  const toggleLowBandwidth = () => {
    setLowBandwidth(prev => {
      const next = !prev;
      localStorage.setItem('hub_low_bandwidth', String(next));
      return next;
    });
  };

  const refreshHealth = () => {
    fetchHealth()
      .then((data) => {
        setHealthData(data);
        if (data.success) setBackendConnected(true);
      })
      .catch(() => setBackendConnected(false));
  };

  useEffect(() => {
    // Enforce session security: clear any stale local user data on refresh
    localStorage.removeItem('hub_user');
    refreshHealth();

    fetchCourses().then((res) => {
      if (res.courses && res.courses.length > 0) {
        setCourses(res.courses);
      }
    });

    fetchNisrIndicators().then((res) => {
      if (res.indicators && res.indicators.length > 0) {
        setNisrIndicators(res.indicators);
      }
    });
  }, []);

  // Triggered when user selects a course from dashboard or courses list
  const handleSelectCourse = (course) => {
    if (!user) {
      setTargetCourseForAuth(course);
      setIsAuthOpen(true);
    } else {
      enrollCourse(course.id, user.id).then(() => {
        if (!user.enrolledCourses?.includes(course.id)) {
          const updatedUser = {
            ...user,
            enrolledCourses: [...(user.enrolledCourses || []), course.id]
          };
          setUser(updatedUser);
        }
        navigate(`/courses/${course.slug || course.id}`);
      });
    }
  };

  const handleLoginSuccess = (authenticatedUser) => {
    setUser(authenticatedUser);
    if (targetCourseForAuth) {
      enrollCourse(targetCourseForAuth.id, authenticatedUser.id).then(() => {
        navigate(`/courses/${targetCourseForAuth.slug || targetCourseForAuth.id}`);
        setTargetCourseForAuth(null);
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('hub_user');
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Navbar with Dark Blue Main Color & Red/Blue Accents */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
      />

      {/* Content Routes */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 pt-6">
        <Routes>
          {/* User lands on Dashboard with courses */}
          <Route
            path="/"
            element={
              <DashboardPage
                courses={courses}
                user={user}
                onSelectCourse={handleSelectCourse}
                nisrIndicators={nisrIndicators}
                onNavigate={navigate}
              />
            }
          />
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                courses={courses}
                user={user}
                onSelectCourse={handleSelectCourse}
                nisrIndicators={nisrIndicators}
                onNavigate={navigate}
              />
            }
          />
          <Route
            path="/courses"
            element={
              <CoursesPage
                courses={courses}
                user={user}
                onSelectCourse={handleSelectCourse}
              />
            }
          />
          <Route
            path="/courses/:slug"
            element={
              <CourseDetailWrapper
                courses={courses}
                user={user}
                onEnroll={(id) => handleSelectCourse({ id, slug: id })}
                onTriggerAuth={(course) => {
                  setTargetCourseForAuth(course);
                  setIsAuthOpen(true);
                }}
              />
            }
          />
          <Route
            path="/learning-paths"
            element={<LearningPathsPage onSelectCourse={handleSelectCourse} />}
          />
          <Route
            path="/peers"
            element={
              <PeerMatchingPage
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/youth"
            element={<YouthOpportunitiesPage onSelectCourse={handleSelectCourse} />}
          />
          <Route
            path="/challenges"
            element={
              <ChallengesPage
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/insights"
            element={<NisrInsightsPage indicators={nisrIndicators} />}
          />
          <Route
            path="/skill-passport"
            element={
              <SkillPassportPage
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/passport/:id"
            element={
              <SkillPassportPage
                user={user}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          <Route
            path="/profile"
            element={
              <ProfilePage
                user={user}
                onUpdateUser={setUser}
                onOpenAuth={() => setIsAuthOpen(true)}
              />
            }
          />
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard user={user} />} />
          <Route path="/admin/courses/new" element={<AdminCourseEditor user={user} />} />
          <Route path="/admin/courses/edit/:id" element={<AdminCourseEditor user={user} />} />
        </Routes>
      </main>

      {/* Authentication Modal triggered on course selection */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => {
          setIsAuthOpen(false);
          setTargetCourseForAuth(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        targetCourse={targetCourseForAuth}
      />
    </div>
  );
}

// Wrapper to extract slug param
function CourseDetailWrapper({ courses, user, onEnroll, onTriggerAuth }) {
  const location = useLocation();
  const slug = location.pathname.replace('/courses/', '');
  const course = courses.find((c) => c.slug === slug || c.id === slug) || courses[0];

  return (
    <CourseDetailPage
      course={course}
      user={user}
      onEnroll={onEnroll}
      onTriggerAuth={onTriggerAuth}
    />
  );
}

export default App;

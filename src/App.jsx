// src/App.jsx
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Login from './pages/Login';
import Register from './pages/Register';
import JobsPage from './pages/Jobs';
import JobDetailPage from './pages/JobDetailPage';
import CandidatesPage from './pages/Candidates';
import CandidateDetailPage from './pages/CandidateDetailPage';
import KanbanPage from './pages/KanbanPage';
import AssessmentsPage from './pages/AssessmentsPage';
import AssessmentBuilderPage from './pages/AssessmentBuilderPage';
import { db } from './db/dexieDB';
import { seedDatabase } from './db/seedData';
import AssessmentPreview from './pages/AssessmentPreview';
import ErrorBoundary from './components/ErrorBoundary';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const initDb = async () => {
      try {
        await db.open();
        console.log('✅ Database opened');
        await seedDatabase();
        console.log('✅ Database seeded');
        setIsDbReady(true);
      } catch (error) {
        console.error('❌ Database initialization failed:', error);
        setIsDbReady(true);
      }
    };

    initDb();
  }, []);

  if (!isDbReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <HeroSection />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/jobs" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <JobsPage />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/jobs/:jobId" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <JobDetailPage />
                    </>
                  </ProtectedRoute>
                } />

                {/* Candidates Routes */}
                <Route path="/candidates" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <CandidatesPage />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/candidates/:id" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <CandidateDetailPage />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/candidates/kanban" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <KanbanPage />
                    </>
                  </ProtectedRoute>
                } />

                {/* Assessments Routes */}
                <Route path="/assessments" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <AssessmentsPage />
                    </>
                  </ProtectedRoute>
                } />

                <Route path="/assessments/builder/:jobId" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <AssessmentBuilderPage />
                    </>
                  </ProtectedRoute>
                } />

                {/* Assessment Preview/Runtime Route */}
                <Route path="/assessments/runtime/:jobId" element={
                  <ProtectedRoute>
                    <>
                      <Navbar />
                      <AssessmentPreview />
                    </>
                  </ProtectedRoute>
                } />
              </Routes>
            </div>
          </ErrorBoundary>
        </Router>
      </AuthProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

// Make sure this default export exists
export default App;
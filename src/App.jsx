import { Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastProvider'
import ProtectedRoute from './components/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import ErrorBoundary from './components/ErrorBoundary'
import { useDarkMode } from './hooks/useDarkMode'

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage'))
const Login = lazy(() => import('./pages/Login'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Pricing = lazy(() => import('./pages/Pricing'))

// Protected Pages
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Activities = lazy(() => import('./pages/Activities'))
const Journal = lazy(() => import('./pages/Journal'))
const Companion = lazy(() => import('./pages/Companion'))
const Music = lazy(() => import('./pages/Music'))
const Insights = lazy(() => import('./pages/Insights'))
const Garden = lazy(() => import('./pages/Garden'))
const Community = lazy(() => import('./pages/Community'))
const Settings = lazy(() => import('./pages/Settings'))
const Resources = lazy(() => import('./pages/Resources'))
const Entertainment = lazy(() => import('./pages/Entertainment'))
const DataExplorer = lazy(() => import('./pages/DataExplorer'))

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--surface)' }}>
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 rounded-full border-4 animate-spin" style={{ borderColor: 'var(--primary-container)', borderTopColor: 'var(--primary)' }} />
      <span className="text-sm font-medium" style={{ color: 'var(--on-surface-variant)' }}>Loading…</span>
    </div>
  </div>
)

function App() {
  useDarkMode()

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Protected Routes */}
                <Route
                  path="/app"
                  element={
                    <ProtectedRoute>
                      <AppLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="activities" element={<Activities />} />
                  <Route path="journal" element={<Journal />} />
                  <Route path="companion" element={<Companion />} />
                  <Route path="music" element={<Music />} />
                  <Route path="insights" element={<Insights />} />
                  <Route path="garden" element={<Garden />} />
                  <Route path="community" element={<Community />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="entertainment" element={<Entertainment />} />
                  <Route path="data-explorer" element={<DataExplorer />} />
                </Route>

                {/* Catch-all redirect */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App

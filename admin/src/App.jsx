import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'
import PublicLayout from './layouts/PublicLayout'

// Admin Pages
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import OwnersList from './pages/Owners/OwnersList'
import PropertiesList from './pages/Properties/PropertiesList'
import PropertyForm from './pages/Properties/PropertyForm'
import PropertyDetail from './pages/Properties/PropertyDetail'
import ImportPage from './pages/Import/ImportPage'

// Public Pages
import LandingPage from './pages/Public/LandingPage'
import SearchPage from './pages/Public/SearchPage'
import SearchResultsPage from './pages/Public/SearchResultsPage'
import PropertyDetailPage from './pages/Public/PropertyDetailPage'

// Global styles
import 'antd/dist/reset.css'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes with PublicLayout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/search/results" element={<SearchResultsPage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
          </Route>

          {/* Admin login route */}
          <Route path="/login" element={<Login />} />

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="owners" element={<OwnersList />} />
            <Route path="properties" element={<PropertiesList />} />
            <Route path="properties/new" element={<PropertyForm />} />
            <Route path="properties/:id" element={<PropertyDetail />} />
            <Route path="properties/:id/edit" element={<PropertyForm />} />
            <Route path="import" element={<ImportPage />} />
          </Route>

          {/* Legacy routes - redirect to new structure */}
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/owners" element={<Navigate to="/admin/owners" replace />} />
          <Route path="/properties" element={<Navigate to="/admin/properties" replace />} />
          <Route path="/import" element={<Navigate to="/admin/import" replace />} />

          {/* Catch all - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App

import { Outlet, Link } from 'react-router-dom'
import '../pages/Public/public.css'
import { BiharGovtLogo, AppLogo } from '../components/LogoComponents'

// Re-export BiharGovtLogo as GovEmblem for backward compatibility
const GovEmblem = BiharGovtLogo

const PublicLayout = () => {
  return (
    <div className="public-layout">
      {/* Header */}
      <header className="public-header">
        <div className="header-content">
          <Link to="/" className="header-brand">
            <GovEmblem size={48} className="header-emblem" />
            <div className="header-text">
              <span className="header-title-hindi">बिहार सरकार</span>
              <span className="header-title-english">Department of Revenue and Land Reforms</span>
            </div>
          </Link>
          <Link to="/login" className="header-admin-link">
            Admin Portal
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="public-main">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="public-footer">
        <p className="footer-text">
          Government of Bihar | Department of Revenue and Land Reforms
        </p>
      </footer>
    </div>
  )
}

export { GovEmblem }
export default PublicLayout

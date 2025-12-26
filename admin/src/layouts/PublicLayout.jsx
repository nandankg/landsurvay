import { Outlet, Link } from 'react-router-dom'
import '../pages/Public/public.css'

// Government Emblem SVG Component - Bihar Bodhi Tree (Ashvattha)
const GovEmblem = ({ size = 48, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 100"
    className={className}
    aria-label="Government of Bihar Emblem"
  >
    {/* Main tree trunk */}
    <path
      d="M50 95 L50 55"
      stroke="#C41E3A"
      strokeWidth="6"
      strokeLinecap="round"
    />

    {/* Main branches spreading from center */}
    {/* Left main branch */}
    <path
      d="M50 55 Q35 45 20 35"
      stroke="#C41E3A"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />
    {/* Right main branch */}
    <path
      d="M50 55 Q65 45 80 35"
      stroke="#C41E3A"
      strokeWidth="4"
      strokeLinecap="round"
      fill="none"
    />

    {/* Center upward branch */}
    <path
      d="M50 55 L50 25"
      stroke="#C41E3A"
      strokeWidth="4"
      strokeLinecap="round"
    />

    {/* Sub-branches - Left side */}
    <path d="M35 47 Q25 40 15 45" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M28 42 Q20 35 12 30" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M20 35 Q12 28 8 20" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M25 38 Q18 45 10 50" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Sub-branches - Right side */}
    <path d="M65 47 Q75 40 85 45" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M72 42 Q80 35 88 30" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M80 35 Q88 28 92 20" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M75 38 Q82 45 90 50" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />

    {/* Top branches */}
    <path d="M50 35 Q40 28 30 20" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 35 Q60 28 70 20" stroke="#C41E3A" strokeWidth="2.5" strokeLinecap="round" fill="none" />
    <path d="M50 25 Q42 18 35 10" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50 25 Q58 18 65 10" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" fill="none" />
    <path d="M50 25 L50 8" stroke="#C41E3A" strokeWidth="2" strokeLinecap="round" />

    {/* Additional small branches for fullness */}
    <path d="M40 30 Q32 25 25 15" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    <path d="M60 30 Q68 25 75 15" stroke="#C41E3A" strokeWidth="1.5" strokeLinecap="round" fill="none" />

    {/* Swastika decorative elements at branch ends */}
    {/* Top center */}
    <g transform="translate(50, 8) scale(0.4)">
      <path d="M0 -8 L0 8 M-8 0 L8 0 M0 -8 L5 -8 M8 0 L8 5 M0 8 L-5 8 M-8 0 L-8 -5" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>

    {/* Left side decorative */}
    <g transform="translate(12, 30) scale(0.35)">
      <path d="M0 -8 L0 8 M-8 0 L8 0 M0 -8 L5 -8 M8 0 L8 5 M0 8 L-5 8 M-8 0 L-8 -5" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>

    {/* Right side decorative */}
    <g transform="translate(88, 30) scale(0.35)">
      <path d="M0 -8 L0 8 M-8 0 L8 0 M0 -8 L5 -8 M8 0 L8 5 M0 8 L-5 8 M-8 0 L-8 -5" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>

    {/* Bottom left */}
    <g transform="translate(10, 50) scale(0.3)">
      <path d="M0 -8 L0 8 M-8 0 L8 0 M0 -8 L5 -8 M8 0 L8 5 M0 8 L-5 8 M-8 0 L-8 -5" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>

    {/* Bottom right */}
    <g transform="translate(90, 50) scale(0.3)">
      <path d="M0 -8 L0 8 M-8 0 L8 0 M0 -8 L5 -8 M8 0 L8 5 M0 8 L-5 8 M-8 0 L-8 -5" stroke="#C41E3A" strokeWidth="3" strokeLinecap="round" fill="none" />
    </g>
  </svg>
)

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

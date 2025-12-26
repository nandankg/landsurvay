import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { GovEmblem } from '../../layouts/PublicLayout'
import './public.css'

// Module data with Hindi titles
const modules = [
  {
    id: 'land-records',
    title: 'भू अभिलेख एवं परिमाप निदेशालय',
    titleEn: 'Land Records & Survey',
    icon: '📋',
    active: false
  },
  {
    id: 'land-revenue',
    title: 'भू लगान',
    titleEn: 'Land Revenue',
    icon: '💰',
    active: false
  },
  {
    id: 'survey-status',
    title: 'सर्वेक्षण स्थिति 2023',
    titleEn: 'Survey Status 2023',
    icon: '📊',
    active: true
  },
  {
    id: 'jamabandi',
    title: 'जमाबंदी पंजी',
    titleEn: 'Jamabandi Register',
    icon: '📖',
    active: false
  },
  {
    id: 'general-info',
    title: 'आम सूचना',
    titleEn: 'General Information',
    icon: 'ℹ️',
    active: false
  },
  {
    id: 'land-map',
    title: 'भू मानचित्र',
    titleEn: 'Land Map',
    icon: '🗺️',
    active: false
  },
  {
    id: 'aadhaar-seeding',
    title: 'आधार / मोबाइल सीडिंग स्थिति',
    titleEn: 'Aadhaar/Mobile Seeding',
    icon: '🔗',
    active: false
  },
  {
    id: 'govt-land',
    title: 'सरकारी भूमि का दाखिल खारिज',
    titleEn: 'Govt. Land Mutation',
    icon: '🏛️',
    active: false
  }
]

const LandingPage = () => {
  const navigate = useNavigate()

  const handleModuleClick = (module) => {
    if (module.active) {
      navigate('/search')
    } else {
      message.info({
        content: 'जल्द आ रहा है / Coming Soon',
        duration: 2,
        style: {
          marginTop: '20vh'
        }
      })
    }
  }

  return (
    <div className="public-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <GovEmblem size={100} className="hero-emblem" />
          <h1 className="hero-title">
            बिहार सरकार<br />
            राजस्व एवं भूमि सुधार विभाग
          </h1>
          <p className="hero-subtitle">
            Government of Bihar<br />
            Department of Revenue and Land Reforms
          </p>
        </div>
      </section>

      {/* Modules Grid */}
      <section className="modules-section">
        <h2 className="section-title">सेवाएं / Services</h2>
        <div className="modules-grid">
          {modules.map((module) => (
            <div
              key={module.id}
              className={`module-card ${module.active ? 'active' : 'disabled'}`}
              onClick={() => handleModuleClick(module)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleModuleClick(module)
                }
              }}
              aria-label={`${module.title} - ${module.active ? 'Available' : 'Coming Soon'}`}
            >
              {!module.active && <span className="module-badge">Coming Soon</span>}
              <span className="module-icon" role="img" aria-hidden="true">
                {module.icon}
              </span>
              <span className="module-title">{module.title}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default LandingPage

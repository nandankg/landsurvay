import { useNavigate, useLocation } from 'react-router-dom'
import {
  ArrowLeftOutlined,
  EnvironmentOutlined,
  FileTextOutlined,
  RightOutlined,
  UserOutlined,
  SearchOutlined
} from '@ant-design/icons'
import './public.css'

const SearchResultsPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { data, searchType, searchValue } = location.state || {}

  // If no data, redirect to search
  if (!data) {
    return (
      <div className="public-page">
        <div className="results-page">
          <div className="no-results">
            <SearchOutlined className="no-results-icon" />
            <h3>कोई डेटा नहीं / No Data</h3>
            <p>कृपया पहले खोज करें</p>
            <button
              className="error-button"
              onClick={() => navigate('/search')}
            >
              खोजें / Search
            </button>
          </div>
        </div>
      </div>
    )
  }

  const { owner, properties, propertiesCount } = data

  // Single property result (direct property search)
  const isSingleProperty = searchType === 'property'

  const handlePropertyClick = (property) => {
    navigate(`/property/${property.id}`, {
      state: { property, owner }
    })
  }

  // If single property search, redirect directly to detail
  if (isSingleProperty && properties && properties.length === 1) {
    // Auto-navigate to property detail
    const property = properties[0]
    return (
      <div className="public-page">
        <div className="results-page">
          <div className="results-header">
            <button
              className="back-button"
              onClick={() => navigate('/search')}
              aria-label="Go back"
            >
              <ArrowLeftOutlined />
            </button>
            <h1 className="results-title">Property Found</h1>
          </div>

          <div className="owner-card">
            <div className="owner-label">मालिक / Owner</div>
            <div className="owner-name">{owner?.name || 'N/A'}</div>
            <div className="owner-details">
              <div className="owner-detail-item">
                <span className="owner-detail-label">पिता/पति</span>
                <span className="owner-detail-value">{owner?.fatherName || 'N/A'}</span>
              </div>
              <div className="owner-detail-item">
                <span className="owner-detail-label">आधार</span>
                <span className="owner-detail-value">{owner?.aadhaar || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="property-list">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id || index}
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="public-page">
      <div className="results-page">
        {/* Header */}
        <div className="results-header">
          <button
            className="back-button"
            onClick={() => navigate('/search')}
            aria-label="Go back"
          >
            <ArrowLeftOutlined />
          </button>
          <h1 className="results-title">खोज परिणाम / Results</h1>
          <span className="results-count">
            {propertiesCount || properties?.length || 0} प्रॉपर्टी
          </span>
        </div>

        {/* Owner Card */}
        {owner && (
          <div className="owner-card">
            <div className="owner-label">मालिक / Owner</div>
            <div className="owner-name">{owner.name}</div>
            <div className="owner-details">
              <div className="owner-detail-item">
                <span className="owner-detail-label">पिता/पति</span>
                <span className="owner-detail-value">{owner.fatherName}</span>
              </div>
              <div className="owner-detail-item">
                <span className="owner-detail-label">फोन</span>
                <span className="owner-detail-value">{owner.phone}</span>
              </div>
              <div className="owner-detail-item">
                <span className="owner-detail-label">आधार</span>
                <span className="owner-detail-value">{owner.aadhaar}</span>
              </div>
            </div>
          </div>
        )}

        {/* Properties List */}
        {properties && properties.length > 0 ? (
          <div className="property-list">
            {properties.map((property, index) => (
              <PropertyCard
                key={property.id || index}
                property={property}
                onClick={() => handlePropertyClick(property)}
              />
            ))}
          </div>
        ) : (
          <div className="no-results">
            <EnvironmentOutlined className="no-results-icon" />
            <h3>कोई प्रॉपर्टी नहीं मिली</h3>
            <p>No properties found</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Property Card Component
const PropertyCard = ({ property, onClick }) => {
  const formatArea = (property) => {
    if (property.acres && property.acres > 0) {
      return `${property.acres} ऐकर`
    }
    if (property.decimal && property.decimal > 0) {
      return `${property.decimal} डिसमिल`
    }
    return 'N/A'
  }

  return (
    <div className="property-card" onClick={onClick} role="button" tabIndex={0}>
      <div className="property-id">
        <EnvironmentOutlined className="property-id-icon" />
        <span>{property.propertyUniqueId}</span>
      </div>

      <div className="property-info-grid">
        <div className="property-info-item">
          <span className="property-info-label">प्लॉट नंबर</span>
          <span className="property-info-value">{property.plotNo || 'N/A'}</span>
        </div>
        <div className="property-info-item">
          <span className="property-info-label">खाता</span>
          <span className="property-info-value">{property.khataNo || 'N/A'}</span>
        </div>
        <div className="property-info-item">
          <span className="property-info-label">गाँव</span>
          <span className="property-info-value">{property.village || 'N/A'}</span>
        </div>
        <div className="property-info-item">
          <span className="property-info-label">क्षेत्रफल</span>
          <span className="property-info-value">{formatArea(property)}</span>
        </div>
      </div>

      <div className="property-footer">
        <div className="property-docs">
          <FileTextOutlined className="property-docs-icon" />
          <span>{property.documentsCount || property._count?.documents || 0} Documents</span>
        </div>
        <RightOutlined className="property-arrow" />
      </div>
    </div>
  )
}

export default SearchResultsPage

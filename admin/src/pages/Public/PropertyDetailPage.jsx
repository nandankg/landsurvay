import { useState, useEffect } from 'react'
import { useNavigate, useParams, useLocation } from 'react-router-dom'
import { message, Modal, Button, Input } from 'antd'
import {
  ArrowLeftOutlined,
  UserOutlined,
  EnvironmentOutlined,
  BorderOutlined,
  FileTextOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  ExclamationCircleOutlined,
  LockOutlined,
  CloseOutlined
} from '@ant-design/icons'
import publicService from '../../services/public.service'
import './public.css'

const PropertyDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const location = useLocation()

  // Get data from navigation state or fetch
  const passedData = location.state
  const [property, setProperty] = useState(passedData?.property || null)
  const [owner, setOwner] = useState(passedData?.owner || null)
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(!passedData?.property)
  const [error, setError] = useState(null)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewDoc, setPreviewDoc] = useState(null)

  // Passcode protection state
  const [passcodeModalVisible, setPasscodeModalVisible] = useState(false)
  const [passcodeInput, setPasscodeInput] = useState('')
  const [passcodeError, setPasscodeError] = useState('')
  const [pendingDoc, setPendingDoc] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    if (!passedData?.property && id) {
      fetchPropertyDetails()
    } else if (passedData?.property) {
      fetchDocuments()
    }
  }, [id, passedData])

  const fetchPropertyDetails = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await publicService.getPropertyDetails(id)
      console.log('Property API Response:', response) // Debug log
      if (response.success && response.data) {
        // Backend returns { property, owner, documents }
        const { property: propData, owner: ownerData, documents: docsData } = response.data
        setProperty(propData)
        setOwner(ownerData || null)
        setDocuments(docsData || [])
      } else {
        setError('Property not found')
      }
    } catch (err) {
      console.error('Property fetch error:', err) // Debug log
      setError(err.message || 'Failed to load property details')
    } finally {
      setLoading(false)
    }
  }

  const fetchDocuments = async () => {
    if (!property?.id && !id) return
    try {
      const response = await publicService.getPropertyDocuments(property?.id || id)
      if (response.success && response.data) {
        setDocuments(response.data.documents || response.data || [])
      }
    } catch (err) {
      console.error('Failed to fetch documents:', err)
    }
  }

  const handleDocumentClick = (doc) => {
    // If already authenticated for this session, show document directly
    if (isAuthenticated) {
      const viewUrl = publicService.getDocumentViewUrl(doc.id)
      setPreviewDoc({ ...doc, viewUrl })
      setPreviewVisible(true)
    } else {
      // Show passcode modal
      setPendingDoc(doc)
      setPasscodeInput('')
      setPasscodeError('')
      setPasscodeModalVisible(true)
    }
  }

  const handlePasscodeSubmit = () => {
    // Default passcode is the property unique ID
    const correctPasscode = property?.propertyUniqueId || ''

    if (passcodeInput === correctPasscode) {
      setIsAuthenticated(true)
      setPasscodeModalVisible(false)
      setPasscodeError('')

      // Open the pending document
      if (pendingDoc) {
        const viewUrl = publicService.getDocumentViewUrl(pendingDoc.id)
        setPreviewDoc({ ...pendingDoc, viewUrl })
        setPreviewVisible(true)
        setPendingDoc(null)
      }
    } else {
      setPasscodeError('गलत पासकोड / Incorrect passcode')
    }
  }

  const handlePasscodeCancel = () => {
    setPasscodeModalVisible(false)
    setPasscodeInput('')
    setPasscodeError('')
    setPendingDoc(null)
  }

  // Prevent context menu (right-click)
  const handleContextMenu = (e) => {
    e.preventDefault()
    return false
  }

  // Prevent keyboard shortcuts for copying/saving
  const handleKeyDown = (e) => {
    if (
      (e.ctrlKey && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'c' || e.key === 'C')) ||
      (e.metaKey && (e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P' || e.key === 'c' || e.key === 'C')) ||
      e.key === 'PrintScreen'
    ) {
      e.preventDefault()
      message.warning('दस्तावेज़ को कॉपी या सेव करना अक्षम है / Document copying/saving is disabled')
      return false
    }
  }

  const getDocumentIcon = (fileType) => {
    if (fileType === 'pdf') {
      return <FilePdfOutlined className="document-icon pdf" />
    }
    return <FileImageOutlined className="document-icon image" />
  }

  if (loading) {
    return (
      <div className="public-page">
        <div className="detail-page">
          <div className="loading-container">
            <div className="loading-spinner" />
            <p>लोड हो रहा है... / Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="public-page">
        <div className="detail-page">
          <div className="error-container">
            <ExclamationCircleOutlined className="error-icon" />
            <p className="error-message">{error}</p>
            <button className="error-button" onClick={() => navigate('/search')}>
              वापस जाएं / Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="public-page">
        <div className="detail-page">
          <div className="error-container">
            <ExclamationCircleOutlined className="error-icon" />
            <p className="error-message">Property not found</p>
            <button className="error-button" onClick={() => navigate('/search')}>
              वापस जाएं / Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="public-page">
      <div className="detail-page">
        {/* Header */}
        <div className="detail-header">
          <button
            className="back-button"
            onClick={() => navigate(-1)}
            aria-label="Go back"
          >
            <ArrowLeftOutlined />
          </button>
          <h1 className="detail-title">प्रॉपर्टी विवरण / Property Details</h1>
        </div>

        {/* Property ID Banner */}
        <div className="detail-property-id">
          {property.propertyUniqueId}
        </div>

        {/* Owner Details Section */}
        {owner && (
          <div className="detail-section">
            <h3 className="detail-section-title">
              <UserOutlined className="detail-section-icon" />
              मालिक विवरण / Owner Details
            </h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">नाम / Name</span>
                <span className="detail-value">{owner.name}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">पिता / पति</span>
                <span className="detail-value">{owner.fatherName}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">लिंग / Gender</span>
                <span className="detail-value">{owner.gender || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">फोन नंबर</span>
                <span className="detail-value">{owner.phone}</span>
              </div>
              <div className="detail-item full-width">
                <span className="detail-label">आधार नंबर</span>
                <span className="detail-value">{owner.aadhaar}</span>
              </div>
            </div>
          </div>
        )}

        {/* Land Details Section */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <EnvironmentOutlined className="detail-section-icon" />
            भूमि विवरण / Land Details
          </h3>
          <div className="detail-grid">
            <div className="detail-item">
              <span className="detail-label">प्लॉट नंबर</span>
              <span className="detail-value">{property.plotNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">खाता</span>
              <span className="detail-value">{property.khataNo}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">ऐकर</span>
              <span className="detail-value">{property.acres || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">डिसमिल</span>
              <span className="detail-value">{property.decimals || '-'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">जिला</span>
              <span className="detail-value">{property.district || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">गाँव</span>
              <span className="detail-value">{property.village || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Boundaries Section */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <BorderOutlined className="detail-section-icon" />
            चौहदी / Boundaries
          </h3>
          <div className="boundaries-grid">
            <div className="boundary-item">
              <span className="boundary-direction">उत्तर / North</span>
              <span className="boundary-value">{property.northBoundary || 'N/A'}</span>
            </div>
            <div className="boundary-item">
              <span className="boundary-direction">दक्षिण / South</span>
              <span className="boundary-value">{property.southBoundary || 'N/A'}</span>
            </div>
            <div className="boundary-item">
              <span className="boundary-direction">पूरब / East</span>
              <span className="boundary-value">{property.eastBoundary || 'N/A'}</span>
            </div>
            <div className="boundary-item">
              <span className="boundary-direction">पश्चिम / West</span>
              <span className="boundary-value">{property.westBoundary || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="detail-section">
          <h3 className="detail-section-title">
            <FileTextOutlined className="detail-section-icon" />
            दस्तावेज / Documents ({documents.length})
          </h3>
          {documents.length > 0 ? (
            <div className="documents-grid">
              {documents.map((doc, index) => (
                <div
                  key={doc.id || index}
                  className="document-card"
                  onClick={() => handleDocumentClick(doc)}
                  role="button"
                  tabIndex={0}
                >
                  {getDocumentIcon(doc.fileType)}
                  <span className="document-name">
                    {doc.description || doc.originalName || `Document ${index + 1}`}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-light)' }}>
              कोई दस्तावेज नहीं / No documents
            </p>
          )}
        </div>
      </div>

      {/* Passcode Modal */}
      <Modal
        open={passcodeModalVisible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <LockOutlined style={{ color: '#faad14' }} />
            <span>दस्तावेज़ पासकोड / Document Passcode</span>
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <Button onClick={handlePasscodeCancel}>
              रद्द करें / Cancel
            </Button>
            <Button type="primary" onClick={handlePasscodeSubmit}>
              देखें / View
            </Button>
          </div>
        }
        onCancel={handlePasscodeCancel}
        width={400}
        centered
      >
        <div style={{ padding: '16px 0' }}>
          <p style={{ marginBottom: 16, color: '#666' }}>
            दस्तावेज़ देखने के लिए पासकोड दर्ज करें / Enter passcode to view document
          </p>
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="पासकोड दर्ज करें / Enter passcode"
            value={passcodeInput}
            onChange={(e) => setPasscodeInput(e.target.value)}
            onPressEnter={handlePasscodeSubmit}
            status={passcodeError ? 'error' : ''}
          />
          {passcodeError && (
            <p style={{ color: '#ff4d4f', marginTop: 8, marginBottom: 0 }}>
              {passcodeError}
            </p>
          )}
          <p style={{ marginTop: 12, fontSize: 12, color: '#999' }}>
            संकेत: पासकोड प्रॉपर्टी ID है / Hint: Passcode is the Property ID
          </p>
        </div>
      </Modal>

      {/* Document Preview Modal - Secured */}
      <Modal
        open={previewVisible}
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {previewDoc?.fileType === 'pdf' ? (
              <FilePdfOutlined style={{ color: '#e74c3c' }} />
            ) : (
              <FileImageOutlined style={{ color: '#3498db' }} />
            )}
            <span>{previewDoc?.description || previewDoc?.originalName || 'Document Preview'}</span>
            <LockOutlined style={{ color: '#52c41a', marginLeft: 'auto', fontSize: 14 }} title="Secured Document" />
          </div>
        }
        footer={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#666', fontSize: 12 }}>
              🔒 {previewDoc?.fileType?.toUpperCase()} Document - View Only
            </span>
            <Button
              type="primary"
              onClick={() => setPreviewVisible(false)}
            >
              Close / बंद करें
            </Button>
          </div>
        }
        onCancel={() => setPreviewVisible(false)}
        width={900}
        centered
        bodyStyle={{ padding: 0, maxHeight: '70vh', overflow: 'auto' }}
        className="secure-document-modal"
      >
        {previewDoc && (
          <div
            className="document-preview-container secure-preview"
            onContextMenu={handleContextMenu}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Watermark overlay to discourage screenshots */}
            <div className="document-watermark">
              <span>{property?.propertyUniqueId}</span>
              <span>{property?.propertyUniqueId}</span>
              <span>{property?.propertyUniqueId}</span>
              <span>{property?.propertyUniqueId}</span>
              <span>{property?.propertyUniqueId}</span>
              <span>{property?.propertyUniqueId}</span>
            </div>

            {previewDoc.fileType === 'pdf' ? (
              <iframe
                src={`${previewDoc.viewUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}
                style={{
                  width: '100%',
                  height: '70vh',
                  border: 'none',
                  pointerEvents: 'auto'
                }}
                title="PDF Preview"
                sandbox="allow-same-origin allow-scripts"
              />
            ) : (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
                background: '#f5f5f5',
                minHeight: '50vh',
                position: 'relative'
              }}>
                <img
                  src={previewDoc.viewUrl}
                  alt={previewDoc.description || 'Document'}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '65vh',
                    objectFit: 'contain',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    borderRadius: 4,
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

export default PropertyDetailPage

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import {
  MobileOutlined,
  IdcardOutlined,
  HomeOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import publicService from '../../services/public.service'
import './public.css'

const SearchPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(null) // 'mobile', 'aadhaar', 'property' or null
  const [mobileNo, setMobileNo] = useState('')
  const [aadhaarNo, setAadhaarNo] = useState('')
  const [propertyId, setPropertyId] = useState('')

  const handleSearch = async (type) => {
    let searchValue = ''
    let searchFn = null

    switch (type) {
      case 'mobile':
        searchValue = mobileNo.trim()
        if (!searchValue || searchValue.length !== 10) {
          message.error('कृपया 10 अंकों का मोबाइल नंबर दर्ज करें')
          return
        }
        searchFn = () => publicService.searchByMobile(searchValue)
        break

      case 'aadhaar':
        searchValue = aadhaarNo.trim().replace(/\s/g, '')
        if (!searchValue || searchValue.length !== 12) {
          message.error('कृपया 12 अंकों का आधार नंबर दर्ज करें')
          return
        }
        searchFn = () => publicService.searchByAadhaar(searchValue)
        break

      case 'property':
        searchValue = propertyId.trim().toUpperCase()
        if (!searchValue) {
          message.error('कृपया प्रॉपर्टी आईडी दर्ज करें')
          return
        }
        searchFn = () => publicService.searchByPropertyId(searchValue)
        break

      default:
        return
    }

    setLoading(type)

    try {
      const response = await searchFn()

      if (response.success && response.data) {
        // Navigate to results with data
        navigate('/search/results', {
          state: {
            searchType: type,
            searchValue: searchValue,
            data: response.data
          }
        })
      } else {
        message.warning('कोई रिकॉर्ड नहीं मिला / No records found')
      }
    } catch (error) {
      message.error(error.message || 'खोज में त्रुटि / Search error')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="public-page">
      <div className="search-page">
        {/* Header */}
        <div className="search-header">
          <button
            className="back-button"
            onClick={() => navigate('/')}
            aria-label="Go back"
            style={{
              position: 'absolute',
              left: '16px',
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: 'white'
            }}
          >
            <ArrowLeftOutlined />
          </button>
          <h1 className="search-title">सर्वेक्षण स्थिति 2023</h1>
          <p className="search-subtitle">Survey Status 2023</p>
        </div>

        {/* Search Forms */}
        <div className="search-form-container">
          {/* Mobile Number Search */}
          <div className="search-card">
            <label className="search-card-label">
              <MobileOutlined className="search-card-icon" />
              <span>Mobile no. / मोबाइल नंबर</span>
            </label>
            <input
              type="tel"
              className="search-input"
              placeholder="10 अंकों का मोबाइल नंबर दर्ज करें"
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value.replace(/\D/g, '').slice(0, 10))}
              maxLength={10}
              disabled={loading !== null}
            />
            <button
              className="search-button"
              onClick={() => handleSearch('mobile')}
              disabled={loading !== null}
            >
              {loading === 'mobile' ? 'खोज रहे हैं...' : 'Search / खोजें'}
            </button>
          </div>

          {/* Aadhaar Number Search */}
          <div className="search-card">
            <label className="search-card-label">
              <IdcardOutlined className="search-card-icon" />
              <span>Aadhaar no. / आधार नंबर</span>
            </label>
            <input
              type="text"
              className="search-input"
              placeholder="12 अंकों का आधार नंबर दर्ज करें"
              value={aadhaarNo}
              onChange={(e) => setAadhaarNo(e.target.value.replace(/\D/g, '').slice(0, 12))}
              maxLength={12}
              disabled={loading !== null}
            />
            <button
              className="search-button"
              onClick={() => handleSearch('aadhaar')}
              disabled={loading !== null}
            >
              {loading === 'aadhaar' ? 'खोज रहे हैं...' : 'Search / खोजें'}
            </button>
          </div>

          {/* Property ID Search */}
          <div className="search-card">
            <label className="search-card-label">
              <HomeOutlined className="search-card-icon" />
              <span>Property Unique ID / प्रॉपर्टी आईडी</span>
            </label>
            <input
              type="text"
              className="search-input"
              placeholder="उदाहरण: BH2023-PAT-00001"
              value={propertyId}
              onChange={(e) => setPropertyId(e.target.value.toUpperCase())}
              disabled={loading !== null}
            />
            <button
              className="search-button"
              onClick={() => handleSearch('property')}
              disabled={loading !== null}
            >
              {loading === 'property' ? 'खोज रहे हैं...' : 'Search / खोजें'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SearchPage

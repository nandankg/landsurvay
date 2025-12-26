import { useState, useEffect } from 'react'
import { Card, Row, Col, Typography, Tag, Button, Space, Descriptions, message, Upload, Image, Empty, Spin, Popconfirm } from 'antd'
import { ArrowLeftOutlined, EditOutlined, UploadOutlined, DeleteOutlined, FileOutlined, FilePdfOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import propertyService from '../../services/property.service'
import documentService from '../../services/document.service'
import { formatDate, formatFileSize } from '../../utils/formatters'

const { Title, Text } = Typography

const PropertyDetail = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [property, setProperty] = useState(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await propertyService.getById(id)
      setProperty(response.data)
    } catch (error) {
      message.error('Failed to load property')
      navigate('/admin/properties')
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true)
    try {
      await documentService.upload(id, [file])
      message.success('Document uploaded successfully')
      fetchProperty()
      onSuccess()
    } catch (error) {
      message.error(error.message || 'Upload failed')
      onError(error)
    } finally {
      setUploading(false)
    }
  }

  const handleDeleteDocument = async (docId) => {
    try {
      await documentService.delete(docId)
      message.success('Document deleted')
      fetchProperty()
    } catch (error) {
      message.error('Failed to delete document')
    }
  }

  const getDocumentIcon = (fileType) => {
    if (fileType === 'pdf') {
      return <FilePdfOutlined style={{ fontSize: 48, color: '#ff4d4f' }} />
    }
    return <FileOutlined style={{ fontSize: 48, color: '#1890ff' }} />
  }

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  if (!property) {
    return <Empty description="Property not found" />
  }

  const statusColors = {
    completed: 'green',
    pending: 'orange',
    verified: 'blue'
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/properties')}>
            Back
          </Button>
          <Title level={4} style={{ margin: 0 }}>
            {property.propertyUniqueId}
          </Title>
          <Tag color={statusColors[property.surveyStatus]}>{property.surveyStatus}</Tag>
        </Space>
        <Button type="primary" icon={<EditOutlined />} onClick={() => navigate(`/admin/properties/${id}/edit`)}>
          Edit
        </Button>
      </div>

      <Row gutter={[24, 24]}>
        {/* Owner Info */}
        <Col xs={24} lg={12}>
          <Card title="Owner Information" bordered={false} style={{ borderRadius: 12, height: '100%' }}>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Name (नाम)">
                <Text strong>{property.owner?.name}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Father/Husband (पिता/पति)">
                {property.owner?.fatherName || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Gender (लिंग)">
                {property.owner?.gender || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Phone (फोन)">
                {property.owner?.phone || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Aadhaar (आधार)">
                <Text code>{property.owner?.aadhaar}</Text>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Property Info */}
        <Col xs={24} lg={12}>
          <Card title="Property Details" bordered={false} style={{ borderRadius: 12, height: '100%' }}>
            <Descriptions column={2} size="small">
              <Descriptions.Item label="Plot No. (प्लॉट)">
                <Text strong>{property.plotNo}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Khata No. (खाता)">
                <Text strong>{property.khataNo || '-'}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="District (जिला)">
                {property.district}
              </Descriptions.Item>
              <Descriptions.Item label="Village (गांव)">
                {property.village || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Acres (ऐकर)">
                {property.acres || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Decimals (डिसमिल)">
                {property.decimals || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="Created">
                {formatDate(property.createdAt)}
              </Descriptions.Item>
              <Descriptions.Item label="Updated">
                {formatDate(property.updatedAt)}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        {/* Boundaries */}
        <Col xs={24}>
          <Card title="Boundaries (चौहदी)" bordered={false} style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              <Col xs={12} sm={6}>
                <Text type="secondary">North (उत्तर)</Text>
                <div><Text strong>{property.northBoundary || '-'}</Text></div>
              </Col>
              <Col xs={12} sm={6}>
                <Text type="secondary">South (दक्षिण)</Text>
                <div><Text strong>{property.southBoundary || '-'}</Text></div>
              </Col>
              <Col xs={12} sm={6}>
                <Text type="secondary">East (पूरब)</Text>
                <div><Text strong>{property.eastBoundary || '-'}</Text></div>
              </Col>
              <Col xs={12} sm={6}>
                <Text type="secondary">West (पश्चिम)</Text>
                <div><Text strong>{property.westBoundary || '-'}</Text></div>
              </Col>
            </Row>
          </Card>
        </Col>

        {/* Documents */}
        <Col xs={24}>
          <Card
            title={`Documents (${property.documents?.length || 0}/7)`}
            bordered={false}
            style={{ borderRadius: 12 }}
            extra={
              property.documents?.length < 7 && (
                <Upload
                  customRequest={handleUpload}
                  showUploadList={false}
                  accept=".pdf,.jpg,.jpeg,.png"
                >
                  <Button icon={<UploadOutlined />} loading={uploading}>
                    Upload Document
                  </Button>
                </Upload>
              )
            }
          >
            {property.documents?.length > 0 ? (
              <Row gutter={[16, 16]}>
                {property.documents.map(doc => (
                  <Col xs={12} sm={8} md={6} lg={4} key={doc.id}>
                    <Card
                      size="small"
                      hoverable
                      style={{ textAlign: 'center' }}
                      cover={
                        ['jpg', 'jpeg', 'png'].includes(doc.fileType) ? (
                          <div style={{ padding: 8 }}>
                            <Image
                              src={`${import.meta.env.VITE_API_URL?.replace('/api', '')}/uploads/documents/${doc.filePath.split('/').pop()}`}
                              alt={doc.fileName}
                              style={{ maxHeight: 120, objectFit: 'cover' }}
                              fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                            />
                          </div>
                        ) : (
                          <div style={{ padding: 24 }}>
                            {getDocumentIcon(doc.fileType)}
                          </div>
                        )
                      }
                      actions={[
                        <a
                          href={documentService.getDownloadUrl(doc.id)}
                          target="_blank"
                          rel="noopener noreferrer"
                          key="download"
                        >
                          Download
                        </a>,
                        <Popconfirm
                          title="Delete this document?"
                          onConfirm={() => handleDeleteDocument(doc.id)}
                          key="delete"
                        >
                          <DeleteOutlined style={{ color: '#ff4d4f' }} />
                        </Popconfirm>
                      ]}
                    >
                      <Card.Meta
                        title={<Text ellipsis style={{ fontSize: 12 }}>{doc.fileName}</Text>}
                        description={<Text type="secondary" style={{ fontSize: 10 }}>{formatFileSize(doc.fileSize)}</Text>}
                      />
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Empty description="No documents uploaded" />
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default PropertyDetail

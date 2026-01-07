import { useState, useEffect } from 'react'
import { Form, Input, Select, Button, Card, Row, Col, Typography, message, InputNumber, Divider, Space } from 'antd'
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import propertyService from '../../services/property.service'
import ownerService from '../../services/owner.service'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const DISTRICTS = [
  'Patna', 'Gaya', 'Muzaffarpur', 'Bhagalpur', 'Darbhanga',
  'Purnia', 'Begusarai', 'Samastipur', 'Munger', 'Nalanda'
]

const PropertyForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const isEdit = !!id
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [owners, setOwners] = useState([])
  const [loadingOwners, setLoadingOwners] = useState(false)
  const [searchOwner, setSearchOwner] = useState('')

  useEffect(() => {
    if (isEdit) {
      fetchProperty()
    }
    fetchOwners()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await propertyService.getById(id)
      const property = response.data
      form.setFieldsValue({
        ...property,
        ownerId: property.owner?.id
      })
    } catch (error) {
      message.error('Failed to load property')
      navigate('/admin/properties')
    }
  }

  const fetchOwners = async (search = '') => {
    setLoadingOwners(true)
    try {
      const response = await ownerService.getAll({ search, limit: 50 })
      setOwners(response.data)
    } catch (error) {
      console.error('Failed to load owners')
    } finally {
      setLoadingOwners(false)
    }
  }

  const handleOwnerSearch = (value) => {
    setSearchOwner(value)
    fetchOwners(value)
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      if (isEdit) {
        await propertyService.update(id, values)
        message.success('Property updated successfully')
      } else {
        await propertyService.create(values)
        message.success('Property created successfully')
      }
      navigate('/admin/properties')
    } catch (error) {
      message.error(error.message || 'Failed to save property')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate('/admin/properties')}>
          Back
        </Button>
        <Title level={4} style={{ margin: 0 }}>
          {isEdit ? 'Edit Property' : 'Add New Property'}
        </Title>
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          requiredMark="optional"
        >
          {/* Owner Selection */}
          <Title level={5}>Owner Information</Title>
          <Form.Item
            name="ownerId"
            label="Select Owner"
            rules={[{ required: true, message: 'Please select an owner' }]}
          >
            <Select
              showSearch
              placeholder="Search and select owner"
              filterOption={false}
              onSearch={handleOwnerSearch}
              loading={loadingOwners}
              notFoundContent={loadingOwners ? 'Loading...' : 'No owners found'}
            >
              {owners.map(owner => (
                <Option key={owner.id} value={owner.id}>
                  {owner.name} - {owner.phone} ({owner.aadhaar})
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Divider />

          {/* Property Details */}
          <Title level={5}>Property Details</Title>
          {!isEdit && (
            <Row gutter={16}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item
                  name="propertyUniqueId"
                  label="Property ID (संपत्ति आईडी)"
                  tooltip="Leave empty to auto-generate"
                >
                  <Input placeholder="Enter property ID or leave empty for auto-generate" />
                </Form.Item>
              </Col>
            </Row>
          )}
          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="plotNo"
                label="Plot Number (प्लॉट नंबर)"
                rules={[{ required: true, message: 'Please enter plot number' }]}
              >
                <Input placeholder="Enter plot number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="khataNo"
                label="Khata Number (खाता नंबर)"
              >
                <Input placeholder="Enter khata number" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item
                name="district"
                label="District (जिला)"
                rules={[{ required: true, message: 'Please select district' }]}
              >
                <Select placeholder="Select district">
                  {DISTRICTS.map(d => (
                    <Option key={d} value={d}>{d}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="village" label="Village (गांव)">
                <Input placeholder="Enter village name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="thana" label="Thana (थाना)">
                <Input placeholder="Enter thana" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item name="surveyStatus" label="Survey Status" initialValue="pending">
                <Select>
                  <Option value="pending">Pending</Option>
                  <Option value="completed">Completed</Option>
                  <Option value="verified">Verified</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="acres" label="Acres (ऐकर)">
                <InputNumber placeholder="0" min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="decimals" label="Decimals (डिसमिल)">
                <InputNumber placeholder="0" min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          {/* Boundaries */}
          <Title level={5}>Boundaries (चौहदी)</Title>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="northBoundary" label="North (उत्तर)">
                <Input placeholder="Enter north boundary" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="southBoundary" label="South (दक्षिण)">
                <Input placeholder="Enter south boundary" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="eastBoundary" label="East (पूरब)">
                <Input placeholder="Enter east boundary" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="westBoundary" label="West (पश्चिम)">
                <Input placeholder="Enter west boundary" />
              </Form.Item>
            </Col>
          </Row>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={loading}
              >
                {isEdit ? 'Update Property' : 'Create Property'}
              </Button>
              <Button onClick={() => navigate('/admin/properties')}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default PropertyForm

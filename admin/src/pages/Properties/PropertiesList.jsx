import { useState, useEffect } from 'react'
import { Table, Card, Button, Input, Space, Tag, Typography, message, Select, Row, Col } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FileOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import propertyService from '../../services/property.service'
import { formatDate } from '../../utils/formatters'
import { showDeleteConfirm } from '../../components/ConfirmModal'

const { Title, Text } = Typography

const PropertiesList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [properties, setProperties] = useState([])
  const [districts, setDistricts] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [search, setSearch] = useState('')
  const [districtFilter, setDistrictFilter] = useState('')

  useEffect(() => {
    fetchDistricts()
  }, [])

  useEffect(() => {
    fetchProperties()
  }, [pagination.current, search, districtFilter])

  const fetchDistricts = async () => {
    try {
      const response = await propertyService.getDistricts()
      setDistricts(response.data || [])
    } catch (error) {
      console.error('Failed to load districts')
    }
  }

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await propertyService.getAll({
        page: pagination.current,
        limit: pagination.pageSize,
        search,
        district: districtFilter
      })
      setProperties(response.data)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }))
    } catch (error) {
      message.error('Failed to load properties')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleDistrictChange = (value) => {
    setDistrictFilter(value || '')
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleTableChange = (pag) => {
    setPagination(prev => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize
    }))
  }

  const handleDelete = (record) => {
    showDeleteConfirm({
      title: `Delete property "${record.propertyUniqueId}"?`,
      content: `This will also delete ${record.documentCount || 0} associated documents.`,
      onOk: async () => {
        try {
          await propertyService.delete(record.id)
          message.success('Property deleted successfully')
          fetchProperties()
        } catch (error) {
          message.error(error.message || 'Failed to delete property')
        }
      }
    })
  }

  const columns = [
    {
      title: 'Property ID',
      dataIndex: 'propertyUniqueId',
      key: 'propertyUniqueId',
      render: (text) => <Text strong style={{ color: '#C41E3A' }}>{text}</Text>
    },
    {
      title: 'Owner',
      dataIndex: ['owner', 'name'],
      key: 'owner'
    },
    {
      title: 'Plot / Khata',
      key: 'plotKhata',
      render: (_, record) => (
        <span>{record.plotNo} / {record.khataNo || '-'}</span>
      )
    },
    {
      title: 'District',
      dataIndex: 'district',
      key: 'district'
    },
    {
      title: 'Area',
      key: 'area',
      render: (_, record) => (
        <span>
          {record.acres ? `${record.acres} acre ` : ''}
          {record.decimals ? `${record.decimals} decimal` : '-'}
        </span>
      )
    },
    {
      title: 'Status',
      dataIndex: 'surveyStatus',
      key: 'surveyStatus',
      render: (status) => {
        const colors = {
          completed: 'green',
          pending: 'orange',
          verified: 'blue'
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      }
    },
    {
      title: 'Docs',
      dataIndex: 'documentCount',
      key: 'documentCount',
      render: (count) => (
        <Tag icon={<FileOutlined />} color={count > 0 ? 'blue' : 'default'}>
          {count || 0}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/properties/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/properties/${record.id}/edit`)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record)}
          />
        </Space>
      )
    }
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0 }}>Properties</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/admin/properties/new')}>
          Add Property
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={8}>
            <Input.Search
              placeholder="Search by ID, plot, or owner"
              allowClear
              enterButton={<SearchOutlined />}
              onSearch={handleSearch}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Filter by district"
              allowClear
              style={{ width: '100%' }}
              onChange={handleDistrictChange}
              value={districtFilter || undefined}
            >
              {districts.map(d => (
                <Select.Option key={d} value={d}>{d}</Select.Option>
              ))}
            </Select>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={properties}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} properties`
          }}
          onChange={handleTableChange}
          scroll={{ x: 900 }}
        />
      </Card>
    </div>
  )
}

export default PropertiesList

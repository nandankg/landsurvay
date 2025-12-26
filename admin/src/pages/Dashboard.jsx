import { useState, useEffect } from 'react'
import { Row, Col, Card, Typography, Table, Tag, Spin, message } from 'antd'
import { UserOutlined, HomeOutlined, FileOutlined, EnvironmentOutlined } from '@ant-design/icons'
import StatCard from '../components/StatCard'
import authService from '../services/auth.service'
import { formatDate } from '../utils/formatters'

const { Title, Text } = Typography

const Dashboard = () => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({
    stats: { totalOwners: 0, totalProperties: 0, totalDocuments: 0 },
    recentProperties: [],
    districtStats: []
  })

  useEffect(() => {
    fetchDashboard()
  }, [])

  const fetchDashboard = async () => {
    try {
      const response = await authService.getDashboard()
      setData(response.data)
    } catch (error) {
      message.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const recentColumns = [
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
      title: 'District',
      dataIndex: 'district',
      key: 'district'
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
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date)
    }
  ]

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>Dashboard</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Owners"
            value={data.stats.totalOwners}
            icon={<UserOutlined />}
            color="#1890ff"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Properties"
            value={data.stats.totalProperties}
            icon={<HomeOutlined />}
            color="#52c41a"
          />
        </Col>
        <Col xs={24} sm={8}>
          <StatCard
            title="Total Documents"
            value={data.stats.totalDocuments}
            icon={<FileOutlined />}
            color="#faad14"
          />
        </Col>
      </Row>

      <Row gutter={[24, 24]} style={{ marginTop: 24 }}>
        <Col xs={24} lg={16}>
          <Card title="Recent Properties" bordered={false} style={{ borderRadius: 12 }}>
            <Table
              columns={recentColumns}
              dataSource={data.recentProperties}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="Properties by District" bordered={false} style={{ borderRadius: 12 }}>
            {data.districtStats.length > 0 ? (
              data.districtStats.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: index < data.districtStats.length - 1 ? '1px solid #f0f0f0' : 'none'
                  }}
                >
                  <Text>
                    <EnvironmentOutlined style={{ marginRight: 8, color: '#C41E3A' }} />
                    {item.district}
                  </Text>
                  <Tag color="blue">{item.count} properties</Tag>
                </div>
              ))
            ) : (
              <Text type="secondary">No data available</Text>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Dashboard

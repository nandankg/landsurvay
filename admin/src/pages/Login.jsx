import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import AuthLayout from '../layouts/AuthLayout'

const { Title, Text } = Typography

const Login = () => {
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  const onFinish = async (values) => {
    setLoading(true)
    try {
      await login(values.username, values.password)
      message.success('Login successful!')
      navigate(from, { replace: true })
    } catch (error) {
      message.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Card
        style={{
          width: 400,
          borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.2)'
        }}
        bordered={false}
      >
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <svg width="60" height="60" viewBox="0 0 100 100" style={{ marginBottom: 16 }}>
            <rect width="100" height="100" rx="20" fill="#C41E3A"/>
            <g fill="white" transform="translate(20, 15) scale(0.6)">
              <rect x="35" y="70" width="30" height="25" fill="none" stroke="white" strokeWidth="4"/>
              <line x1="50" y1="20" x2="50" y2="70" stroke="white" strokeWidth="4"/>
              <ellipse cx="50" cy="20" rx="20" ry="12" fill="none" stroke="white" strokeWidth="3"/>
              <line x1="30" y1="35" x2="50" y2="45" stroke="white" strokeWidth="3"/>
              <line x1="70" y1="35" x2="50" y2="45" stroke="white" strokeWidth="3"/>
            </g>
          </svg>
          <Title level={3} style={{ marginBottom: 4 }}>Bihar Land Admin</Title>
          <Text type="secondary">Sign in to your account</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Username"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#bfbfbf' }} />}
              placeholder="Password"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              block
              loading={loading}
              style={{ height: 48, borderRadius: 8 }}
            >
              Sign In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            Department of Revenue and Land Reforms, Govt. of Bihar
          </Text>
        </div>
      </Card>
    </AuthLayout>
  )
}

export default Login

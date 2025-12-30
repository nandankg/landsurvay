import { useState } from 'react'
import { Layout, Menu, Button, Avatar, Dropdown, Typography } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  DashboardOutlined,
  UserOutlined,
  HomeOutlined,
  UploadOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons'
import { useAuth } from '../context/AuthContext'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuth()

  const menuItems = [
    {
      key: '/admin/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard'
    },
    {
      key: '/admin/owners',
      icon: <UserOutlined />,
      label: 'Owners'
    },
    {
      key: '/admin/properties',
      icon: <HomeOutlined />,
      label: 'Properties'
    },
    {
      key: '/admin/import',
      icon: <UploadOutlined />,
      label: 'Import Data'
    }
  ]

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: admin?.name || admin?.username || 'Admin'
    },
    {
      type: 'divider'
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true
    }
  ]

  const handleMenuClick = ({ key }) => {
    navigate(key)
  }

  const handleUserMenuClick = ({ key }) => {
    if (key === 'logout') {
      logout()
      navigate('/')
    }
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="light"
        style={{
          boxShadow: '2px 0 8px rgba(0,0,0,0.05)',
          zIndex: 10
        }}
      >
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Sidebar Logo - Replace /logos/app_logo.svg or app_logo.png to change */}
            <img
              src="/logos/app_logo.svg"
              alt="Bihar Land"
              style={{
                width: 36,
                height: 36,
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.onerror = null
                e.target.src = '/logos/bihar_govt_logo.png'
              }}
            />
            {!collapsed && (
              <Text strong style={{ fontSize: 16, color: '#C41E3A' }}>
                Bihar Land
              </Text>
            )}
          </div>
        </div>

        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ border: 'none', marginTop: 8 }}
        />
      </Sider>

      <Layout>
        <Header style={{
          padding: '0 24px',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 4px rgba(0,0,0,0.05)'
        }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: 16 }}
          />

          <Dropdown
            menu={{
              items: userMenuItems,
              onClick: handleUserMenuClick
            }}
            placement="bottomRight"
          >
            <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
              <Avatar style={{ backgroundColor: '#C41E3A' }} icon={<UserOutlined />} />
              <Text>{admin?.username}</Text>
            </div>
          </Dropdown>
        </Header>

        <Content style={{
          margin: 24,
          padding: 24,
          background: '#f5f5f5',
          minHeight: 280,
          borderRadius: 8
        }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default DashboardLayout

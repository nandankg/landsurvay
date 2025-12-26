import { Layout } from 'antd'

const { Content } = Layout

const AuthLayout = ({ children }) => {
  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <Content style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '24px'
      }}>
        {children}
      </Content>
    </Layout>
  )
}

export default AuthLayout

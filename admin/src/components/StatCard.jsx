import { Card, Statistic } from 'antd'

const StatCard = ({ title, value, icon, color = '#C41E3A', loading = false }) => {
  return (
    <Card bordered={false} style={{ borderRadius: 12 }}>
      <Statistic
        title={<span style={{ color: '#666' }}>{title}</span>}
        value={value}
        loading={loading}
        prefix={icon && <span style={{ color, marginRight: 8 }}>{icon}</span>}
        valueStyle={{ color, fontWeight: 600 }}
      />
    </Card>
  )
}

export default StatCard

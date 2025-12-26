import { useState } from 'react'
import { Card, Upload, Button, Typography, message, Table, Tag, Progress, Alert, Space, Divider } from 'antd'
import { UploadOutlined, DownloadOutlined, FileExcelOutlined, CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'
import importService from '../../services/import.service'
import { formatDateTime } from '../../utils/formatters'

const { Title, Text, Paragraph } = Typography
const { Dragger } = Upload

const ImportPage = () => {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [logs, setLogs] = useState([])
  const [loadingLogs, setLoadingLogs] = useState(false)

  const handleUpload = async ({ file, onSuccess, onError }) => {
    setUploading(true)
    setResult(null)
    try {
      const response = await importService.importFile(file)
      setResult(response.data)
      message.success(response.message)
      onSuccess()
      fetchLogs()
    } catch (error) {
      message.error(error.message || 'Import failed')
      onError(error)
    } finally {
      setUploading(false)
    }
  }

  const fetchLogs = async () => {
    setLoadingLogs(true)
    try {
      const response = await importService.getLogs({ limit: 10 })
      setLogs(response.data.logs)
    } catch (error) {
      console.error('Failed to load logs')
    } finally {
      setLoadingLogs(false)
    }
  }

  useState(() => {
    fetchLogs()
  }, [])

  const downloadTemplate = () => {
    window.open(importService.getTemplate(), '_blank')
  }

  const logColumns = [
    {
      title: 'File',
      dataIndex: 'fileName',
      key: 'fileName',
      render: (text) => <Text ellipsis style={{ maxWidth: 150 }}>{text}</Text>
    },
    {
      title: 'Total',
      dataIndex: 'totalRows',
      key: 'totalRows'
    },
    {
      title: 'Success',
      dataIndex: 'successCount',
      key: 'successCount',
      render: (count) => <Tag color="green">{count}</Tag>
    },
    {
      title: 'Failed',
      dataIndex: 'failedCount',
      key: 'failedCount',
      render: (count) => <Tag color={count > 0 ? 'red' : 'default'}>{count}</Tag>
    },
    {
      title: 'Date',
      dataIndex: 'importedAt',
      key: 'importedAt',
      render: (date) => formatDateTime(date)
    }
  ]

  return (
    <div>
      <Title level={4}>Import Data</Title>
      <Paragraph type="secondary">
        Upload CSV or Excel files to bulk import land records. The system will automatically
        match existing owners by Aadhaar number.
      </Paragraph>

      <Card bordered={false} style={{ borderRadius: 12, marginBottom: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Button icon={<DownloadOutlined />} onClick={downloadTemplate}>
            Download Template
          </Button>
        </Space>

        <Dragger
          customRequest={handleUpload}
          showUploadList={false}
          accept=".csv,.xls,.xlsx"
          disabled={uploading}
        >
          <p className="ant-upload-drag-icon">
            <FileExcelOutlined style={{ color: '#52c41a', fontSize: 48 }} />
          </p>
          <p className="ant-upload-text">Click or drag CSV/Excel file to upload</p>
          <p className="ant-upload-hint">
            Supports: .csv, .xls, .xlsx (Max 5MB, 1000 rows recommended)
          </p>
        </Dragger>

        {uploading && (
          <div style={{ marginTop: 24 }}>
            <Progress percent={99} status="active" />
            <Text type="secondary">Processing file...</Text>
          </div>
        )}

        {result && (
          <div style={{ marginTop: 24 }}>
            <Alert
              type={result.failedCount === 0 ? 'success' : 'warning'}
              message={
                <Space>
                  {result.failedCount === 0 ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : (
                    <CloseCircleOutlined style={{ color: '#faad14' }} />
                  )}
                  <span>
                    Import completed: {result.successCount} of {result.totalRows} records imported
                  </span>
                </Space>
              }
              description={
                <div style={{ marginTop: 8 }}>
                  <Space split={<Divider type="vertical" />}>
                    <span>Owners created: {result.created?.owners || 0}</span>
                    <span>Properties created: {result.created?.properties || 0}</span>
                  </Space>
                  {result.errors?.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="danger">Errors:</Text>
                      <ul style={{ margin: '8px 0', paddingLeft: 20 }}>
                        {result.errors.slice(0, 5).map((err, i) => (
                          <li key={i}><Text type="secondary">{err}</Text></li>
                        ))}
                        {result.errors.length > 5 && (
                          <li><Text type="secondary">...and {result.errors.length - 5} more</Text></li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              }
            />
          </div>
        )}
      </Card>

      <Card title="Import History" bordered={false} style={{ borderRadius: 12 }}>
        <Table
          columns={logColumns}
          dataSource={logs}
          rowKey="id"
          loading={loadingLogs}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}

export default ImportPage

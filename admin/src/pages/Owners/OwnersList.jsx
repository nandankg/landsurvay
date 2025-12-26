import { useState, useEffect } from 'react'
import { Table, Card, Button, Input, Space, Tag, Typography, message, Modal, Form } from 'antd'
import { PlusOutlined, SearchOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import ownerService from '../../services/owner.service'
import { formatDate } from '../../utils/formatters'
import { showDeleteConfirm } from '../../components/ConfirmModal'
import OwnerForm from './OwnerForm'

const { Title, Text } = Typography

const OwnersList = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [owners, setOwners] = useState([])
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 })
  const [search, setSearch] = useState('')
  const [modalVisible, setModalVisible] = useState(false)
  const [editingOwner, setEditingOwner] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchOwners()
  }, [pagination.current, search])

  const fetchOwners = async () => {
    setLoading(true)
    try {
      const response = await ownerService.getAll({
        page: pagination.current,
        limit: pagination.pageSize,
        search
      })
      setOwners(response.data)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total
      }))
    } catch (error) {
      message.error('Failed to load owners')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (value) => {
    setSearch(value)
    setPagination(prev => ({ ...prev, current: 1 }))
  }

  const handleTableChange = (pag) => {
    setPagination(prev => ({
      ...prev,
      current: pag.current,
      pageSize: pag.pageSize
    }))
  }

  const handleAdd = () => {
    setEditingOwner(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (record) => {
    setEditingOwner(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  const handleDelete = (record) => {
    showDeleteConfirm({
      title: `Delete owner "${record.name}"?`,
      content: `This will also delete ${record.propertyCount || 0} associated properties and all documents.`,
      onOk: async () => {
        try {
          await ownerService.delete(record.id)
          message.success('Owner deleted successfully')
          fetchOwners()
        } catch (error) {
          message.error(error.message || 'Failed to delete owner')
        }
      }
    })
  }

  const handleModalSubmit = async () => {
    try {
      const values = await form.validateFields()
      if (editingOwner) {
        await ownerService.update(editingOwner.id, values)
        message.success('Owner updated successfully')
      } else {
        await ownerService.create(values)
        message.success('Owner created successfully')
      }
      setModalVisible(false)
      fetchOwners()
    } catch (error) {
      if (error.message) {
        message.error(error.message)
      }
    }
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: "Father's Name",
      dataIndex: 'fatherName',
      key: 'fatherName'
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone'
    },
    {
      title: 'Aadhaar',
      dataIndex: 'aadhaar',
      key: 'aadhaar',
      render: (text) => <Text code>{text}</Text>
    },
    {
      title: 'Properties',
      dataIndex: 'propertyCount',
      key: 'propertyCount',
      render: (count) => <Tag color="blue">{count || 0}</Tag>
    },
    {
      title: 'Created',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => formatDate(date)
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/owners/${record.id}`)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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
        <Title level={4} style={{ margin: 0 }}>Owners</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add Owner
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <Input.Search
            placeholder="Search by name, phone, or Aadhaar"
            allowClear
            enterButton={<SearchOutlined />}
            onSearch={handleSearch}
            style={{ maxWidth: 400 }}
          />
        </div>

        <Table
          columns={columns}
          dataSource={owners}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} owners`
          }}
          onChange={handleTableChange}
        />
      </Card>

      <Modal
        title={editingOwner ? 'Edit Owner' : 'Add Owner'}
        open={modalVisible}
        onOk={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
        okText={editingOwner ? 'Update' : 'Create'}
        width={500}
      >
        <OwnerForm form={form} isEdit={!!editingOwner} />
      </Modal>
    </div>
  )
}

export default OwnersList

import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal

export const showDeleteConfirm = ({ title, content, onOk, onCancel }) => {
  confirm({
    title: title || 'Are you sure you want to delete this?',
    icon: <ExclamationCircleOutlined />,
    content: content || 'This action cannot be undone.',
    okText: 'Yes, Delete',
    okType: 'danger',
    cancelText: 'Cancel',
    onOk,
    onCancel
  })
}

export const showConfirm = ({ title, content, onOk, onCancel, okText = 'OK' }) => {
  confirm({
    title,
    icon: <ExclamationCircleOutlined />,
    content,
    okText,
    cancelText: 'Cancel',
    onOk,
    onCancel
  })
}

export default { showDeleteConfirm, showConfirm }

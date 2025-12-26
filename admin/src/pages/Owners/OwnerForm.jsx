import { Form, Input, Select } from 'antd'

const { Option } = Select

const OwnerForm = ({ form, isEdit = false }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark="optional"
    >
      <Form.Item
        name="name"
        label="Name (नाम)"
        rules={[{ required: true, message: 'Please enter name' }]}
      >
        <Input placeholder="Enter owner name" />
      </Form.Item>

      <Form.Item
        name="fatherName"
        label="Father's/Husband's Name (पिता/पति का नाम)"
      >
        <Input placeholder="Enter father's or husband's name" />
      </Form.Item>

      <Form.Item
        name="gender"
        label="Gender (लिंग)"
        initialValue="Male"
      >
        <Select>
          <Option value="Male">Male</Option>
          <Option value="Female">Female</Option>
          <Option value="Other">Other</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone Number (फोन नंबर)"
        rules={[
          { required: true, message: 'Please enter phone number' },
          { pattern: /^[0-9]{10}$/, message: 'Please enter valid 10-digit phone number' }
        ]}
      >
        <Input placeholder="Enter 10-digit phone number" maxLength={10} />
      </Form.Item>

      {!isEdit && (
        <Form.Item
          name="aadhaar"
          label="Aadhaar Number (आधार नंबर)"
          rules={[
            { required: true, message: 'Please enter Aadhaar number' },
            { pattern: /^[0-9]{12}$/, message: 'Please enter valid 12-digit Aadhaar number' }
          ]}
        >
          <Input placeholder="Enter 12-digit Aadhaar number" maxLength={12} />
        </Form.Item>
      )}

      {isEdit && (
        <Form.Item label="Aadhaar Number (आधार नंबर)">
          <Input disabled value={form.getFieldValue('aadhaar')} />
          <span style={{ fontSize: 12, color: '#999' }}>Aadhaar cannot be changed</span>
        </Form.Item>
      )}
    </Form>
  )
}

export default OwnerForm

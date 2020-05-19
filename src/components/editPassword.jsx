import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { userEditPassword } from '../api/api'
function EditPassword ({ show, setShow }) {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const submit = () => {
    form.validateFields().then(values => {
      const params = {
        password: values.password
      }
      setLoading(true)
      userEditPassword(params).then(res => {
        if (res.code === 0) {
          message.success('重置成功')
          setLoading(false)
          form.resetFields()
          setShow(false)
        }
      }).catch(() => { setLoading(false) })
    }).catch(res => { })
  }
  return (
    <Modal
      destroyOnClose={true}
      visible={show}
      onCancel={() => { setShow(false) }}
      title='重置密码'
      onOk={submit}
      confirmLoading={loading}
    >
      <Form form={form} initialValues={{ password: undefined }}>
        <Form.Item name='password' rules={[{ required: true, message: "请输入密码" },
        { max: 13, message: "密码最长13个字符" },
        { min: 5, message: "密码最短5个字符" },
        { pattern: new RegExp(/[A-Za-z0-9_-]+$/, ''), message: '不能输入中文字符和空格' },]}>
          <Input placeholder='请输入新密码' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default EditPassword
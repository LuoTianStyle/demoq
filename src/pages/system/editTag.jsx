import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, message } from 'antd'
import { tagEdit } from '../../api/api'
function EditTag (props) {
  const { show, setShow, fetch, record } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (show) {
      form.resetFields()
    }
  }, [form, show])
  const submit = () => {
    form.validateFields().then(
      values => {
        setLoading(true)

        tagEdit({ id: record.id, name: values.name }).then(res => {
          if (res.code === 0) {
            message.success('修改成功')
            setLoading(false)
            fetch()
            setShow(false)
          }
        }).catch(() => {
          setLoading(false)
        })
      }
    ).catch()
  }
  return (
    <div>
      <Modal
        destroyOnClose
        confirmLoading={loading}
        title='修改标签'
        visible={show}
        onCancel={() => { setShow(false) }}
        onOk={submit}
      >
        <Form form={form} initialValues={{ name: record.name }}>
          <Form.Item name='name' rules={[{ required: true, message: '标签不能为空' }, {
            max: 20, message: '标签名称最小1位最长不能超过20位'
          }]}>
            <Input placeholder='请输入标签名' />
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
}
export default EditTag
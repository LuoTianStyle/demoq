import React, { useState, useEffect } from 'react'
import { Form, Modal, Input, message } from 'antd'
import { tagInsert } from '../../api/api'
function AddTag (props) {
  const { show, setShow, fetch } = props
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (show) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])
  const submit = () => {
    setLoading(true)
    form.validateFields().then(
      values => {
        tagInsert(values).then(res => {
          if (res.code === 0) {
            message.success('添加成功')
            setLoading(false)
            fetch()
            form.resetFields()
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
        confirmLoading={loading}
        title='添加标签'
        visible={show}
        onCancel={() => { setShow(false) }}
        onOk={submit}
      >
        <Form form={form}>
          <Form.Item name='name' rules={[{ required: true, message: '标签不能为空' }, {
            max: 20, message: '标签名称最小1位最长不能超过20位'
          }]}>
            <Input placeholder='请输入标签名' />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
export default AddTag
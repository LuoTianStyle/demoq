import React, { useState, useEffect } from 'react'
import { Modal, Form, Input, message } from 'antd'
import { folderInsert } from './../api/api'
function NewDir (props) {
  const { show, setShow, parentId, fetchData } = props
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const submit = () => {
    setLoading(true)
    form.validateFields().then(values => {
      const params = { parentId, name: values.name }
      folderInsert(params).then(res => {
        if (res.code === 0) {
          const data = { id: res.data.id }
          setLoading(false)
          message.success('添加文件夹成功')
          fetchData(data.id + '')
          form.resetFields()
          setShow(false)
        }
      }).catch(() => { setLoading(false) })
    }).catch(
      () => {
        setLoading(false)
      }
    )
  }
  return (
    <Modal
      title='新建文件夹'
      confirmLoading={loading}
      visible={show}
      onCancel={() => {
        form.resetFields()
        setShow(false)
      }}
      destroyOnClose={true}
      onOk={submit}
    >
      <Form
        form={form}
      >
        <Form.Item name='name' rules={[{ required: true, message: '文件夹名不能为空' }, { max: 20, message: '文件夹名称不能超过20个字符' }]}>
          <Input placeholder='请输入文件夹名' />
        </Form.Item>
      </Form>
    </Modal>
  );
}
export default NewDir
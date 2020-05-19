import React, { useState, useEffect, useContext } from 'react'
import { Modal, Input, Form, message } from 'antd'
import DocContext from './context';
import { folderEdit } from './../../api/api'
const { Item } = Form
function ReName (props) {
  const { setShow, show, record, type, fetchSearchData } = props
  const [loading, setLoading] = useState(false)
  const docContext = useContext(DocContext)

  const [form] = Form.useForm();
  const submit = (e) => {
    setLoading(true)
    form.validateFields().then(values => {
      const params = { id: record.id, name: values.name, parentId: record.parentId }
      folderEdit(params).then(res => {
        message.success('修改成功')
        setLoading(false)
        setShow(false)
        if (type === 'search') {
          fetchSearchData()
        } else {
          const { breadPath, enterDir, currentPath } = docContext
          enterDir(currentPath)
        }
      })
    }).catch(info => {
      setLoading(false)
    });
  }
  return (
    <div>
      <Modal
        confirmLoading={loading}
        destroyOnClose={true}
        visible={show}
        title='重命名'
        onOk={submit}
        onCancel={() => { setShow(false) }}
      >
        <Form
          initialValues={{ name: record.name }}
          form={form}
        >
          <Item
            name='name'
            label=''
            rules={[{ required: true, message: "名字不能为空" },
            { max: 20, message: '名字不能超过20个字符' }
            ]}>
            <Input />
          </Item>
        </Form>
      </Modal>
    </div>
  );
}
export default ReName
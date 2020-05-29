import React, { useState, useEffect, useContext } from 'react'
import { Modal, Form, Select, message, Spin } from 'antd'
import { tagGetList, fileEidtTag } from './../../api/api'
import DocContext from './context';
const { Item } = Form
function TagManage (props) {
  const { show, setShow, record, type, fetchSearchData } = props
  const [loading, setLoading] = useState(false)
  const [selectLoading, setSelectLoading] = useState(false)
  const [tagList, settagList] = useState([])
  const [form] = Form.useForm();
  const [initValue, setInitValue] = useState('')
  const docContext = useContext(DocContext)
  useEffect(() => {
    if (show) {
      form.resetFields()
      setSelectLoading(true)
      tagGetList().then(res => {
        if (res.code === 0) {
          setSelectLoading(false)
          settagList(res.data)
          setInitValue({ tagIds: record.tags.map(item => item.id) })
        }
      }).catch(() => { setSelectLoading(false) })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show])
  const submit = () => {
    form.validateFields().then(res => {
      setLoading(true)
      const params = { tagIds: res.tagIds, id: record.id }
      fileEidtTag(params).then(res => {
        message.success('修改成功')
        setLoading(false)
        if (type === 'search') {
          fetchSearchData()
        } else {
          const { breadPath, enterDir, currentPath, pageData } = docContext
          enterDir(currentPath, pageData.page, pageData.perPage)
        }
        setShow(false)
      }).catch(() => {
        setLoading(false)
      })
    })

  }
  return (
    <div>
      <Modal
        maskClosable={false}
        confirmLoading={loading}
        destroyOnClose={true}
        visible={show}
        title='标签管理'
        onOk={submit}
        onCancel={() => { setShow(false) }}
      >
        <Form
          initialValues={initValue}
          form={form}
        >
          <Item
            name='tagIds'
            label=''>
            <Select
              // disabled={selectLoading}
              // notFoundContent='加载中...'
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="请选择标签"
              notFoundContent={selectLoading ? <Spin size="small" /> : null}
            >
              {tagList.map(item => (<Select.Option value={item.id} key={item.id}>{item.name}</Select.Option>))}
            </Select>
          </Item>
        </Form>
      </Modal>
    </div >
  );
}
export default TagManage
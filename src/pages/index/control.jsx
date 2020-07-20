import React, { useState, useEffect } from 'react'
import { Select, Input, DatePicker, Button } from 'antd'
import NbUpload from './../../components/upLoad'
import { withRouter } from 'react-router-dom'
import MoveFile from './moveFile'
import { tagGetList } from './../../api/api'
const { RangePicker } = DatePicker;
const { Option } = Select
function Control ({ setDirShow, currentPath, fetchData, history, selectedRows }) {
  const [searchColumn, setsearchColumn] = useState('name')
  const [searchValue, setsearchValue] = useState('')
  const [dateSearchData, setdateSearchData] = useState([])
  const [tagList, setTagList] = useState([])
  const [moveFileShow, setMoveFileShow] = useState(false)
  useEffect(() => {
    tagGetList().then(res => {
      if (res.code === 0) {
        setTagList([...res.data])
      }
    }).catch()
  }, [])
  const search = () => {
    const params = [{ searchColumn, searchValue, searchOperator: searchColumn === 'name' ? 'like' : '=' },
    { searchColumn: 'folder', searchValue: 1, searchOperator: '=' }].concat(dateSearchData)
    history.push(`/search/${JSON.stringify(params)}`)
  }
  return (
    <div style={{ background: '#fff', padding: 15, margin: 10, }}>
      <Select value={searchColumn} style={{ width: 150, margin: 5 }} onChange={(e) => { setsearchColumn(e) }}>
        <Option value={'name'}>文件名称</Option>
        <Option value={'tagIds'}>标签</Option>
      </Select>
      {searchColumn === 'name' ? <Input placeholder="请输入文件名称" onChange={(e) => { setsearchValue(e.target.value) }} style={{ width: 150, margin: 5 }} /> : <Select placeholder="请选择文件标签" onChange={(e) => { setsearchValue(e) }} style={{ width: 150, margin: 5 }}>
        {tagList.map(item => (<Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>))}
      </Select>}

      添加时间
      <RangePicker onChange={(e, dateString) => {
        const beginTime = new Date(dateString[0] + ' 00:00:00').getTime() / 1000;
        const endTime = new Date(dateString[1] + ' 23:59:59').getTime() / 1000;
        setdateSearchData([{
          searchColumn: 'createAt',
          searchOperator: '>=',
          searchValue: beginTime
        }, {
          searchColumn: 'createAt',
          searchOperator: '<=',
          searchValue: endTime
        }])
      }} style={{ margin: 5 }} />
      <Button style={{ margin: 5 }} onClick={() => { search() }}>搜索</Button>
      <NbUpload fetchData={fetchData} currentPath={currentPath} style={{ margin: 5 }}>上传</NbUpload>
      <Button type="primary" style={{ margin: 5 }} onClick={() => { setDirShow(true) }}>新建文件夹</Button>
      <Button type='primary' disabled={selectedRows.length === 0} onClick={() => { setMoveFileShow(true) }}>移动</Button>
      <MoveFile
        selectedRows={selectedRows}
        show={moveFileShow}
        setShow={setMoveFileShow}
      />
    </div>
  );
}
export default withRouter(Control)
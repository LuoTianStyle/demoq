/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { Button, Table, Tag } from 'antd'
import TableDropDown from './../index/tableDropDown'

import { fileGetList, fileGetListByTag } from './../../api/api'
import { FolderTwoTone, FileExcelTwoTone, UnorderedListOutlined } from '@ant-design/icons';
import GLOBAL from '../../utils/utils'
const ControlLayout = styled.div`
  padding:20px;
  margin:10px;
  background:#fff;

`
const NameStyle = styled.span`
cursor:pointer;
`
function Search ({ history, match }) {
  const [loading, setLoading] = useState(false)
  const [pageData, setPageData] = useState({ total: 0, page: 1, perPage: 10, currentPage: 1 })
  const [dataSource, setdataSource] = useState([])
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchData = (page = 1, perPage = 10) => {
    const routerParams = JSON.parse(match.params.params)
    if (routerParams.some(item => item.searchColumn === 'tagIds')) {
      fileGetListByTag({ page, perPage, tagIds: [routerParams.find(item => item.searchColumn === 'tagIds').searchValue] }).then(res => { handleData(res) }).catch(() => { setLoading(false) })
    } else {
      fileGetList({ searchParam: routerParams, page, perPage }).then(res => { handleData(res) }).catch(() => { setLoading(false) })
    }
  }
  const handleData = (res) => {
    setdataSource(res.data.data)
    setPageData({ ...pageData, total: res.data.total, currentPage: res.data.current_page, page: params.page, perPage: params.perPage })
    setLoding(false)

  }
  const columns = [
    {
      title: '名称', dataIndex: 'name', render: (e, record) => <span><FileExcelTwoTone twoToneColor='#E9967A' />{e}</span>
    },
    { title: '添加时间', dataIndex: 'createAt', render: (e) => <span>{GLOBAL.toTime(e * 1000, 1)}</span> },
    { title: '标签', dataIndex: 'tags', render: e => e.map(item => <Tag key={item.id} color="blue">{item.name}</Tag>) },
    {
      title: '操作', dataIndex: 'action', render: (_, record) => {
        return <NameStyle>
          <TableDropDown
            fetchData={fetchData}
            record={record}
            type={'search'}//此type为了区分和主云盘的操作栏下拉菜单功能
          >
            <UnorderedListOutlined
            />
          </TableDropDown>
        </NameStyle>
      }
    }
  ]
  useEffect(() => {
    fetchData()
  }, [])

  return (
    <div>
      <ControlLayout>
        <Button onClick={() => { history.push('/') }} style={{ margin: 5 }}>返回云盘</Button>
      </ControlLayout>
      <Table
        loading={loading}
        style={{ margin: '0 10px' }}
        rowKey='id'
        columns={columns}
        dataSource={dataSource}
        pagination={{
          showSizeChanger: true,
          total: pageData.total,
          onChange: (page, perPage) => {
            setPageData({ ...pageData, page, perPage })
            fetchData(page, perPage)
          },
          showTotal: (total, range) => `统计:${total}个,这是第${range[0]}-${range[1]}个`,
          onShowSizeChange: (current, size) => {
            setPageData({ ...pageData, currentPage: current, perPage: size })
            fetchData(current, size)
          },
          current: pageData.currentPage
        }}
      />
    </div>
  );
}
export default withRouter(Search) 
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import Control from './control'
import BreadPath from './../../components/BreadPath'
import TableDropDown from './tableDropDown'
import { Table, Tag, message } from 'antd'
import { fileGetList, fileDownloadDD } from './../../api/api'
import { FolderTwoTone, FileExcelTwoTone, UnorderedListOutlined } from '@ant-design/icons';
import GLOBAL from '../../utils/utils';
import DocContext from './context'
import * as dd from "dingtalk-jsapi";
import NewDir from './../../components/newDir'
import GlobalLoadingContext from './../../components/globalContext'
import { useContext } from 'react';
const NameStyle = styled.span`
cursor:pointer;
`
function Index () {
  const [dataSource, setdataSource] = useState([])
  const [currentPath, setCurrentPath] = useState({ folderId: 0, name: '云盘' })
  const [breadPath, setBreadPath] = useState([])
  const [pageData, setPageData] = useState({ total: 0, page: 1, perPage: 10, currentPage: 1 })
  const [loading, setLoding] = useState(false)
  const [dirShow, setDirShow] = useState(false)
  const [selectedRows, setSelectedRows] = useState([])
  const setGlobalLoading = useContext(GlobalLoadingContext).setGlobalLoading
  useEffect(() => {
    enterDir(currentPath)
  }, [])

  //进入文件夹
  const enterDir = (path, page, perPage) => {
    const searchParam = [{ searchColumn: 'parentId', searchOperator: '=', searchValue: path.folderId }]
    if (page) {
      setPageData({ ...pageData, page })
    }
    if (perPage) {
      setPageData({ ...pageData, perPage })
    }
    const params = {
      searchParam,
      page: page ? page : pageData.page,
      perPage: perPage ? perPage : pageData.perPage
    }
    const oldPath = Array.from(breadPath)
    const currentPathIdx = oldPath.findIndex(item => item.folderId === path.folderId)
    if (currentPathIdx >= 0) {
      oldPath.splice(currentPathIdx + 1, oldPath.length - currentPathIdx + 1)
    } else {
      oldPath.push({ folderId: path.folderId, name: path.name })
    }
    setCurrentPath({ folderId: path.folderId, name: path.name })
    setBreadPath(oldPath)
    fetchData(params)
  }
  //翻页
  const pageDown = (page, perPage) => {
    const searchParam = [{ searchColumn: 'parentId', searchOperator: '=', searchValue: currentPath.folderId }]
    const params = {
      searchParam,
      page: page,
      perPage: perPage
    }
    fetchData(params)
  }
  const fetchData = (params) => {
    setLoding(true)
    fileGetList(params).then(res => {
      if (res.code === 0) {
        setPageData({ ...pageData, total: res.data.total, currentPage: res.data.current_page, page: params.page, perPage: params.perPage })
        setdataSource(res.data.data)
        setSelectedRows([])
        setLoding(false)
      }
    }).catch(() => {
      setLoding(false)
    })
  }
  const downloadFile = (record) => {

    if (record.processInstanceId) {
      if (dd.env.platform === "notInDingTalk") {
        message.warn('请在钉钉中打开')
      } else {
        setGlobalLoading(true)
        if (!localStorage.getItem('ddUserInfo')) {
          localStorage.setItem('userData', '');
          localStorage.setItem('ddUserInfo', '');
          location.reload();
        }
        fileDownloadDD({
          uuid: record.uuid,
          dingtalkUserId: JSON.parse(localStorage.getItem('ddUserInfo')).userid
        }).then(res => {
          const { spaceId,
            fileId,
            fileName,
            fileSize,
            fileType, } = res.data
          dd.biz.cspace.preview({
            corpId: JSON.parse(localStorage.getItem('ddUserInfo')).corpId,
            spaceId,
            fileId,
            fileName,
            fileSize,
            fileType,
            onSuccess: function () {
              setGlobalLoading(false)

              //无，直接在native显示文件详细信息
            },
            onFail: function (err) {
              setGlobalLoading(false)

              message.error('网络错误请求失败')
              // 无，直接在native页面显示具体的错误
            }
          });
        }).catch(() => {
          setGlobalLoading(false)
        })
        /*
        钉钉下载
        */
      }
    } else {
      window.open(`${GLOBAL.apiUrl}/file/download?uuid=${record.uuid}&token=${JSON.parse(localStorage.getItem('userData')).token}`)
    }
  }
  const columns = [
    {
      title: '名称', dataIndex: 'name', render: (e, record) => {
        if (record.folder === 2) {
          return <NameStyle onClick={() => {
            enterDir({ folderId: record.id, name: e }, 1, 10)
          }}><FolderTwoTone />{e}</NameStyle>
        } else {
          return <NameStyle onClick={() => { downloadFile(record) }}><FileExcelTwoTone twoToneColor='#E9967A' />{e}</NameStyle>
        }
      }
    },
    { title: '添加时间', dataIndex: 'createAt', render: (e) => <span>{GLOBAL.toTime(e * 1000, 1)}</span> },
    { title: '标签', dataIndex: 'tags', render: e => e.map(item => <Tag key={item.id} color="blue">{item.name}</Tag>) },
    {
      title: '操作', dataIndex: 'action', render: (_, record) => {
        return <NameStyle>
          <TableDropDown
            record={record}
            downloadFile={downloadFile}
          >
            <UnorderedListOutlined
            />
          </TableDropDown>
        </NameStyle>
      }
    }
  ]
  return (
    <DocContext.Provider value={{ breadPath, enterDir, currentPath }}>

      <div>
        <Control
          fetchData={() => { enterDir(currentPath) }}
          currentPath={currentPath}
          setDirShow={setDirShow}
          selectedRows={selectedRows}
          setSelectedRows={setSelectedRows}
        />
        <div style={{ margin: '0 10px', background: '#fff' }}>
          <BreadPath
            breadPath={breadPath}
            enterDir={enterDir}
          />
        </div>
        <Table
          loading={loading}
          style={{ margin: '0 10px' }}
          rowKey='id'
          columns={columns}
          dataSource={dataSource}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedIds) => {
              setSelectedRows(selectedIds)
            },
            selectedRowKeys: selectedRows
          }}
          pagination={{
            showSizeChanger: true,
            total: pageData.total,
            onChange: (page, perPage) => {
              setPageData({ ...pageData, page, perPage })
              pageDown(page, perPage)
            },
            showTotal: (total, range) => `统计:${total}个,这是第${range[0]}-${range[1]}个`,
            onShowSizeChange: (current, size) => {
              setPageData({ ...pageData, currentPage: current, perPage: size })
              pageDown(current, size)
            },
            current: pageData.currentPage
          }}
        />
        <NewDir
          show={dirShow}
          setShow={setDirShow}
          parentId={currentPath.folderId}
          fetchData={() => { enterDir(currentPath) }}
        />
      </div>
    </DocContext.Provider>

  );
}
export default Index